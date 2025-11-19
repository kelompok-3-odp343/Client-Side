import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X, Eye } from "lucide-react";

import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";

import "../styles/admin-users.css";
import {
	fetchAdminUsers,
	fetchAdminBlock,
	fetchAdminUnBlock
} from "../service/adminUsersService";

export default function AdminUsers() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState(null);
	const [filterStatus, setFilterStatus] = useState([]);
	const [showStatusFilter, setShowStatusFilter] = useState(false);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [actionLoadingId, setActionLoadingId] = useState(null);

	const toggleSidebar = () => setIsSidebarOpen((v) => !v);

	useEffect(() => {
		let mounted = true;

		const load = async () => {
			setLoading(true);
			setLoadError(false);

			try {
				const resp = await fetchAdminUsers();
				if (!mounted) return;
				setUserData(resp.data);
			} catch (err) {
				if (!mounted) return;
				setLoadError(true);
			} finally {
				if (mounted) setLoading(false);
			}
		};

		load();
		return () => (mounted = false);
	}, []);

	const reloadUsers = async () => {
		try {
			const resp = await fetchAdminUsers();
			setUserData(resp.data);
		} catch (err) {
			console.error("Failed to reload users", err);
		}
	};

	const users = useMemo(() => {
		if (!userData?.users) return [];

		return userData.users.map((u, idx) => ({
			id: u.userId || `user-${idx}`,
			noIndex: idx + 1,
			cif: u.customerId,
			customerName: u.customerName,
			status: u.isBlocked ? "Blocked" : "Active",
			accountCount: u.countAccount
		}));
	}, [userData]);

	const filteredUsers = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();

		return users.filter((u) => {
			const s1 =
				!q ||
				u.customerName.toLowerCase().includes(q) ||
				(u.cif && u.cif.includes(q));

			const s2 =
				filterStatus.length === 0 || filterStatus.includes(u.status);

			return s1 && s2;
		});
	}, [users, searchQuery, filterStatus]);

	const handleSort = (key) => {
		setSortConfig((prev) => {
			if (!prev || prev.key !== key) return { key, direction: "asc" };
			if (prev.direction === "asc") return { key, direction: "desc" };
			return null;
		});
	};

	const sortedUsers = useMemo(() => {
		if (!sortConfig) return filteredUsers;

		const { key, direction } = sortConfig;
		const dir = direction === "asc" ? 1 : -1;

		return [...filteredUsers].sort((a, b) => {
			const va = a[key];
			const vb = b[key];

			if (va == null && vb == null) return 0;
			if (va == null) return -1 * dir;
			if (vb == null) return 1 * dir;

			if (typeof va === "number" && typeof vb === "number")
				return (va - vb) * dir;

			return String(va).localeCompare(String(vb)) * dir;
		});
	}, [filteredUsers, sortConfig]);

	const totalPages = Math.max(1, Math.ceil(sortedUsers.length / rowsPerPage));

	useEffect(() => {
		if (page > totalPages) setPage(totalPages);
		if (page < 1) setPage(1);
	}, [totalPages, page]);

	const paginatedData = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		return sortedUsers.slice(start, start + rowsPerPage);
	}, [sortedUsers, page, rowsPerPage]);

	const statuses = ["Active", "Blocked"];
	const hasActiveFilters = filterStatus.length > 0;

	const tableColumns = [
		{ key: "noIndex", label: "No" },
		{ key: "cif", label: "CIF", sortable: true },
		{ key: "customerName", label: "Customer Name", sortable: true },
		{ key: "status", label: "Customer Status", sortable: true, filterable: true },
		{ key: "accountCount", label: "# of Accounts", sortable: true },
		{ key: "action", label: "Action" }
	];

	const renderColumnHeader = (column) => {
		if (!column.filterable || column.key !== "status") return null;

		return (
			<div className="filter-dropdown-container">
				<button
					className={`filter-icon-btn ${hasActiveFilters ? "active" : ""}`}
					onClick={(e) => {
						e.stopPropagation();
						setShowStatusFilter((v) => !v);
					}}
				>
					<Filter size={16} />
					{hasActiveFilters && (
						<span className="filter-badge">{filterStatus.length}</span>
					)}
				</button>

				{showStatusFilter && (
					<>
						<div
							className="filter-dropdown-overlay"
							onClick={() => setShowStatusFilter(false)}
						/>
						<div className="filter-dropdown">
							<div className="filter-dropdown-header">
								<span className="filter-dropdown-title">{column.label}</span>
								{hasActiveFilters && (
									<button
										className="clear-filter-btn"
										onClick={() => setFilterStatus([])}
									>
										<X size={14} /> Clear
									</button>
								)}
							</div>

							<div className="filter-options">
								{statuses.map((s) => (
									<label key={s} className="filter-checkbox-label">
										<input
											type="checkbox"
											checked={filterStatus.includes(s)}
											onChange={() =>
												setFilterStatus((prev) =>
													prev.includes(s)
														? prev.filter((x) => x !== s)
														: [...prev, s]
												)
											}
										/>
										<span>{s}</span>
									</label>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		);
	};

	const handleBlockUser = async (user) => {
		const result = await Swal.fire({
			title: "Block User?",
			html: `
					<div style="font-size:14px">
					<b>${user.customerName}</b><br/>
					CIF: <b>${user.cif}</b>
					</div>
				`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, Block",
			cancelButtonText: "Batal",
			confirmButtonColor: "#e74c3c",
			cancelButtonColor: "#7f8c8d",
		});
		if (!result.isConfirmed) return;

		setActionLoadingId(user.id);

		try {
			const payload = {
				userData: {
					userId: user.id,
					cif: user.cif,
					customerName: user.customerName
				},
				reason: "Blocked by admin",
				checkerData: {
					nip: sessionStorage.getItem("nip") || "",
					name: sessionStorage.getItem("checkerName") || ""
				}
			};

			const resp = await fetchAdminBlock(payload);

			if (resp && resp.ok) {
				const msg =
					resp.data?.message || "User berhasil di-block (BLOCK_USER).";
				Swal.fire({
					icon: "success",
					title: "Berhasil",
					text: msg,
				});
				await reloadUsers();
			} else {
				aleSwal.fire({
					icon: "error",
					title: "Gagal",
					text: "Gagal meng-block user.",
				});
			}
		} catch (err) {
			console.error("Block user error:", err);
			Swal.fire({
				icon: "error",
				title: "Gagal",
				text: "Terjadi error saat block user.",
			});
		} finally {
			setActionLoadingId(null);
		}
	};

	const handleUnblockUser = async (user) => {
		const result = await Swal.fire({
			title: "Unblock User?",
			html: `
					<div style="font-size:14px">
					<b>${user.customerName}</b><br/>
					CIF: <b>${user.cif}</b>
					</div>
				`,
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Ya, Unblock",
			cancelButtonText: "Batal",
			confirmButtonColor: "#27ae60",
			cancelButtonColor: "#7f8c8d",
		});
		if (!result.isConfirmed) return;

		setActionLoadingId(user.id);

		try {
			const payload = {
				userData: {
					userId: user.id,
					cif: user.cif,
					customerName: user.customerName
				},
				reason: "Unblocked by admin",
				checkerData: {
					nip: sessionStorage.getItem("nip") || "",
					name: sessionStorage.getItem("checkerName") || ""
				}
			};

			const resp = await fetchAdminUnBlock(payload);

			if (resp && resp.ok) {
				const msg =
					resp.data?.message || "User berhasil di-unblock (BLOCK_USER).";
				Swal.fire({
					icon: "success",
					title: "Berhasil",
					text: msg,
				});

				await reloadUsers();
			} else {
				Swal.fire({
					icon: "error",
					title: "Gagal",
					text: "Gagal meng-unblock user.",
				});
			}
		} catch (err) {
			console.error("Unblock user error:", err);
			Swal.fire({
				icon: "error",
				title: "Gagal",
				text: "Terjadi error saat unblock user.",
			});

		} finally {
			setActionLoadingId(null);
		}
	};

	const renderCell = (row, column, index) => {
		if (column.key === "noIndex")
			return (page - 1) * rowsPerPage + index + 1;

		if (column.key === "status")
			return <StatusBadge status={row.status} type="user" />;

		if (column.key === "action") {
			const isLoading = actionLoadingId === row.id;

			return (
				<div className="action-buttons">
					<button
						className="view-details-btn"
						onClick={() =>
							navigate(`/admin/users/detail`, {
								state: { userId: row.id }
							})
						}
						disabled={isLoading}
					>
						<Eye size={22} />
					</button>

					{row.status === "Active" ? (
						<button
							className="block-btn"
							onClick={() => handleBlockUser(row)}
							disabled={isLoading}
						>
							{isLoading ? "..." : "Block"}
						</button>
					) : (
						<button
							className="unblock-btn"
							onClick={() => handleUnblockUser(row)}
							disabled={isLoading}
						>
							{isLoading ? "..." : "Unblock"}
						</button>
					)}
				</div>
			);
		}

		return row[column.key];
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>

			<main className="admin-users-main">
				{loading ? (
					<div style={{ padding: 20 }}>Loading users...</div>
				) : loadError ? (
					<div style={{ padding: 20, color: "red" }}>
						Failed to load users. Using dummy data.
					</div>
				) : (
					<>
						<div className="stats-grid">
							<div className="stat-card stat-total">
								<h3 className="stat-label">Total Users</h3>
								<hr />
								<div className="stat-value">
									{userData.totalUsers.toLocaleString("id-ID")}
								</div>
							</div>

							<div className="stat-card stat-active">
								<h3 className="stat-label">Active Users</h3>
								<hr />
								<div className="stat-value stat-value-active">
									{userData.activeUsers.toLocaleString("id-ID")}
								</div>
							</div>

							<div className="stat-card stat-blocked">
								<h3 className="stat-label">Blocked Users</h3>
								<hr />
								<div className="stat-value stat-value-blocked">
									{userData.blockedUsers.toLocaleString("id-ID")}
								</div>
							</div>

							<div className="stat-card stat-avg">
								<h3 className="stat-label">
									Avg. # of Accounts per User
								</h3>
								<hr />
								<div className="stat-value">
									{userData.avgAccountPerUser}
								</div>
							</div>
						</div>

						<DataTable
							title="Users List"
							columns={tableColumns}
							data={paginatedData}
							sortConfig={sortConfig}
							onSort={handleSort}
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
										<button
											className="clear-all-filters-btn"
											onClick={() => setFilterStatus([])}
										>
											<X size={16} /> Clear All Filters
										</button>
									)}
								</div>
							}
							tableClassName="users-list-table"
							headerColor="peach"
						/>

						<Pagination
							currentPage={page}
							totalPages={totalPages}
							rowsPerPage={rowsPerPage}
							onPageChange={setPage}
							onRowsPerPageChange={(v) => {
								setRowsPerPage(v);
								setPage(1);
							}}
							theme="peach"
							maxVisiblePages={9}
						/>
					</>
				)}
			</main>
		</div>
	);
}