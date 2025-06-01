import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapStartModal from "./components/BootstrapStartModal";
import CategorySuggestions from "./components/CategorySuggestions";
import TopSearches from "./components/TopSearches";

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
            style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
            className="bg-primary text-white p-3 shadow d-flex align-items-center"
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
                WikiQuest
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
            <div className="mb-4 mt-3">
              <h6>Your Interests:</h6>
              <div className="d-flex align-items-center flex-wrap gap-2">
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
            </div>

            {/* Accordion for Suggestions */}
            <div className="accordion" id="suggestionsAccordion">
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
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <span>comp</span>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent accordion toggle
                          handleSearchAgain();
                        }}
                        title="Refresh suggestions"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        🔁 Search Again
                      </button>
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseSuggestions"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingSuggestions"
                  data-bs-parent="#suggestionsAccordion"
                >
                  <div className="accordion-body p-0">
                    {
                      <CategorySuggestions
                        key={refreshKey}
                        categories={userProfile.categories}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Divider between suggestions and top searches */}
            <Divider />

            <TopSearches />
          </div>
        </>
      )}
    </div>
  );
};

export default App;

// export default function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:8000/")
//       .then((res) => res.json())
//       .then((data) => setMessage(data.message))
//       .catch(() => setMessage("Failed to fetch message"));
//   }, []);

//   return (
//     <div style={{ padding: 20, fontFamily: "Arial" }}>
//       <h1>Wikify Frontend (React + FastAPI)</h1>
//       <p>
//         Backend says: <strong>{message}</strong>
//       </p>
//     </div>
//   );
// }
