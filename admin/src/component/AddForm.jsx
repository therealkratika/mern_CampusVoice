import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/AddForm.css";

const branches = [
  { code: "CSE", label: "CSE", icon: "💻" },
  { code: "CE", label: "CE", icon: "🧱" },
  { code: "CHE", label: "CHE", icon: "🧪" },
  { code: "EE", label: "EE", icon: "⚡" },
  { code: "IT", label: "IT", icon: "🌐" },
  { code: "BT", label: "BT", icon: "🧬" },
  { code: "ME", label: "ME", icon: "⚙️" },
  { code: "ECE", label: "ECE", icon: "📡" },
];

const semesters = [
  "Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6","Sem 7","Sem 8",
];

export default function AddForm({ isOpen, onClose, initialData = {}, onUpdate }) {
  const [professorName, setProfessorName] = useState("");
  const [subject, setSubject] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [biography, setBiography] = useState("");
  const [profileImage, setProfileImage] = useState(null); // new image file
  const [branchesTaught, setBranchesTaught] = useState([]);
  const [semestersTaught, setSemestersTaught] = useState([]);

  // Prefill form when editing
  useEffect(() => {
    setProfessorName(initialData.name || "");
    setSubject(initialData.subject || "");
    setExperience(initialData.experience || "");
    setEducation(initialData.education || "");
    setBiography(initialData.biography || "");
    setBranchesTaught(initialData.branches || []);
    setSemestersTaught(initialData.semestersTaught || []);
    setProfileImage(null); // reset new image
  }, [initialData]);

  if (!isOpen) return null;

  const toggleBranch = (code) => {
    setBranchesTaught(branchesTaught.includes(code)
      ? branchesTaught.filter((b) => b !== code)
      : [...branchesTaught, code]);
  };

  const toggleSemester = (sem) => {
    setSemestersTaught(semestersTaught.includes(sem)
      ? semestersTaught.filter((s) => s !== sem)
      : [...semestersTaught, sem]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", professorName);
      data.append("subject", subject);
      data.append("experience", experience);
      data.append("education", education);
      data.append("biography", biography);
      data.append("branches", JSON.stringify(branchesTaught));
      data.append("semestersTaught", JSON.stringify(semestersTaught));
      if (profileImage) data.append("profileImage", profileImage);

      if (initialData?._id) {
        // Edit professor
        await axios.put(`https://campusvoice-backend.onrender.com/api/professors/${initialData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Professor updated successfully!");
      } else {
        // Add new professor
        await axios.post("https://campusvoice-backend.onrender.com/api/professors", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Professor added successfully!");
      }

      onClose();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error saving professor:", error);
      alert("Failed to save professor");
    }
  };

  return (
    <div className="modal-overlay">
      <form className="add-professor-form" onSubmit={handleSubmit}>
        <header>
          <h2>{initialData?._id ? "Edit Professor" : "Add New Professor"}</h2>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </header>

        <div className="form-row">
          <div className="form-group">
            <label>Professor Name</label>
            <input type="text" placeholder="Dr. John Smith" value={professorName} onChange={(e) => setProfessorName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
              <option value="" disabled>Select subject</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Experience</label>
            <input type="text" placeholder="10+ years" value={experience} onChange={(e) => setExperience(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Education</label>
            <input type="text" placeholder="PhD in Computer Science, MIT" value={education} onChange={(e) => setEducation(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Biography</label>
          <textarea placeholder="Brief description of the professor's background..." value={biography} onChange={(e) => setBiography(e.target.value)} rows={3} />
        </div>

        <div className="form-group">
          {/* <label>Profile Image</label>
          {initialData.profileImage && !profileImage && (
            <img src={initialData.profileImage} alt="Current profile" className="current-profile" />
          )}
          <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} /> */}
        </div>

        <fieldset className="section-checkboxes">
          <legend>Branches Taught</legend>
          {branches.map(({ code, label, icon }) => (
            <label key={code} className="checkbox-label">
              <input type="checkbox" checked={branchesTaught.includes(code)} onChange={() => toggleBranch(code)} />
              <span className="checkbox-icon">{icon}</span> {label}
            </label>
          ))}
        </fieldset>

        <fieldset className="section-checkboxes">
          <legend>Semesters Taught</legend>
          {semesters.map((sem) => (
            <label key={sem} className="checkbox-label">
              <input type="checkbox" checked={semestersTaught.includes(sem)} onChange={() => toggleSemester(sem)} />
              {sem}
            </label>
          ))}
        </fieldset>

        <button type="submit" className="submit-btn">{initialData?._id ? "Update Professor" : "Add Professor"}</button>
      </form>
    </div>
  );
}
