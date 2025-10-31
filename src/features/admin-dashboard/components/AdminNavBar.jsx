import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/admin-navbar.css";
import logo from "../../../assets/images/wandoor-logo-2.png";

export default function AdminNavBar({ onMenuToggle }) {
	return (
		<header className="admin-navbar">
			<div className="nav-left">
				<button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
					<i className="fas fa-bars"></i>
				</button>
				<h1 className="nav-title">Dashboard</h1>
			</div>

			<div className="nav-right">
				<Link to="/admin/home">
					<img src={logo} alt="Wandoor" className="nav-logo" />
				</Link>
			</div>
		</header>
	);
}