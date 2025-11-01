import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/admin-navbar.css";
import logo from "../../../assets/images/wandoor-logo-2.png";

export default function AdminNavBar({ onMenuToggle }) {
	return (
		<header className="admin-navbar">
			<div className="nav-left">
				<button
					className="menu-btn"
					onClick={onMenuToggle}
					aria-label="Toggle menu"
					type="button"
				>
					<i className="fas fa-bars"></i>
				</button>
				<h1 className="nav-title">Dashboard</h1>
			</div>

			<div className="nav-right">
				<Link to="/admin/home">
					<img src={logo} alt="Wandoor logo" className="nav-logo" />
				</Link>
			</div>
		</header>
	);
}

AdminNavBar.propTypes = {
	onMenuToggle: PropTypes.func.isRequired,
};