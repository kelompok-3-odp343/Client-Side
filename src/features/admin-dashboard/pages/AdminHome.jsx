import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import CategoryChart from "../components/CategoryChart";

import { fetchAdminDashboard } from "../service/adminDashboardServices";

import "../styles/admin-home.css";

import iconDeposit from "../../../assets/images/dashboard-deposits-icon.png";
import iconSaving from "../../../assets/images/dashboard-savings-icon.png";
import iconLifeGoals from "../../../assets/images/dashboard-life-goals-icon.png";
import iconPension from "../../../assets/images/dashboard-dplk-icon.png";

const getSortIcon = (sortConfig, columnKey, onSort) => {
	const isActive = sortConfig?.key === columnKey;
	const ascActive = isActive && sortConfig.direction === "asc";
	const descActive = isActive && sortConfig.direction === "desc";

	return (
		<span
			className={`sort-icons ${isActive ? "active" : ""}`}
			onClick={(e) => {
				e.stopPropagation();
				onSort(columnKey);
			}}
			role="button"
			title="Sort"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onSort(columnKey);
			}}
		>
			<span className={`arrow up ${ascActive ? "active" : ""}`}>↑</span>
			<span className={`arrow down ${descActive ? "active" : ""}`}>↓</span>
		</span>
	);
};

export default function AdminHome() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [dashboard, setDashboard] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState(null);
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	const handleSort = (columnKey) => {
		setSortConfig((prev) => {
			if (!prev || prev.key !== columnKey) {
				return { key: columnKey, direction: "asc" };
			}
			if (prev.direction === "asc") {
				return { key: columnKey, direction: "desc" };
			}
			return null;
		});
	};

	useEffect(() => {
		const loadDashboard = async () => {
			const resp = await fetchAdminDashboard();
			setDashboard(resp.data);
		};
		loadDashboard();
	}, []);

	if (!dashboard) return <div style={{ padding: "2rem" }}>Loading...</div>;

	const colorPalette = ["#FF9F40", "#4BC0C0", "#FF6384", "#9966FF", "#36A2EB"];

	const categoryData = dashboard.categories.map((item, index) => ({
		name: item.categoryName,
		value: item.percentage,
		amount: `Rp${item.total.toLocaleString("id-ID")}`,
		color: colorPalette[index % colorPalette.length],
	}));

	const transactions = dashboard.users.map((u, i) => ({
		id: i + 1,
		userId: u.userId,
		cif: u.customerId,
		nik: u.nik,
		name: u.customerName,
	}));

	const filteredTransactions = transactions.filter(
		(t) =>
			t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			t.cif.includes(searchQuery) ||
			t.nik.includes(searchQuery)
	);

	const sortedTransactions = sortConfig
		? [...filteredTransactions].sort((a, b) => {
			const { key, direction } = sortConfig;
			const dir = direction === "asc" ? 1 : -1;
			return a[key].localeCompare(b[key]) * dir;
		})
		: filteredTransactions;

	const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage);
	const paginatedRows = sortedTransactions.slice(
		(page - 1) * rowsPerPage,
		page * rowsPerPage
	);

	const handleViewTransactions = (transaction) => {
		navigate("/admin/transactions", { state: { userId: transaction.userId } });
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-home-main">
				<div className="top-row">
					<section className="asset-panel">
						<div className="asset-header">
							<h2 className="asset-title">Assets Total</h2>
							<div className="asset-total">
								Rp{dashboard.totalAsset.toLocaleString("id-ID")}
							</div>
						</div>

						<div className="asset-grid">
							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Time Deposits</div>
									<div className="asset-value">
										Rp{dashboard.totalTimeDeposit.toLocaleString("id-ID")}
									</div>
								</div>
								<div className="asset-icon">
									<img src={iconDeposit} alt="Time Deposits" />
								</div>
							</div>

							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Savings</div>
									<div className="asset-value">
										Rp{dashboard.totalSaving.toLocaleString("id-ID")}
									</div>
								</div>
								<div className="asset-icon">
									<img src={iconSaving} alt="Savings" />
								</div>
							</div>

							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Life Goals</div>
									<div className="asset-value">
										Rp{dashboard.totalLifegoals.toLocaleString("id-ID")}
									</div>
								</div>
								<div className="asset-icon">
									<img src={iconLifeGoals} alt="Life Goals" />
								</div>
							</div>

							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Pension Funds</div>
									<div className="asset-value">
										Rp{dashboard.totalPensionFund.toLocaleString("id-ID")}
									</div>
								</div>
								<div className="asset-icon">
									<img src={iconPension} alt="Pension Funds" />
								</div>
							</div>
						</div>
					</section>

					<CategoryChart data={categoryData} />
				</div>

				<section className="table-section">
					<div className="table-header">
						<h2>Transaction History</h2>
						<SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
					</div>

					<div className="table-wrapper">
						<table className="transaction-table">
							<thead>
								<tr>
									<th className="col-no">No</th>
									<th>User ID</th>
									<th>CIF</th>
									<th>NIK</th>
									<th
										className="sortable name-col"
										onClick={() => handleSort("name")}
									>
										<div className="th-content">
											<span className="th-label">Customer Name</span>
											<div className="th-icons">
												{getSortIcon(sortConfig, "name", handleSort)}
											</div>
										</div>
									</th>
									<th className="col-action">Action</th>
								</tr>
							</thead>

							<tbody>
								{paginatedRows.map((transaction, index) => (
									<tr key={transaction.id}>
										<td className="col-no">
											{(page - 1) * rowsPerPage + index + 1}
										</td>
										<td>{transaction.userId}</td>
										<td>{transaction.cif}</td>
										<td>{transaction.nik}</td>
										<td>{transaction.name}</td>
										<td className="col-action">
											<button
												className="view-btn"
												onClick={() => handleViewTransactions(transaction)}
												type="button"
											>
												<Clock size={30} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="pagination-container">
						<div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
							<button
								className="pagination-btn"
								disabled={page === 1}
								onClick={() => setPage(page - 1)}
							>
								Prev
							</button>

							{[...Array(totalPages)].slice(0, 9).map((_, i) => (
								<button
									key={i}
									className={`pagination-number ${page === i + 1 ? "active" : ""}`}
									onClick={() => setPage(i + 1)}
								>
									{i + 1}
								</button>
							))}

							{totalPages > 9 && (
								<span className="pagination-dots">…</span>
							)}

							<button
								className="pagination-btn"
								disabled={page === totalPages}
								onClick={() => setPage(page + 1)}
							>
								Next
							</button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}