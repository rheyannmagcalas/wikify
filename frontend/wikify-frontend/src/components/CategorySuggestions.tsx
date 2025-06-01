import React, { useState, useEffect } from "react";

interface CategorySuggestionsProps {
  categories: string[];
}

interface Article {
  pageid: number;
  title: string;
  relatedCategories: string[];
  views: number;
}

const CategorySuggestions: React.FC<CategorySuggestionsProps> = ({
  categories,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);

  const normalize = (s: string) => s.toLowerCase().replace(/[_-]/g, " ").trim();

  const fetchPageviews = async (_pageTitle: string): Promise<number> => {
    return 0; // Disabled for now due to CORS
  };

  const fetchArticleCategories = async (pageid: number): Promise<string[]> => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=categories&pageids=${pageid}&cllimit=50&format=json`
      );
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages && pages[pageid]?.categories) {
        return pages[pageid].categories.map((c: any) =>
          c.title.replace("Category:", "")
        );
      }
    } catch (err) {
      console.error("fetchArticleCategories error:", err);
    }
    return [];
  };

  const fetchArticlesByRelevance = async (category: string) => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=incategory:"${category}"&srlimit=10&format=json`
      );
      const data = await res.json();

      const titles = data.query?.search?.map((item: any) => item.title) || [];

      // Fetch pageids and metadata using titles
      if (titles.length === 0) return [];

      const titleParam = titles
        .map((t: string) => encodeURIComponent(t))
        .join("|");

      const detailsRes = await fetch(
        `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${titleParam}&format=json`
      );
      const detailsData = await detailsRes.json();

      const pages = Object.values(detailsData.query?.pages || {}) as any[];

      return pages.map((page: any) => ({
        pageid: page.pageid,
        title: page.title,
        relatedCategories: [category],
        views: 0,
      }));
    } catch (err) {
      console.error("fetchArticlesByRelevance error:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      let allArticles: Article[] = [];

      for (const category of categories) {
        const articlesForCategory = await fetchArticlesByRelevance(category);
        allArticles.push(...articlesForCategory);
      }

      // Deduplicate by pageid
      const uniqueArticlesMap = new Map<number, Article>();
      allArticles.forEach((article) => {
        if (!uniqueArticlesMap.has(article.pageid)) {
          uniqueArticlesMap.set(article.pageid, article);
        }
      });

      const uniqueArticles = Array.from(uniqueArticlesMap.values());

      const articlesWithDetails = await Promise.all(
        uniqueArticles.map(async (article) => {
          const [views, articleCategories] = await Promise.all([
            fetchPageviews(article.title),
            fetchArticleCategories(article.pageid),
          ]);

          const relatedCategories = articleCategories.filter((c) =>
            categories.map(normalize).includes(normalize(c))
          );

          return { ...article, views, relatedCategories };
        })
      );

      setArticles(articlesWithDetails);
    };

    if (categories.length > 0) {
      fetchArticles();
    }
  }, [categories]);

  return (
    <section className="container mt-4">
      <ul className="list-group">
        {articles.map(({ pageid, title, views, relatedCategories }) => (
          <li
            key={pageid}
            className="list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row"
          >
            <div>
              <a
                href={`https://en.wikipedia.org/?curid=${pageid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fw-bold"
              >
                {title}
              </a>
              <br />
              <small className="text-muted">
                Related categories:{" "}
                {relatedCategories.length > 0
                  ? relatedCategories.join(", ")
                  : "None"}
              </small>
            </div>
            <span className="badge bg-secondary mt-2 mt-md-0">
              Views: {views.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CategorySuggestions;
