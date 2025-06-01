import React, { useEffect, useState } from "react";

interface WikiArticle {
  article: string;
  views: number;
  rank: number;
}

const TopSearches: React.FC = () => {
  const [pages, setPages] = useState<WikiArticle[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          "https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/2025/05/25"
        );
        const data = await res.json();

        if (data.items && data.items[0]?.articles) {
          const top = data.items[0].articles
            .filter(
              (a: any) =>
                a.article !== "Main_Page" && !a.article.startsWith("Special:")
            )
            .slice(0, 10);

          setPages(top);
        }
      } catch (error) {
        console.error("Error fetching top searches:", error);
      }
    };

    fetchTrending();
  }, []);

  return (
    <section className="container mt-4">
      <h2>Top Wikipedia Searches</h2>
      <ul className="list-group">
        {pages.map((page) => (
          <li key={page.article} className="list-group-item">
            <a
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                page.article
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {decodeURIComponent(page.article.replace(/_/g, " "))}
            </a>{" "}
            – {page.views.toLocaleString()} views
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TopSearches;
