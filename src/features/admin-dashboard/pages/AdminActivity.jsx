import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X, Eye } from "lucide-react";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import "../styles/admin-activity.css";

// Default dummy activities - will be used if no activities exist
const DEFAULT_ACTIVITIES = [
	{
		id: 1,
		activityId: "ACK000001",
		menu: "User Management",
		actionFlow: "Check & Approval",
		actionType: "unblock",
		actionMenu: "Unblock User",
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
		createdAt: "2025-11-01 10:00:00 by Della Puspita (ADM001)",
		checkedBy: "ADM002",
		checkedAt: "2025-11-01 12:02:32 by Khairuddin Nasty (ADM002)",
		approvedBy: "",
		approvedAt: "",
	},
	{
		id: 2,
		activityId: "ACK000002",
		menu: "User Management",
		actionFlow: "Check & Approval",
		actionType: "unblock",
		actionMenu: "Unblock User",
		data: "P002",
		createdTime: "2025-11-01 10:00:00",
		createdBy: "ADM001",
		checkerId: "ADM002",
		approverId: "ADM003",
		status: "Pending Check",
		customerName: "Sample User 2",
		cif: "1234567891",
		reason: "User requested account unblock after verification.",
		rejectionNotes: "-",
		createdAt: "2025-11-01 10:00:00 by Della Puspita (ADM001)",
		checkedBy: "ADM002",
		checkedAt: "",
		approvedBy: "",
		approvedAt: "",
	},
	{
		id: 3,
		activityId: "ACK000003",
		menu: "User Management",
		actionFlow: "Check & Approval",
		actionType: "block",
		actionMenu: "Block User",
		data: "P003",
		createdTime: "2025-11-01 10:00:00",
		createdBy: "ADM001",
		checkerId: "ADM002",
		approverId: "ADM003",
		status: "Rejected",
		customerName: "Sample User 3",
		cif: "1234567892",
		reason: "Suspicious activity detected, need to block account.",
		rejectionNotes: "Documentation incomplete",
		createdAt: "2025-11-01 10:00:00 by Della Puspita (ADM001)",
		checkedBy: "ADM002",
		checkedAt: "2025-11-01 11:15:20 by Khairuddin Nasty (ADM002)",
		approvedBy: "",
		approvedAt: "",
	},
	{
		id: 4,
		activityId: "ACK000004",
		menu: "User Management",
		actionFlow: "Check & Approval",
		actionType: "unblock",
		actionMenu: "Unblock User",
		data: "P004",
		createdTime: "2025-11-01 10:00:00",
		createdBy: "ADM001",
		checkerId: "ADM002",
		approverId: "ADM003",
		status: "Approved",
		customerName: "Sample User 4",
		cif: "1234567893",
		reason: "Routine unblock after security check.",
		rejectionNotes: "-",
		createdAt: "2025-11-01 10:00:00 by Della Puspita (ADM001)",
		checkedBy: "ADM002",
		checkedAt: "2025-11-01 12:05:10 by Khairuddin Nasty (ADM002)",
		approvedBy: "ADM003",
		approvedAt: "2025-11-02 08:00:00 by Wira Natanael Uli (ADM003)",
	},
	{
		id: 5,
		activityId: "ACK000005",
		menu: "User Management",
		actionFlow: "Check & Approval",
		actionType: "block",
		actionMenu: "Block User",
		data: "P005",
		createdTime: "2025-11-01 10:00:00",
		createdBy: "ADM001",
		checkerId: "ADM002",
		approverId: "ADM003",
		status: "Pending Approval",
		customerName: "Sample User 5",
		cif: "1234567894",
		reason: "Multiple violations detected, need to block account.",
		rejectionNotes: "-",
		createdAt: "2025-11-01 10:00:00 by Della Puspita (ADM001)",
		checkedBy: "ADM002",
		checkedAt: "2025-11-01 13:20:45 by Khairuddin Nasty (ADM002)",
		approvedBy: "",
		approvedAt: "",
	},
	{
		id: 6,
		activityId: "ACK000006",
		menu: "User Management",
		actionFlow: "Check & Approval",
		actionType: "unblock",
		actionMenu: "Unblock User",
		data: "P006",
		createdTime: "2025-11-01 10:00:00",
		createdBy: "ADM001",
		checkerId: "ADM002",
		approverId: "ADM003",
		status: "Pending Approval",
		customerName: "Sample User 6",
		cif: "1234567895",
		reason: "User forgot password multiple times, account blocked.",
		rejectionNotes: "-",
		createdAt: "2025-11-01 10:00:00 by Della Puspita (ADM001)",
		checkedBy: "ADM002",
		checkedAt: "2025-11-01 14:10:30 by Khairuddin Nasty (ADM002)",
		approvedBy: "",
		approvedAt: "",
	},
];

export default function AdminActivity() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState(null);
	// const [filterStatus, setFilterStatus] = useState([]);
	// const [showStatusFilter, setShowStatusFilter] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [openFilterFor, setOpenFilterFor] = useState(null);
	const [columnFilters, setColumnFilters] = useState({
		status: [],
		menu: [],
		actionMenu: [],
		actionFlow: [],
		createdBy: [],
		checkerId: [],
		approverId: [],
	});

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Initialize activities on first load
	useEffect(() => {
		const stored = sessionStorage.getItem('activities');
		if (!stored) {
			// First time - set default activities
			sessionStorage.setItem('activities', JSON.stringify(DEFAULT_ACTIVITIES));
		}
	}, []);

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

	// Load activities from sessionStorage
	const activities = useMemo(() => {
		const stored = sessionStorage.getItem('activities');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					return parsed;
				}
			} catch (e) {
				console.error('Error parsing activities:', e);
			}
		}

		// Fallback to default if nothing in storage
		return DEFAULT_ACTIVITIES;
	}, [refreshKey]);

	const getUniqueValuesForColumn = (key) => {
		const values = activities
			.map((a) => a[key])
			.filter((v) => v !== undefined && v !== null && v !== "");

		return [...new Set(values)];
	};

	const tableColumns = [
		{ key: "no", label: "No", sortable: false },
		{ key: "activityId", label: "Activity ID", sortable: false },
		{ key: "menu", label: "Menu", sortable: true, filterable: true },
		{ key : "actionMenu", label: "Action Menu", sortable: true, filterable: true },
		{ key: "actionFlow", label: "Action Flow", sortable: true, filterable: true },
		// { key: "data", label: "Data", sortable: false },
		{ key: "createdTime", label: "Created Time", sortable: true },
		{ key: "createdBy", label: "Created by", sortable: false, filterable: true },
		{ key: "checkerId", label: "Checker ID", sortable: false, filterable: true },
		{ key: "approverId", label: "Approver ID", sortable: false, filterable: true },
		{ key: "status", label: "Status", sortable: true, filterable: true },
		{ key: "action", label: "Action", sortable: false },
	];

	// Get unique statuses
	// const statuses = ["Pending Check", "Pending Approval", "Rejected", "Approved"];

	// Filter and search
	const filteredActivities = activities.filter((activity) => {
		// Search filter
		const matchesSearch = Object.values(activity).some((val) =>
			String(val).toLowerCase().includes(searchQuery.toLowerCase())
		);

		// Filter generic
		const matchesColumnFilters = Object.entries(columnFilters).every(
			([key, selectedValues]) => {
				if (!selectedValues || selectedValues.length === 0) return true;
				return selectedValues.includes(activity[key]);
			}
		);

		return matchesSearch && matchesColumnFilters;
	});

	const handleSort = (key) => {
        setSortConfig((prev) => {
            if (!prev || prev.key !== key) {
                return { key, direction: "asc" };
            }
            if (prev.direction === "asc") {
                return { key, direction: "desc" };
            }
            return null;
        });
    };

	const sortedActivities = sortConfig
        ? [...filteredActivities].sort((a, b) => {
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
          })
        : filteredActivities;

	const handleViewDetails = (activity) => {
		navigate(`/admin/activity/${activity.activityId}`, {
			state: { activity },
		});
	};

	// const toggleStatusFilter = (status) => {
	// 	setFilterStatus((prev) =>
	// 		prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
	// 	);
	// };

	// const clearStatusFilter = () => {
	// 	setFilterStatus([]);
	// };

	const clearAllFilters = () => {
		setColumnFilters({
			status: [],
			menu: [],
			actionMenu: [],
			actionFlow: [],
			createdBy: [],
			checkerId: [],
			approverId: [],
		});
	};

	const hasActiveFilters = Object.values(columnFilters).some(
		(arr) => arr && arr.length > 0
	);

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
		if (!column.filterable) return null;

		const key = column.key;
		const options = getUniqueValuesForColumn(key);
		const selectedValues = columnFilters[key] || [];
		const hasFilter = selectedValues.length > 0;
		const isOpen = openFilterFor === key;

		if (options.length === 0) return null;

		return (
			<div className="filter-dropdown-container">
				<button
					className={`filter-icon-btn ${hasFilter ? "active" : ""}`}
					onClick={(e) => {
						e.stopPropagation();
						setOpenFilterFor((prev) => (prev === key ? null : key));
					}}
					title={`Filter ${column.label}`}
					type="button"
				>
					<Filter size={16} />
					{hasFilter && (
						<span className="filter-badge">{selectedValues.length}</span>
					)}
				</button>

				{isOpen && (
					<>
						<div
							className="filter-dropdown-overlay"
							onClick={() => setOpenFilterFor(null)}
						/>
						<div className="filter-dropdown">
							<div className="filter-dropdown-header">
								<span className="filter-dropdown-title">
									{column.label}
								</span>
								{hasFilter && (
									<button
										className="clear-filter-btn"
										onClick={(e) => {
											e.stopPropagation();
											setColumnFilters((prev) => ({
												...prev,
												[key]: [],
											}));
										}}
										title="Clear filter"
										type="button"
									>
										<X size={14} />
										Clear
									</button>
								)}
							</div>
							<div className="filter-options">
								{options.map((opt) => (
									<label key={opt} className="filter-checkbox-label">
										<input
											type="checkbox"
											checked={selectedValues.includes(opt)}
											onChange={(e) => {
												const checked = e.target.checked;
												setColumnFilters((prev) => {
													const current = prev[key] || [];
													let next;
													if (checked) {
														next = [...current, opt];
													} else {
														next = current.filter((v) => v !== opt);
													}
													return {
														...prev,
														[key]: next,
													};
												});
											}}
										/>
										<span>{opt}</span>
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
					<Eye size={30} />
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