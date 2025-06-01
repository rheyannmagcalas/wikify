import React, { useEffect, useState } from "react";

const BootstrapStartModal = ({
  onSubmit,
}: {
  onSubmit: (profile: { username: string; categories: string[] }) => void;
}) => {
  const [show, setShow] = useState(true);
  const [username, setUsername] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const categoryOptions = [
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

  const handleCategoryToggle = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    if (!username.trim() || categories.length === 0) {
      alert("Please enter a username and select at least one category.");
      return;
    }
    onSubmit({ username: username.trim(), categories });
    setShow(false);
  };

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Welcome to Wikify</h5>
          </div>
          <div className="modal-body">
            <label className="form-label">
              Please enter your wikipedia username:
            </label>
            <input
              type="text"
              className="form-control mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="form-label">Select your interests:</label>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {categoryOptions.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`btn btn-sm ${
                    categories.includes(cat)
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => handleCategoryToggle(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success w-100" onClick={handleSubmit}>
              Let’s Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootstrapStartModal;
