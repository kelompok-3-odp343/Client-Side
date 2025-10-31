import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
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

	const tableColumns = [
		{ key: "no", label: "No", sortable: false },
		{ key: "customerName", label: "Customer Name", sortable: true },
		{ key: "accountNumber", label: "Account Number", sortable: true },
		{ key: "accountType", label: "Account Type", sortable: true },
		{ key: "status", label: "Status", sortable: true },
		{ key: "action", label: "Action", sortable: false },
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
		console.log("Unblock user:", userId);
	};

	const renderCell = (row, column, index) => {
		if (column.key === "no") return index + 1;
		
		if (column.key === "customerName") {
			return (
				<button className="name-link" onClick={() => handleUserClick(row)}>
					{row.customerName}
				</button>
			);
		}
		
		if (column.key === "status") {
			return <StatusBadge status={row.status} type="user" />;
		}
		
		if (column.key === "action") {
			return row.status === "Blocked" ? (
				<button
					className="unblock-btn"
					onClick={(e) => handleUnblock(row.id, e)}
				>
					Unblock
				</button>
			) : null;
		}
		
		return row[column.key];
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-users-main">
				<DataTable
					title="Users List"
					columns={tableColumns}
					data={sortedUsers}
					sortConfig={sortConfig}
					onSort={handleSort}
					renderCell={renderCell}
					searchBar={
						<SearchBar
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					}
					tableClassName="users-list-table"
					headerColor="peach"
				/>
			</main>
		</div>
	);
}