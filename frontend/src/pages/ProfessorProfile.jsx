import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/ProfessorProfile.css";

export default function ProfessorProfile() {
  const { id } = useParams();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
const [playingVideoId, setPlayingVideoId] = useState(null);

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const res = await fetch(`https://campusvoice-backend.onrender.com/api/professors/${id}`);
        if (!res.ok) throw new Error("Failed to fetch professor");
        const data = await res.json();
        setProfessor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessor();
  }, [id]);

  const handleClick = (index) => setRating(index);
  const handleMouseOver = (index) => setHoverRating(index);
  const handleMouseLeave = () => setHoverRating(0);

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/professors/${id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment: review }),
        }
      );

      const data = await res.json();

      if (data.success) {
         window.location.reload();
        setProfessor((prev) => ({
          ...prev,
          reviews: data.reviews,
          averageRating: data.averageRating,
          totalRatings: data.totalRatings,
        }));
        setRating(0);
        setReview("");
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!professor) return <div className="container">Professor not found</div>;

  return (
    <div className="container">
      <Link to="/dashboard" className="back-link">
         Back to Dashboard
      </Link>

      <div className="profile-card">
        <div className="profile-img">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="#B0B0B0"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
              1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 
              4 0 .66.68 1 1 1h14c.32 0 1-.34 
              1-1 0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <div className="profile-info">
          <h2>{professor.name}</h2>
          <div className="tag">{professor.subject}</div>
          <div className="rating-stars">
            {[...Array(5)].map((star, i) => {
              const starIndex = i + 1;
              return (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill={
                    starIndex <= Math.round(professor.averageRating || 0)
                      ? "#FFD700"
                      : "#ddd"
                  }
                  viewBox="0 0 24 24"
                  style={{ marginRight: "2px" }}
                >
                  <path
                    d="M12 .587l3.668 7.431 8.2 
                    1.192-5.934 5.78 1.401 
                    8.168L12 18.897l-7.335 
                    3.86 1.402-8.168L.132 
                    9.21l8.2-1.192z"
                  />
                </svg>
              );
            })}
            <span className="rating-value">
              {professor.averageRating?.toFixed(1) || 0}{" "}
              <span className="reviews">
                ({professor.totalRatings || 0} reviews)
              </span>
            </span>
          </div>
          <p className="description">{professor.biography}</p>
          <div className="students-rated">
            👩‍🎓 {professor.totalRatings || 0} students rated
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="videos-section">
  <h3>Videos</h3>
  {(professor.videos || []).length === 0 ? (
  <p>No videos uploaded yet.</p>
) : (
  professor.videos.map((video) => {
     const isPlaying = playingVideoId === video._id; 

    return (
      <div className="video-card" key={video._id}>
        <div
          className="thumbnail-container"
          onClick={() => setPlayingVideoId(isPlaying ? null : video._id)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          {video.thumbnail ? (
            <img
              src={`http://localhost:5000/uploads/${video.thumbnail}`}
              alt={video.title}
              className="thumbnail"
            />
          ) : (
            <div className="no-thumbnail">No Thumbnail</div>
          )}
          {!isPlaying && <div className="play-icon">▶</div>}
          <span className="duration">{video.duration || "--:--"}</span>
        </div>

        <div className="video-info">
          <div className="video-title">{video.title}</div>
          <div className="video-meta">
            <div className="views">{video.views?.toLocaleString() || 0} views</div>
            <div className="date">
              {video.createdAt
                ? new Date(video.createdAt).toISOString().split("T")[0]
                : "--"}
            </div>
          </div>

          {/* Video player shows only for the selected video */}
          {isPlaying && (
            <div className="video-player">
              <video
                width="640"
                height="360"
                controls
                autoPlay
                onEnded={() => setPlayingVideoId(null)}
              >
                <source
                  src={`http://localhost:5000/api/videos/stream/${video.filename}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    );
  })
)}

</div>


        <div className="rating-section">
          <h3>Rate this Professor</h3>
          <label className="your-rating-label">Your Rating</label>
          <div
            className="star-rating"
            onMouseLeave={handleMouseLeave}
            aria-label="Star Rating"
          >
            {[...Array(5)].map((star, i) => {
              const starIndex = i + 1;
              return (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill={
                    starIndex <= (hoverRating || rating) ? "#FFD700" : "#ddd"
                  }
                  viewBox="0 0 24 24"
                  className="star"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleClick(starIndex)}
                  onMouseOver={() => handleMouseOver(starIndex)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleClick(starIndex);
                    }
                  }}
                >
                  <path
                    d="M12 .587l3.668 7.431 8.2 
                    1.192-5.934 5.78 1.401 
                    8.168L12 18.897l-7.335 
                    3.86 1.402-8.168L.132 
                    9.21l8.2-1.192z"
                  />
                </svg>
              );
            })}
          </div>
          <div className="click-to-rate">Click to rate</div>

          <label htmlFor="review" className="review-label">
            Your Review (Optional)
          </label>
          <textarea
            id="review"
            rows="4"
            placeholder="Share your thoughts about this professor..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}
