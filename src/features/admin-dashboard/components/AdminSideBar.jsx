import React from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Activity, LogOut } from "lucide-react";
import logo from "../../../assets/images/wandoor-logo-2.png";
import "../styles/admin-sidebar.css";

export default function AdminSideBar({ isOpen, onClose }) {
	const navigate = useNavigate();
	const location = useLocation();

	const menuItems = [
		{ name: "Home", path: "/admin/home", icon: Home },
		{ name: "Users", path: "/admin/users", icon: Users },
		{ name: "Activity", path: "/admin/activity", icon: Activity },
	];

	const handleLogout = () => {
		sessionStorage.clear();
		localStorage.clear();
		navigate("/");
	};

	const handleMenuClick = (path) => {
		navigate(path);
		onClose();
	};

	const handleOverlayKeyDown = (event) => {
		if (event.key === "Enter" || event.key === " ") {
			onClose();
		}
	};

	return (
		<>
			{isOpen && (
				<div
					className="sidebar-overlay"
					onClick={onClose}
					onKeyDown={handleOverlayKeyDown}
					role="button"
					tabIndex={0}
					aria-label="Close sidebar overlay"
				></div>
			)}

			<aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
				<div className="sidebar-header">
					<img src={logo} alt="Wandoor Logo" className="sidebar-logo" />
					<button
						className="close-btn"
						onClick={onClose}
						aria-label="Close sidebar"
						type="button"
					>
						×
					</button>
				</div>

				<nav className="sidebar-menu">
					{menuItems.map((item) => {
						const Icon = item.icon;
						return (
							<button
								key={item.name}
								className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
								onClick={() => handleMenuClick(item.path)}
								type="button"
							>
								<Icon size={28} aria-hidden="true" />
								<span>{item.name}</span>
							</button>
						);
					})}
				</nav>

				<div className="sidebar-footer">
					<button className="logout-btn" onClick={handleLogout} type="button">
						<LogOut size={28} aria-hidden="true" />
						<span>Log Out</span>
					</button>
				</div>
			</aside>
		</>
	);
}

AdminSideBar.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};