import React, { useState, useEffect } from "react";
import axios from "axios";
import AddForm from "./AddForm.jsx"; 
import "../css/AddProfessor.css";

export default function AddProfessor() {
  const [showForm, setShowForm] = useState(false);
  const [professors, setProfessors] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [editingProfessor, setEditingProfessor] = useState(null);

const handleEditClick = (prof) => {
  setEditingProfessor(prof);
  setShowForm(true);
};

const handleDeleteClick = (id) => {
  setConfirmDelete({ show: true, id });
};

const confirmDeleteProfessor = async () => {
  try {
    await axios.delete(`http://localhost:5000/api/professors/${confirmDelete.id}`);
    fetchProfessors();
  } catch (error) {
    console.error("Error deleting professor:", error);
  } finally {
    setConfirmDelete({ show: false, id: null });
  }
};

const cancelDelete = () => {
  setConfirmDelete({ show: false, id: null });
};


  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/professors");
      setProfessors(res.data);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  return (
    <section className="professor-management">
      <div className="professor-header">
        <div>
          <h2>Professor Management</h2>
          <p>Manage faculty members for Stanford University</p>
        </div>
        <button
          className="btn-add-professor"
          onClick={() => setShowForm(true)}
        >
          + Add Professor
        </button>
      </div>

     <AddForm
  isOpen={showForm}
  onClose={() => {
    setShowForm(false);
    setEditingProfessor(null); 
    fetchProfessors(); 
  }}
  initialData={editingProfessor || {}}  // ✅ ensure it's always an object
  onUpdate={fetchProfessors}
/>


      {confirmDelete.show && (
  <div className="confirm-modal">
    <div className="confirm-box">
      <p>Are you sure you want to delete this professor?</p>
      <div className="confirm-buttons">
        <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
        <button className="btn-confirm" onClick={confirmDeleteProfessor}>Delete</button>
      </div>
    </div>
  </div>
)}

      <div className="professor-table-wrapper">
        <table className="professor-table">
          <caption>Current Professors ({professors.length})</caption>
          <thead>
            <tr>
              <th>Professor</th>
              <th>Subject</th>
              <th>Branches</th>
              <th>Rating</th>
              <th>Videos</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {professors.map((prof) => (
              <tr key={prof._id}>
                <td className="professor-info">
                  <div>
                    <p className="prof-name">{prof.name}</p>
                    <p className="prof-experience">{prof.experience}</p>
                  </div>
                </td>
                <td>
                  <span className="subject-badge">{prof.subject}</span>
                </td>
                <td>
                  {prof.branches.map((branch, idx) => (
                    <span key={idx} className="branch-badge">{branch}</span>
                  ))}
                </td>
                <td>
                  <span className="rating">
                    <span className="star">★</span>{" "}
                    {prof.averageRating?.toFixed(1) || 0}{" "}
                    <small>({prof.totalRatings || 0})</small>
                  </span>
                </td>
                <td>
                  <span className="videos-icon" title="Videos">
                    ▶️ {prof.videos?.length || 0}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-edit"title="Edit" onClick={()=>{ 
                    handleEditClick(prof);}}> ✏️
                   </button>

                  <button className="btn-delete" title="Delete" onClick={() => handleDeleteClick(prof._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
