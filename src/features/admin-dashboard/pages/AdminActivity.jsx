import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X } from "lucide-react";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import "../styles/admin-activity.css";

export default function AdminActivity() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
	const [filterStatus, setFilterStatus] = useState([]);
	const [showStatusFilter, setShowStatusFilter] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Listen for activity changes
	useEffect(() => {
		const handleActivityChange = () => {
			setRefreshKey(prev => prev + 1);
		};
		
		window.addEventListener('activityStatusChanged', handleActivityChange);
		
		return () => {
			window.removeEventListener('activityStatusChanged', handleActivityChange);
		};
	}, []);

	// Load activities from sessionStorage or fallback to inline dummy
	const activities = useMemo(() => {
		const stored = sessionStorage.getItem('activities');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed;
			} catch (e) {
				console.error('Error parsing activities:', e);
			}
		}

		// Default sample data if no activities yet
		return [
			{
				id: 1,
				activityId: "ACK000001",
				actionFlow: "Check & Approval",
				data: "P001",
				createdTime: "2025-11-01 10:00:00",
				createdBy: "ADM001",
				checkerId: "ADM002",
				approverId: "ADM003",
				status: "Pending Approval",
				customerName: "Ulion Pardede",
				cif: "1234567890",
				reason: "System automatically blocked the user due to multiple failed login attempts.",
				rejectionNotes: "-",
			},
			{
				id: 2,
				activityId: "ACK000002",
				actionFlow: "Check & Approval",
				data: "P002",
				createdTime: "2025-11-01 10:00:00",
				createdBy: "ADM001",
				checkerId: "ADM002",
				approverId: "ADM003",
				status: "Pending Check",
			},
			{
				id: 3,
				activityId: "ACK000003",
				actionFlow: "Check & Approval",
				data: "P003",
				createdTime: "2025-11-01 10:00:00",
				createdBy: "ADM001",
				checkerId: "ADM002",
				approverId: "ADM003",
				status: "Rejected",
			},
			{
				id: 4,
				activityId: "ACK000004",
				actionFlow: "Check & Approval",
				data: "P004",
				createdTime: "2025-11-01 10:00:00",
				createdBy: "ADM001",
				checkerId: "ADM002",
				approverId: "ADM003",
				status: "Approved",
			},
			{
				id: 5,
				activityId: "ACK000005",
				actionFlow: "Check & Approval",
				data: "P005",
				createdTime: "2025-11-01 10:00:00",
				createdBy: "ADM001",
				checkerId: "ADM002",
				approverId: "ADM003",
				status: "Pending Approval",
			},
			{
				id: 6,
				activityId: "ACK000006",
				actionFlow: "Check & Approval",
				data: "P006",
				createdTime: "2025-11-01 10:00:00",
				createdBy: "ADM001",
				checkerId: "ADM002",
				approverId: "ADM003",
				status: "Pending Approval",
			},
		];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refreshKey]);

	const tableColumns = [
		{ key: "no", label: "No", sortable: false },
		{ key: "activityId", label: "Activity ID", sortable: false },
		{ key: "actionFlow", label: "Action Flow", sortable: false },
		{ key: "data", label: "Data", sortable: false },
		{ key: "createdTime", label: "Created Time", sortable: true },
		{ key: "createdBy", label: "Created by", sortable: false },
		{ key: "checkerId", label: "Checker ID", sortable: false },
		{ key: "approverId", label: "Approver ID", sortable: false },
		{ key: "status", label: "Status", sortable: true, filterable: true },
		{ key: "action", label: "Action", sortable: false },
	];

	// Get unique statuses
	const statuses = ["Pending Check", "Pending Approval", "Rejected", "Approved"];

	// Filter and search
	const filteredActivities = activities.filter((activity) => {
		// Search filter
		const matchesSearch = Object.values(activity).some((val) =>
			String(val).toLowerCase().includes(searchQuery.toLowerCase())
		);

		// Status filter
		const matchesStatus =
			filterStatus.length === 0 || filterStatus.includes(activity.status);

		return matchesSearch && matchesStatus;
	});

	const handleSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const sortedActivities = [...filteredActivities].sort((a, b) => {
		if (!sortConfig.key) return 0;

		const aVal = a[sortConfig.key];
		const bVal = b[sortConfig.key];

		// Special handling for date
		if (sortConfig.key === "createdTime") {
			const aTime = new Date(aVal).getTime();
			const bTime = new Date(bVal).getTime();
			return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
		}

		if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
		if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

	const handleViewDetails = (activity) => {
		navigate(`/admin/activity/${activity.activityId}`, {
			state: { activity },
		});
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

	const getStatusClass = (status) => {
		switch (String(status || "").toLowerCase()) {
			case "approved":
				return "status-approved";
			case "rejected":
				return "status-rejected";
			case "pending check":
				return "status-pending-check";
			case "pending approval":
				return "status-pending-approval";
			default:
				return "";
		}
	};

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
			return <span className={`status-badge ${getStatusClass(row.status)}`}>{row.status}</span>;
		}

		if (column.key === "action") {
			return (
				<button
					className="view-details-btn-activity"
					onClick={() => handleViewDetails(row)}
					type="button"
					title="View details"
				>
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

			<main className="admin-activity-main">
				<DataTable
					title="Activity List"
					columns={tableColumns}
					data={sortedActivities}
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
					tableClassName="activity-list-table"
					headerColor="purple"
				/>
			</main>
		</div>
	);
}