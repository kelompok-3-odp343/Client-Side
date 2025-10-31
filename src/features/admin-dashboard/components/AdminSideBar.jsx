import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, LogOut } from "lucide-react";
import logo from "../../../assets/images/wandoor-logo-2.png";
import "../styles/admin-sidebar.css";

export default function AdminSideBar({ isOpen, onClose }) {
	const navigate = useNavigate();
	const location = useLocation();

	const menuItems = [
		{ name: "Home", path: "/admin/home", icon: Home },
		{ name: "Users", path: "/admin/users", icon: Users },
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

	return (
		<>
			{isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
			<aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
				<div className="sidebar-header">
					<img src={logo} alt="Wandoor Logo" className="sidebar-logo" />
					<button className="close-btn" onClick={onClose} aria-label="Close sidebar">
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
							>
								<Icon size={20} />
								<span>{item.name}</span>
							</button>
						);
					})}
				</nav>

				<div className="sidebar-footer">
					<button className="logout-btn" onClick={handleLogout}>
						<LogOut size={20} />
						<span>Log Out</span>
					</button>
				</div>
			</aside>
		</>
	);
}