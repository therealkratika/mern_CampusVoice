import React from "react";
import "../css/ComaprisonModal.css";

export function ComparisonModal({ professors, branches, isOpen, onClose, onViewProfile }) {
  if (!isOpen) return null;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.floor(rating) ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  const getBranchNames = (branchIds) => {
    return branchIds
      .map((id) => branches.find((b) => b.id === id)?.code)
      .filter(Boolean)
      .join(", ");
  };

  const getSemesterRange = (semesters) => {
    if (semesters.length === 0) return "N/A";
    const min = Math.min(...semesters);
    const max = Math.max(...semesters);
    return min === max ? `Sem ${min}` : `Sem ${min}-${max}`;
  };

  if (professors.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Compare Professors</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body text-center">
            <p>No professors selected for comparison</p>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h2>Compare Professors ({professors.length})</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-grid">
          {professors.map((professor) => (
            <div key={professor.id} className="professor-card">
              <div className="text-center">
                <img
                  src={professor.profileImage || "/fallback.png"}
                  alt={professor.name}
                  className="profile-img"
                />
                <h3>{professor.name}</h3>
                <span className="badge">{professor.subject}</span>
              </div>

              {/* Rating */}
              <div className="rating">
                {renderStars(professor.averageRating)}
                <p>{professor.averageRating.toFixed(1)} ({professor.totalRatings} reviews)</p>
              </div>

              {/* Stats */}
              <div className="stats">
                <p><strong>Experience:</strong> {professor.experience}</p>
                <p><strong>Branches:</strong> {getBranchNames(professor.branches)}</p>
                <p><strong>Semesters:</strong> {getSemesterRange(professor.semesters)}</p>
                <p><strong>Videos:</strong> {professor.videos.length}</p>
              </div>

              {/* Education */}
              <div className="education">
                <strong>Education:</strong>
                <p>{professor.education}</p>
              </div>

              {/* Bio */}
              <p className="bio">{professor.bio}</p>

              {/* Button */}
              <button className="btn full" onClick={() => onViewProfile(professor)}>
                View Full Profile
              </button>
            </div>
          ))}
        </div>

        {/* Quick Comparison */}
        <div className="summary">
          <h4>Quick Comparison</h4>
          <div className="summary-grid">
            <div>
              <span>Highest Rated:</span>
              <p>
                {professors.reduce((prev, curr) =>
                  prev.averageRating > curr.averageRating ? prev : curr
                ).name}
              </p>
            </div>
            <div>
              <span>Most Reviews:</span>
              <p>
                {professors.reduce((prev, curr) =>
                  prev.totalRatings > curr.totalRatings ? prev : curr
                ).name}
              </p>
            </div>
            <div>
              <span>Most Videos:</span>
              <p>
                {professors.reduce((prev, curr) =>
                  prev.videos.length > curr.videos.length ? prev : curr
                ).name}
              </p>
            </div>
            <div>
              <span>Most Experienced:</span>
              <p>
                {professors.find((p) => p.experience.includes("20+"))?.name ||
                  professors.find((p) => p.experience.includes("18"))?.name ||
                  professors[0]?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
