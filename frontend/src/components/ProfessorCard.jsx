import React from "react";
import {useNavigate} from 'react-router-dom';
import userlogo from "../assets/user.png"
import "../css/ProfessorCard.css";
export function ProfessorCard({ professor }) {
  const navigate = useNavigate();
const onViewProfile = (professor) => {
  navigate(`/dashboard/professors/${professor._id}`);
};


  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.floor(rating) ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="prof-card">
      <div className="prof-card-content">
        {/* Header */}
        <div className="prof-header">
          <img
            src={userlogo}
            alt={professor.name}
            className="prof-img"
          />
          <div className="prof-info">
            <h3>{professor.name}</h3>
            <span className="badge">{professor.subject}</span>
            <div className="rating">
              {renderStars(professor.averageRating)}
              <span className="rating-text">
                {professor.averageRating.toFixed(1)} ({professor.totalRatings} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="prof-bio">{professor.bio || "No bio available."}</p>


        {/* Footer */}
        <div className="prof-footer">
          <div className="prof-stats">
            {professor.videos.length > 0 && (
              <span>{professor.videos.length} videos</span>
            )}
            <span>{professor.totalRatings} students</span>
          </div>
          <button className="btn" onClick={() => onViewProfile(professor)}>
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
