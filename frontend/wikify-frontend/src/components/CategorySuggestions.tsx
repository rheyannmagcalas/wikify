import React, { useState, useEffect } from "react";

interface CategorySuggestionsProps {
  categories: string[];
  onDoneUpdate?: (doneCount: number) => void;
  onTotalUpdate?: (totalCount: number) => void;
  onScoreUpdate?: (score: number) => void;
}

interface Article {
  pageid: number;
  title: string;
  relatedCategories: string[];
  cleanup_messages: string[];
  relevance: number;
}

type SortKey = "cleanupCount" | "relevance" | null;

const CategorySuggestions: React.FC<CategorySuggestionsProps> = ({
  categories,
  onDoneUpdate,
  onTotalUpdate,
  onScoreUpdate,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [doneArticles, setDoneArticles] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryParam = encodeURIComponent(categories.join(","));
        const response = await fetch(
          `http://localhost:8000/recommendations?categories=${categoryParam}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching: ${response.statusText}`);
        }
        const data = await response.json();
        setArticles(data.recommendations || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categories]);

  useEffect(() => {
    const doneCount = articles.filter((a) => doneArticles.has(a.pageid)).length;
    const totalCount = articles.length;
    const score = articles
      .filter((a) => doneArticles.has(a.pageid))
      .reduce((acc, a) => acc + a.cleanup_messages.length, 0);

    if (onDoneUpdate) onDoneUpdate(doneCount);
    if (onTotalUpdate) onTotalUpdate(totalCount);
    if (onScoreUpdate) onScoreUpdate(score);
  }, [doneArticles, articles, onDoneUpdate, onTotalUpdate, onScoreUpdate]);

  const sortedArticles = [...articles].sort((a, b) => {
    if (!sortKey) return 0;
    const getValue = (article: Article) =>
      sortKey === "cleanupCount"
        ? article.cleanup_messages.length
        : article.relevance;

    const valA = getValue(a);
    const valB = getValue(b);

    return sortDirection === "asc" ? valA - valB : valB - valA;
  });

  const onSortClick = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  const toggleDone = (pageid: number) => {
    setDoneArticles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageid)) {
        newSet.delete(pageid);
      } else {
        newSet.add(pageid);
      }
      return newSet;
    });
  };

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (articles.length === 0) {
    return <div>No recommendations found.</div>;
  }

  return (
    <section className="container mt-4">
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Categories</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => onSortClick("cleanupCount")}
              >
                Cleanup Message Count{renderSortArrow("cleanupCount")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => onSortClick("relevance")}
              >
                Relevance{renderSortArrow("relevance")}
              </th>
              <th scope="col">Cleanup Messages</th>
              <th scope="col">Mark as Done</th>
            </tr>
          </thead>
          <tbody>
            {sortedArticles.map((article) => (
              <tr
                key={article.pageid}
                className={
                  doneArticles.has(article.pageid) ? "table-success" : ""
                }
              >
                <td>
                  <a
                    href={`https://en.wikipedia.org/?curid=${article.pageid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fw-bold"
                  >
                    {article.title}
                  </a>
                </td>
                <td>{article.relatedCategories.join(", ")}</td>
                <td>{article.cleanup_messages.length}</td>
                <td>{article.relevance}</td>
                <td>
                  {article.cleanup_messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => toggleDone(article.pageid)}
                    style={{
                      minWidth: "100px",
                      backgroundColor: doneArticles.has(article.pageid)
                        ? "#4caf50"
                        : "#f78f1e",
                      color: "white",
                      border: "none",
                    }}
                  >
                    {doneArticles.has(article.pageid)
                      ? "✓ Done"
                      : "Mark as Done"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CategorySuggestions;
