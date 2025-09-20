import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaEye, FaClock } from "react-icons/fa";
import AddVideoForm from "./AddVideoForm";
import "./css/AddVideo.css";

export default function AddVideo() {
  const [showForm, setShowForm] = useState(false);
  const [videos, setVideos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [editingVideo, setEditingVideo] = useState(null);

  // Fetch videos
  const fetchVideos = async () => {
    try {
      const response = await fetch("https://campusvoice-backend.onrender.com/api/videos");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching videos:", err.message);
      setVideos([]);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Delete
  const handleDelete = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const cancelDelete = () => {
    setConfirmDelete({ show: false, id: null });
  };

  const confirmDeleteVideo = async (videoId) => {
    try {
      const res = await fetch(`https://campusvoice-backend.onrender.com/api/videos/${videoId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
        setConfirmDelete({ show: false, id: null });
      } else {
        alert("Failed to delete video");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting video");
    }
  };

  // Edit
  const handleEdit = (video) => {
    setEditingVideo(video);
    setShowForm(true);
  };

  return (
    <div className="dashboard-container">
      {/* Stats */}
      <div className="video-stats">
        <div className="stat-card">
          <h3>{videos.length}</h3>
          <p>Total Videos</p>
        </div>
        <div className="stat-card">
          <h3>{videos.reduce((sum, v) => sum + (v.views || 0), 0)}</h3>
          <p>Total Views</p>
        </div>
        <div className="stat-card">
          <h3>
            {videos.length
              ? Math.floor(
                  videos.reduce((sum, v) => sum + (parseInt(v.duration?.split(":")[0] || 0), 0), 0) /
                    videos.length
                )
              : 0}
            :00
          </h3>
          <p>Average Duration</p>
        </div>
      </div>

      {/* Header */}
      <div className="professor-header">
        <div>
          <h2>Videos Management</h2>
          <p>Manage videos for your professors</p>
        </div>
        <button className="btn-add-professor" onClick={() => setShowForm(true)}>
          + ADD VIDEO
        </button>
      </div>

      {/* Add/Edit Form */}
      <AddVideoForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingVideo(null);
          fetchVideos();
        }}
        initialData={editingVideo || {}}
        onUpdate={fetchVideos}
      />

      {/* Delete Confirmation */}
      {confirmDelete.show && (
        <div className="confirm-modal">
          <div className="confirm-box">
            <p>Are you sure you want to delete this video?</p>
            <div className="confirm-buttons">
              <button className="btn-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={() => confirmDeleteVideo(confirmDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="videos-list">
        {videos.length === 0 ? (
          <p>No videos found.</p>
        ) : (
          <table className="video-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Professor</th>
                <th>
                  <FaClock /> Duration
                </th>
                <th>
                  <FaEye /> Views
                </th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id}>
                  <td className="video-cell">
                    {video.thumbnail ? (
                      <img
                        src={`https://campusvoice-backend.onrender.com/uploads/${video.thumbnail}`}
                        alt="thumbnail"
                        width="120"
                      />
                    ) : (
                      "No Thumbnail"
                    )}
                    <div>
                      <p className="video-title">{video.title}</p>
                      <a
                        href={`https://campusvoice-backend.onrender.com/uploads/${video.filename}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {video.filename}
                      </a>
                    </div>
                  </td>
                  <td>{video.professor?.name || "--"}</td>
                  <td>{video.duration || "--:--"}</td>
                  <td>{video.views || 0}</td>
                  <td>
                    {video.createdAt
                      ? new Date(video.createdAt).toISOString().split("T")[0]
                      : "--"}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(video)}>
                      <FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(video._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
