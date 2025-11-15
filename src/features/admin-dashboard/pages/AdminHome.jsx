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
		>
			<span className={`arrow up ${ascActive ? "active" : ""}`}>↑</span>
			<span className={`arrow down ${descActive ? "active" : ""}`}>↓</span>
		</span>
	);
};

export default function AdminHome() {
	const navigate = useNavigate();

	const [dashboard, setDashboard] = useState(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;

	useEffect(() => {
		const getData = async () => {
			const { data } = await fetchAdminDashboard();
			setDashboard(data);
		};
		getData();
	}, []);

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

	if (!dashboard) {
		return <div className="loading">Loading dashboard...</div>;
	}

	const COLORS = ["#FFBC8E", "#FFE8B0", "#FFDDB7", "#F9C5A1", "#F7B267"];

	const categoryData = dashboard.categories.map((c, index) => ({
		name: c.categoryName,
		value: c.percentage,
		amount: c.total,
		color: COLORS[index % COLORS.length],
	}));

	const transactions = dashboard.users.map((u, i) => ({
		id: "T" + (i + 1),
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

	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = sortedTransactions.slice(indexOfFirstRow, indexOfLastRow);

	const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage);

	const goToPage = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleViewTransactions = (transaction) => {
		navigate("/admin/transactions", { state: { transaction } });
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
								Rp {dashboard.totalAsset.toLocaleString("id-ID")}
							</div>
						</div>

						<div className="asset-grid">
							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Time Deposits</div>
									<div className="asset-value">
										Rp {dashboard.totalTimeDeposit.toLocaleString("id-ID")}
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
										Rp {dashboard.totalSaving.toLocaleString("id-ID")}
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
										Rp {dashboard.totalLifegoals.toLocaleString("id-ID")}
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
										Rp {dashboard.totalPensionFund.toLocaleString("id-ID")}
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
									<th>No</th>
									<th>CIF</th>
									<th>NIK</th>
									<th
										className="sortable"
										onClick={() => handleSort("name")}
									>
										<div className="th-content">
											<span className="th-label">Customer Name</span>
											<div className="th-icons">
												{getSortIcon(sortConfig, "name", handleSort)}
											</div>
										</div>
									</th>
									<th>Action</th>
								</tr>
							</thead>

							<tbody>
								{currentRows.map((transaction, index) => (
									<tr key={transaction.id}>
										<td>{indexOfFirstRow + index + 1}</td>
										<td>{transaction.cif}</td>
										<td>{transaction.nik}</td>
										<td>{transaction.name}</td>
										<td>
											<button
												className="view-btn"
												onClick={() => handleViewTransactions(transaction)}
												type="button"
											>
												<Clock size={24} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* 🔥 PAGINATION */}
					<div className="pagination">
						<button
							className="pg-btn"
							disabled={currentPage === 1}
							onClick={() => goToPage(currentPage - 1)}
						>
							Previous
						</button>

						<div className="pg-info">
							Page {currentPage} of {totalPages}
						</div>

						<button
							className="pg-btn"
							disabled={currentPage === totalPages}
							onClick={() => goToPage(currentPage + 1)}
						>
							Next
						</button>
					</div>

					<div className="table-footer">{sortedTransactions.length} rows</div>
				</section>
			</main>
		</div>
	);
}