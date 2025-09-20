import React, { useState, useEffect } from "react";
import "../css/AddVideoForm.css";

export default function AddVideoForm({ isOpen, onClose, initialData, onUpdate }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState(initialData.title || "");
  const [professorId, setProfessorId] = useState(initialData.professorId || "");
  const [duration, setDuration] = useState(initialData.duration || "");
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    setTitle(initialData.title || "");
    setProfessorId(initialData.professorId || "");
    setDuration(initialData.duration || "");
    setVideoFile(null);
    setThumbnailFile(null);

    const fetchProfessors = async () => {
      try {
        const res = await fetch("https://campusvoice-backend.onrender.com/api/professors");
        const data = await res.json();
        setProfessors(data);
      } catch (err) {
        console.error("Failed to fetch professors", err);
      }
    };
    fetchProfessors();
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!professorId || (!videoFile && !initialData.filename)) {
      return alert("Please select a professor and a video file.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("professorId", professorId);
    formData.append("duration", duration);

    if (videoFile) formData.append("video", videoFile);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    try {
      const url = initialData._id
        ? `https://campusvoice-backend.onrender.com/api/videos/${initialData._id}`
        : "https://campusvoice-backend.onrender.com/api/videos";
      const method = initialData._id ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (data.success || data.message) alert(data.message || "Video saved!");
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error uploading video");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData._id ? "Edit Video" : "Add Video"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Video Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label>
            Select Professor:
            <select value={professorId} onChange={(e) => setProfessorId(e.target.value)} required>
              <option value="">--Select Professor--</option>
              {professors.map((prof) => (
                <option key={prof._id} value={prof._id}>
                  {prof.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Duration (mm:ss):
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="12:34"
            />
          </label>

          <label>
            Upload Video:
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
          </label>
          {initialData.filename && !videoFile && <p>Current Video: {initialData.filename}</p>}

          <label>
            Upload Thumbnail:
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} />
          </label>
          {(thumbnailFile || initialData.thumbnail) && (
            <div className="thumbnail-preview">
              <img
                src={
                  thumbnailFile
                    ? URL.createObjectURL(thumbnailFile)
                    : `https://campusvoice-backend.onrender.com/uploads/${initialData.thumbnail}`
                }
                alt="Thumbnail Preview"
                width="120"
              />
            </div>
          )}

          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{initialData._id ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
