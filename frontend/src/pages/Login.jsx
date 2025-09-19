import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/Login.css"; 
import kietLogo from "../assets/kietLogo.png";

export default function Login() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const navigate = useNavigate();
  const { collegeId } = useParams();

  async function handleSubmit(event) {
    event.preventDefault();

    navigate(`/dashboard`);
  }

  return (
    <div className="login-container">

      <form className="login-form" onSubmit={handleSubmit}>
         <img
      src={kietLogo}
        alt="College Logo"
        className="college-logo"
      />
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={enteredEmail}
            onChange={(e) => setEnteredEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-login">
          Login
        </button>
      </form>
    </div>
  );
}
