import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colleges } from "../college";
import "../css/Home.css";

export default function CollegeSelector() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // ✅ handleSelectCollege
  const handleSelectCollege = (college) => {
    setQuery(college.name); // put selected college name in input box
    navigate(`/login/${college.id}`); // redirect to login page
  };

  const filtered = colleges.filter((college) =>
    college.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="selector-container">
      <h2>Search Your College</h2>
      <input
        type="text"
        placeholder="Type college name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="selector-input"
      />

      {query && (
        <ul className="selector-list">
          {filtered.length > 0 ? (
            filtered.map((college) => (
              <li
                key={college.id}
                className="selector-item"
                onClick={() => handleSelectCollege(college)}
              >
                {college.name}
              </li>
            ))
          ) : (
            <li className="selector-item">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}


