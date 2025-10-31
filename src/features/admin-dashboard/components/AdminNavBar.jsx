import React from "react";
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
				<img src={logo} alt="Wandoor" className="nav-logo" />
			</div>
		</header>
	);
}