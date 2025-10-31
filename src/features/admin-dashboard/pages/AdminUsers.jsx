import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-users.css";

export default function AdminUsers() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	const users = [
		{
			id: 1,
			customerName: "Ulion Pardede",
			accountNumber: "1234567890",
			accountType: "Pension Fund",
			status: "Active",
		},
		{
			id: 2,
			customerName: "Ulion Pardede",
			accountNumber: "1234567890",
			accountType: "Savings",
			status: "Blocked",
		},
		{
			id: 3,
			customerName: "Ulion Pardede",
			accountNumber: "1234567890",
			accountType: "Savings",
			status: "Active",
		},
		{
			id: 4,
			customerName: "Della Puspita",
			accountNumber: "1234567890",
			accountType: "Time Deposit",
			status: "Active",
		},
		{
			id: 5,
			customerName: "Khairuddin Nasty",
			accountNumber: "1234567890",
			accountType: "Saving",
			status: "Blocked",
		},
		{
			id: 6,
			customerName: "Khairuddin Nasty",
			accountNumber: "1234567890",
			accountType: "Life Goals",
			status: "Active",
		},
	];

	const filteredUsers = users.filter((user) =>
		Object.values(user).some((val) =>
			val.toString().toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const handleSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const sortedUsers = [...filteredUsers].sort((a, b) => {
		if (!sortConfig.key) return 0;

		const aVal = a[sortConfig.key];
		const bVal = b[sortConfig.key];

		if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
		if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

	const handleUserClick = (user) => {
		navigate(`/admin/users/${user.id}`, { state: { user } });
	};

	const handleUnblock = (userId, e) => {
		e.stopPropagation();
		// Logic untuk unblock user
		console.log("Unblock user:", userId);
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-users-main">
				<section className="users-section">
					<div className="users-header">
						<h2>Users List</h2>
						<div className="search-container">
							<input
								type="text"
								placeholder="Search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="search-input"
							/>
							<i className="fas fa-search search-icon"></i>
						</div>
					</div>

					<div className="table-wrapper">
						<table className="users-table">
							<thead>
								<tr>
									<th>No</th>
									<th
										className="sortable"
										onClick={() => handleSort("customerName")}
									>
										Customer Name
										{sortConfig.key === "customerName" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th
										className="sortable"
										onClick={() => handleSort("accountNumber")}
									>
										Account Number
										{sortConfig.key === "accountNumber" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th
										className="sortable"
										onClick={() => handleSort("accountType")}
									>
										Account Type
										{sortConfig.key === "accountType" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th
										className="sortable"
										onClick={() => handleSort("status")}
									>
										Status
										{sortConfig.key === "status" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{sortedUsers.map((user, index) => (
									<tr key={user.id}>
										<td>{index + 1}</td>
										<td>
											<button
												className="name-link"
												onClick={() => handleUserClick(user)}
											>
												{user.customerName}
											</button>
										</td>
										<td>{user.accountNumber}</td>
										<td>{user.accountType}</td>
										<td>
											<span
												className={`status-badge ${
													user.status === "Active"
														? "status-active"
														: "status-blocked"
												}`}
											>
												{user.status}
											</span>
										</td>
										<td>
											{user.status === "Blocked" && (
												<button
													className="unblock-btn"
													onClick={(e) => handleUnblock(user.id, e)}
												>
													Unblock
												</button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="table-footer">{sortedUsers.length} rows</div>
				</section>
			</main>
		</div>
	);
}