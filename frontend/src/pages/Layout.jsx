import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import "../css/Layout.css"
export default function Layout() {
  return (
    <div>
      <div style={{ padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
}
