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

const staticArticles: Article[] = [
  {
    pageid: 12345,
    title: "Science Article 1",
    relatedCategories: ["Science", "Technology"],
    cleanup_messages: ["Message 1 about cleanup", "Additional cleanup note"],
    relevance: 85,
  },
  {
    pageid: 67890,
    title: "History Article 2",
    relatedCategories: ["History"],
    cleanup_messages: ["Single cleanup message"],
    relevance: 65,
  },
  {
    pageid: 11223,
    title: "Health Article 3",
    relatedCategories: ["Health", "Science"],
    cleanup_messages: [
      "First cleanup message",
      "Second cleanup message",
      "Third cleanup note",
    ],
    relevance: 92,
  },
];

type SortKey = "cleanupCount" | "relevance" | null;

const CategorySuggestions: React.FC<CategorySuggestionsProps> = ({
  categories,
  onDoneUpdate,
  onTotalUpdate,
  onScoreUpdate,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [doneArticles, setDoneArticles] = useState<Set<number>>(new Set());

  const filteredArticles = staticArticles.filter((article) =>
    article.relatedCategories.some((cat) => categories.includes(cat))
  );

  // Update counts & scores whenever doneArticles or filteredArticles change
  useEffect(() => {
    const doneCount = filteredArticles.filter((a) =>
      doneArticles.has(a.pageid)
    ).length;
    const totalCount = filteredArticles.length;
    const score = filteredArticles
      .filter((a) => doneArticles.has(a.pageid))
      .reduce((acc, a) => acc + a.cleanup_messages.length, 0);

    if (onDoneUpdate) onDoneUpdate(doneCount);
    if (onTotalUpdate) onTotalUpdate(totalCount);
    if (onScoreUpdate) onScoreUpdate(score);
  }, [
    doneArticles,
    filteredArticles,
    onDoneUpdate,
    onTotalUpdate,
    onScoreUpdate,
  ]);

  const sortedArticles = [...filteredArticles].sort((a, b) => {
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
            {sortedArticles.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No suggestions available.
                </td>
              </tr>
            ) : (
              sortedArticles.map((article) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CategorySuggestions;
