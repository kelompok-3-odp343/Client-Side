import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X } from "lucide-react";
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
	const [filterStatus, setFilterStatus] = useState([]);
	const [showStatusFilter, setShowStatusFilter] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Raw accounts data
	const rawAccounts = [
		{
			id: 1,
			cif: "1234567890",
			customerName: "Oktavia",
			accountNumber: "1234567890",
			accountType: "Pension Fund",
			status: "Active",
		},
		{
			id: 2,
			cif: "1234567891",
			customerName: "Ulion Pardede",
			accountNumber: "1234567890",
			accountType: "Savings",
			status: "Blocked",
		},
		{
			id: 3,
			cif: "1234567891",
			customerName: "Ulion Pardede",
			accountNumber: "1234567891",
			accountType: "Savings",
			status: "Blocked",
		},
		{
			id: 4,
			cif: "1234567891",
			customerName: "Ulion Pardede",
			accountNumber: "1234567892",
			accountType: "Time Deposit",
			status: "Active",
		},
		{
			id: 5,
			cif: "1234567891",
			customerName: "Ulion Pardede",
			accountNumber: "1234567893",
			accountType: "Pension Fund",
			status: "Active",
		},
		{
			id: 6,
			cif: "1234567891",
			customerName: "Ulion Pardede",
			accountNumber: "1234567894",
			accountType: "Life Goals",
			status: "Active",
		},
		{
			id: 7,
			cif: "1234567891",
			customerName: "Ulion Pardede",
			accountNumber: "1234567895",
			accountType: "Savings",
			status: "Active",
		},
		{
			id: 8,
			cif: "1234567891",
			customerName: "Ulion Pardede",
			accountNumber: "1234567896",
			accountType: "Time Deposit",
			status: "Active",
		},
		{
			id: 9,
			cif: "1234567892",
			customerName: "Erlangga Wahyu",
			accountNumber: "1234567897",
			accountType: "Savings",
			status: "Active",
		},
		{
			id: 10,
			cif: "1234567892",
			customerName: "Erlangga Wahyu",
			accountNumber: "1234567898",
			accountType: "Life Goals",
			status: "Active",
		},
		{
			id: 11,
			cif: "1234567893",
			customerName: "Della Puspita",
			accountNumber: "1234567899",
			accountType: "Time Deposit",
			status: "Active",
		},
		{
			id: 12,
			cif: "1234567893",
			customerName: "Della Puspita",
			accountNumber: "1234567900",
			accountType: "Savings",
			status: "Active",
		},
		{
			id: 13,
			cif: "1234567893",
			customerName: "Della Puspita",
			accountNumber: "1234567901",
			accountType: "Pension Fund",
			status: "Active",
		},
		{
			id: 14,
			cif: "1234567893",
			customerName: "Della Puspita",
			accountNumber: "1234567902",
			accountType: "Life Goals",
			status: "Active",
		},
		{
			id: 15,
			cif: "1234567893",
			customerName: "Della Puspita",
			accountNumber: "1234567903",
			accountType: "Time Deposit",
			status: "Active",
		},
		{
			id: 16,
			cif: "1234567894",
			customerName: "Khairuddin Nasty",
			accountNumber: "1234567904",
			accountType: "Saving",
			status: "Blocked",
		},
		{
			id: 17,
			cif: "1234567894",
			customerName: "Khairuddin Nasty",
			accountNumber: "1234567905",
			accountType: "Life Goals",
			status: "Active",
		},
		{
			id: 18,
			cif: "1234567894",
			customerName: "Khairuddin Nasty",
			accountNumber: "1234567906",
			accountType: "Savings",
			status: "Blocked",
		},
		{
			id: 19,
			cif: "1234567895",
			customerName: "Wira Natanael Uli",
			accountNumber: "1234567907",
			accountType: "Savings",
			status: "Active",
		},
		{
			id: 20,
			cif: "1234567895",
			customerName: "Wira Natanael Uli",
			accountNumber: "1234567908",
			accountType: "Time Deposit",
			status: "Active",
		},
		{
			id: 21,
			cif: "1234567895",
			customerName: "Wira Natanael Uli",
			accountNumber: "1234567909",
			accountType: "Pension Fund",
			status: "Active",
		},
	];

	// Group accounts by CIF to get unique users
	const users = useMemo(() => {
		const groupedByCif = rawAccounts.reduce((acc, account) => {
			if (!acc[account.cif]) {
				acc[account.cif] = {
					cif: account.cif,
					customerName: account.customerName,
					accounts: [],
				};
			}
			acc[account.cif].accounts.push(account);
			return acc;
		}, {});

		return Object.values(groupedByCif).map((user) => {
			const hasBlocked = user.accounts.some((acc) => acc.status === "Blocked");
			return {
				cif: user.cif,
				customerName: user.customerName,
				status: hasBlocked ? "Blocked" : "Active",
				accountCount: user.accounts.length,
				accounts: user.accounts,
			};
		});
	}, []);

	const tableColumns = [
		{ key: "no", label: "No", sortable: false },
		{ key: "cif", label: "CIF", sortable: false },
		{ key: "customerName", label: "Customer Name", sortable: true },
		{ key: "status", label: "Customer Status", sortable: true, filterable: true },
		{ key: "accountCount", label: "# of Accounts", sortable: true },
		{ key: "action", label: "Action", sortable: false },
	];

	// Get unique statuses
	const statuses = ["Active", "Blocked"];

	// Filter and search
	const filteredUsers = users.filter((user) => {
		// Search filter
		const matchesSearch =
			user.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.cif.includes(searchQuery);

		// Status filter
		const matchesStatus = filterStatus.length === 0 || filterStatus.includes(user.status);

		return matchesSearch && matchesStatus;
	});

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

	const handleViewDetails = (user) => {
		navigate(`/admin/users/${user.cif}`, { state: { user } });
	};

	const toggleStatusFilter = (status) => {
		setFilterStatus((prev) =>
			prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
		);
	};

	const clearStatusFilter = () => {
		setFilterStatus([]);
	};

	const clearAllFilters = () => {
		setFilterStatus([]);
	};

	const hasActiveFilters = filterStatus.length > 0;

	const renderColumnHeader = (column) => {
		if (!column.filterable || column.key !== "status") return null;

		const hasFilter = filterStatus.length > 0;

		return (
			<div className="filter-dropdown-container">
				<button
					className={`filter-icon-btn ${hasFilter ? "active" : ""}`}
					onClick={(e) => {
						e.stopPropagation();
						setShowStatusFilter(!showStatusFilter);
					}}
					title="Filter"
				>
					<Filter size={16} />
					{hasFilter && <span className="filter-badge">{filterStatus.length}</span>}
				</button>

				{showStatusFilter && (
					<>
						<div
							className="filter-dropdown-overlay"
							onClick={() => setShowStatusFilter(false)}
						/>
						<div className="filter-dropdown">
							<div className="filter-dropdown-header">
								<span className="filter-dropdown-title">Filter {column.label}</span>
								{hasFilter && (
									<button
										className="clear-filter-btn"
										onClick={clearStatusFilter}
										title="Clear filter"
									>
										<X size={14} />
										Clear
									</button>
								)}
							</div>
							<div className="filter-options">
								{statuses.map((status) => (
									<label key={status} className="filter-checkbox-label">
										<input
											type="checkbox"
											checked={filterStatus.includes(status)}
											onChange={() => toggleStatusFilter(status)}
										/>
										<span>{status}</span>
									</label>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		);
	};

	const renderCell = (row, column, index) => {
		if (column.key === "no") return index + 1;

		if (column.key === "status") {
			return <StatusBadge status={row.status} type="user" />;
		}

		if (column.key === "action") {
			return (
				<button className="view-details-btn" onClick={() => handleViewDetails(row)}>
					View details
				</button>
			);
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
					renderColumnHeader={renderColumnHeader}
					searchBar={
						<div className="search-and-filter">
							<SearchBar
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							{hasActiveFilters && (
								<button className="clear-all-filters-btn" onClick={clearAllFilters}>
									<X size={16} />
									Clear All Filters
								</button>
							)}
						</div>
					}
					tableClassName="users-list-table"
					headerColor="peach"
				/>
			</main>
		</div>
	);
}