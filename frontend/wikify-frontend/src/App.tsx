import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapStartModal from "./components/BootstrapStartModal";
import CategorySuggestions from "./components/CategorySuggestions";

interface UserProfile {
  username: string;
  categories: string[];
}

const COOKIE_EXPIRY_DAYS = 7;

// All possible categories (same as in modal)
const ALL_CATEGORIES = [
  "Science",
  "History",
  "Politics",
  "Technology",
  "Health",
  "Art",
  "Environment",
  "Culture",
  "Economics",
];

// Simple divider component
const Divider: React.FC = () => (
  <div
    style={{
      margin: "2rem 0",
      borderTop: "2px solid #007bff", // Bootstrap primary color blue line
      width: "100%",
    }}
  />
);

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Track done/total/score for articles in CategorySuggestions
  const [doneCount, setDoneCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const username = Cookies.get("username");
    const categoriesCookie = Cookies.get("categories");
    let categories: string[] = [];

    if (categoriesCookie) {
      try {
        categories = JSON.parse(categoriesCookie);
      } catch {
        categories = [];
      }
    }

    if (username && categories.length > 0) {
      setUserProfile({ username, categories });
    }
  }, []);

  const handleModalSubmit = (profile: UserProfile) => {
    Cookies.set("username", profile.username, { expires: COOKIE_EXPIRY_DAYS });
    Cookies.set("categories", JSON.stringify(profile.categories), {
      expires: COOKIE_EXPIRY_DAYS,
    });
    setUserProfile(profile);
  };

  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("categories");
    setUserProfile(null);
  };

  // Toggle categories live on main page
  const toggleCategory = (category: string) => {
    if (!userProfile) return;
    let newCategories: string[];
    if (userProfile.categories.includes(category)) {
      newCategories = userProfile.categories.filter((c) => c !== category);
    } else {
      newCategories = [...userProfile.categories, category];
    }

    const updatedProfile = { ...userProfile, categories: newCategories };
    setUserProfile(updatedProfile);

    // Save updated categories to cookies
    Cookies.set("categories", JSON.stringify(newCategories), {
      expires: COOKIE_EXPIRY_DAYS,
    });
  };

  const handleSearchAgain = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="App">
      {!userProfile && <BootstrapStartModal onSubmit={handleModalSubmit} />}

      {userProfile && (
        <>
          {/* Fixed Banner */}
          <div
            style={{
              position: "fixed",
              top: 0,
              width: "100%",
              zIndex: 1000,
              backgroundColor: "#1f2a38",
            }}
            className="text-white p-3 shadow d-flex align-items-center"
          >
            <div className="container d-flex justify-content-between align-items-center">
              {/* Left side */}
              <div
                style={{
                  minWidth: 150,
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                Wikify
              </div>

              {/* Right side: Welcome + Logout */}
              <div className="text-end flex-grow-1 ms-3 d-flex flex-column align-items-end gap-2">
                <h1 className="h5 mb-1">
                  Welcome, <strong>{userProfile.username}</strong>!
                </h1>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                  onClick={handleLogout}
                  title="Logout"
                  style={{
                    borderRadius: "20px",
                    padding: "0.25rem 0.75rem",
                    fontWeight: "600",
                  }}
                >
                  <span
                    role="img"
                    aria-label="logout"
                    style={{ fontSize: "1rem" }}
                  >
                    🔓
                  </span>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content below fixed banner */}
          <div className="container mt-5 pt-5">
            <div
              className="d-flex flex-wrap align-items-center gap-3"
              style={{ justifyContent: "space-between" }}
            >
              {/* Interests + Refresh Button container */}
              <div
                className="d-flex flex-wrap align-items-center gap-2 mt-4"
                style={{ flexGrow: 1, minWidth: 0 }}
              >
                <h6 style={{ flexBasis: "100%", marginBottom: "0.5rem" }}>
                  Your Interests:
                </h6>
                <div
                  className="d-flex flex-wrap gap-2"
                  style={{ flexGrow: 1, minWidth: 0 }}
                >
                  {ALL_CATEGORIES.map((cat) => {
                    const isSelected = userProfile.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`btn btn-sm ${
                          isSelected ? "btn-primary" : "btn-outline-primary"
                        }`}
                        onClick={() => toggleCategory(cat)}
                      >
                        {cat}
                        {isSelected && (
                          <span
                            style={{ marginLeft: 6, fontWeight: "bold" }}
                            aria-label="Remove"
                          >
                            &times;
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Refresh button on the side */}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleSearchAgain}
                  title="Refresh suggestions"
                  style={{ whiteSpace: "nowrap", marginLeft: "auto" }}
                >
                  🔁 Refresh
                </button>
              </div>
            </div>

            {/* Status/Score Section with multi-column paragraphs */}
            <div
              style={{
                marginTop: "1.5rem",
                backgroundColor: "#e0f7fa",
                color: "#006064",
                padding: "1rem 1.5rem",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 10px rgba(0, 96, 100, 0.2)",
                userSelect: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                columnCount: 2,
                columnGap: "1.5rem",
              }}
            >
              <p style={{ marginBottom: "0.5rem" }}>
                🔍 <strong>{totalCount}</strong> article
                {totalCount !== 1 ? "s" : ""} found —{" "}
                <span style={{ color: "#00796b" }}>
                  <strong>{doneCount}</strong>/<strong>{totalCount}</strong>{" "}
                  marked as done
                </span>
              </p>
              <p
                style={{ fontSize: "1rem", fontWeight: 500, color: "#004d40" }}
              >
                💪 Total cleanup messages contributed: <strong>{score}</strong>
              </p>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontStyle: "italic",
                  color: "#004d40",
                }}
              >
                Keep going — every edit helps make Wikipedia better! 🚀
              </p>
            </div>
          </div>

          {/* Accordion for Suggestions */}
          <div className="container mt-3">
            <div className="row">
              <div className="col-12">
                <div className="accordion w-100" id="suggestionsAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingSuggestions">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSuggestions"
                        aria-expanded="true"
                        aria-controls="collapseSuggestions"
                      >
                        Suggested Wikipedia Articles for Cleanup
                      </button>
                    </h2>
                    <div
                      id="collapseSuggestions"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingSuggestions"
                      data-bs-parent="#suggestionsAccordion"
                    >
                      <div
                        className="accordion-body"
                        style={{
                          padding: "1rem 1.5rem",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "0 0 0.375rem 0.375rem",
                          boxShadow: "0 2px 6px rgb(0 0 0 / 0.1)",
                        }}
                      >
                        <CategorySuggestions
                          key={refreshKey}
                          categories={userProfile.categories}
                          onDoneUpdate={setDoneCount}
                          onTotalUpdate={setTotalCount}
                          onScoreUpdate={setScore}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
