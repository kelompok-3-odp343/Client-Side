import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X, Eye } from "lucide-react";

import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";

import { fetchAdminActivityList } from "../service/adminActivityService";
import "../styles/admin-activity.css";

const formatDateID = (isoString) => {
	if (!isoString) return "-";
	const d = new Date(isoString.replace("TZ", "Z"));
	if (isNaN(d.getTime())) return "-";

	return d.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

export default function AdminActivity() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const [activityData, setActivityData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState(null);

	const [openFilterFor, setOpenFilterFor] = useState(null);
	const [columnFilters, setColumnFilters] = useState({
		status: [],
		menu: [],
		actionMenu: [],
		actionFlow: [],
		createdBy: [],
		checkerId: [],
		approverId: []
	});

	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const resp = await fetchAdminActivityList();

				const mapped = resp.data.activityList.map((a, idx) => ({
					id: idx + 1,
					activityId: a.id,
					menu: "User Management",
					actionFlow: a.activiationFlow,
					actionMenu: a.activiationFlow === "CHECKER_AND_APPROVER" ? "Checker & Approver" : "-",
					createdTime: formatDateID(a.createdTime),
					createdBy: a.createdBy || "-",
					checkerId: a.checkerId || "-",
					approverId: a.approverId || "-",
					status: a.activityStatus,
				}));

				setActivityData(mapped);
				setLoadError(resp.error);
			} catch (_) {
				setLoadError(true);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	const filteredActivities = useMemo(() => {
		const q = searchQuery.toLowerCase();

		return activityData.filter((act) => {
			const matchesSearch = Object.values(act).some((val) =>
				String(val).toLowerCase().includes(q)
			);

			const matchesColumnFilters = Object.entries(columnFilters).every(
				([key, selected]) => {
					if (!selected || selected.length === 0) return true;
					return selected.includes(act[key]);
				}
			);

			return matchesSearch && matchesColumnFilters;
		});
	}, [activityData, searchQuery, columnFilters]);

	const sortedActivities = useMemo(() => {
		if (!sortConfig) return filteredActivities;

		const { key, direction } = sortConfig;
		const dirFactor = direction === "asc" ? 1 : -1;

		return [...filteredActivities].sort((a, b) => {
			let va = a[key];
			let vb = b[key];

			return String(va).localeCompare(String(vb)) * dirFactor;
		});
	}, [filteredActivities, sortConfig]);

	const totalPages = Math.max(1, Math.ceil(sortedActivities.length / rowsPerPage));

	const paginatedData = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		return sortedActivities.slice(start, start + rowsPerPage);
	}, [sortedActivities, page, rowsPerPage]);

	useEffect(() => {
		if (page > totalPages) setPage(totalPages);
	}, [totalPages, page]);

	const getUniqueValues = (key) => {
		const list = activityData.map((a) => a[key]).filter((x) => x && x !== "-");
		return [...new Set(list)];
	};

	const renderColumnHeader = (column) => {
		if (!column.filterable) return null;

		const key = column.key;
		const options = getUniqueValues(key);
		const selected = columnFilters[key] || [];
		const isOpen = openFilterFor === key;
		const hasFilter = selected.length > 0;

		if (options.length === 0) return null;

		return (
			<div className="filter-dropdown-container">
				<button
					className={`filter-icon-btn ${hasFilter ? "active" : ""}`}
					onClick={(e) => {
						e.stopPropagation();
						setOpenFilterFor((prev) => (prev === key ? null : key));
					}}
				>
					<Filter size={16} />
					{hasFilter && <span className="filter-badge">{selected.length}</span>}
				</button>

				{isOpen && (
					<>
						<div className="filter-dropdown-overlay" onClick={() => setOpenFilterFor(null)} />
						<div className="filter-dropdown">
							<div className="filter-dropdown-header">
								<span className="filter-dropdown-title">{column.label}</span>

								{hasFilter && (
									<button
										className="clear-filter-btn"
										onClick={() =>
											setColumnFilters({ ...columnFilters, [key]: [] })
										}
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
											checked={selected.includes(opt)}
											onChange={() => {
												let newVal = selected.includes(opt)
													? selected.filter((x) => x !== opt)
													: [...selected, opt];

												setColumnFilters({
													...columnFilters,
													[key]: newVal,
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

	const getStatusClass = (status) => {
		switch (status) {
			case "APPROVED": return "status-approved";
			case "REJECTED": return "status-rejected";
			case "PENDING_CHECKER": return "status-pending-check";
			case "PENDING_APPROVER": return "status-pending-approval";
			default: return "";
		}
	};

	const renderCell = (row, column, index) => {
		if (column.key === "no") return (page - 1) * rowsPerPage + index + 1;

		if (column.key === "status")
			return <span className={`status-badge ${getStatusClass(row.status)}`}>{row.status}</span>;

		if (column.key === "action")
			return (
				<button
					className="view-details-btn-activity"
					onClick={() =>
						navigate("/admin/activity/detail", {
							state: { activityId: row.activityId, activity: row }
						})
					}
				>
					<Eye size={26} />
				</button>
			);

		return row[column.key];
	};

	const tableColumns = [
		{ key: "no", label: "No" },
		{ key: "activityId", label: "Activity ID" },
		{ key: "menu", label: "Menu", sortable: true, filterable: true },
		{ key: "actionMenu", label: "Action Menu", sortable: true, filterable: true },
		{ key: "actionFlow", label: "Action Flow", sortable: true, filterable: true },
		{ key: "createdTime", label: "Created Time", sortable: true },
		{ key: "createdBy", label: "Created By", filterable: true },
		{ key: "checkerId", label: "Checker ID", filterable: true },
		{ key: "approverId", label: "Approver ID", filterable: true },
		{ key: "status", label: "Status", sortable: true, filterable: true },
		{ key: "action", label: "Action" }
	];

	const clearAllFilters = () => {
		setColumnFilters({
			status: [],
			menu: [],
			actionMenu: [],
			actionFlow: [],
			createdBy: [],
			checkerId: [],
			approverId: []
		});
	};

	const hasActiveFilters = Object.values(columnFilters).some((v) => v.length > 0);

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-activity-main">

				<DataTable
					title="Activity List"
					columns={tableColumns}
					data={paginatedData}
					sortConfig={sortConfig}
					onSort={(key) =>
						setSortConfig((prev) =>
							!prev || prev.key !== key
								? { key, direction: "asc" }
								: prev.direction === "asc"
									? { key, direction: "desc" }
									: null
						)
					}
					renderCell={renderCell}
					renderColumnHeader={renderColumnHeader}
					searchBar={
						<div className="search-and-filter">
							<SearchBar
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
								}}
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

				<div className="pagination-container" style={{ marginTop: 12 }}>
					<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
						<span>Show</span>
						<select
							value={rowsPerPage}
							onChange={(e) => {
								setRowsPerPage(Number(e.target.value));
								setPage(1);
							}}
						>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>
						<span>rows</span>
					</div>

					<div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
						<button
							className="pagination-btn"
							disabled={page === 1}
							onClick={() => setPage(page - 1)}
						>
							Prev
						</button>

						{[...Array(Math.min(totalPages, 9))].map((_, i) => (
							<button
								key={i}
								className={`pagination-number ${page === i + 1 ? "active" : ""}`}
								onClick={() => setPage(i + 1)}
							>
								{i + 1}
							</button>
						))}

						{totalPages > 9 && <span>…</span>}

						<button
							className="pagination-btn"
							disabled={page === totalPages}
							onClick={() => setPage(page + 1)}
						>
							Next
						</button>
					</div>
				</div>

			</main>
		</div>
	);
}