import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-home.css";

import iconDeposit from "../../../assets/images/dashboard-deposits-icon.png";
import iconSaving from "../../../assets/images/dashboard-savings-icon.png";
import iconLifeGoals from "../../../assets/images/dashboard-life-goals-icon.png";
import iconPension from "../../../assets/images/dashboard-dplk-icon.png";

export default function AdminHome() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [sortAsc, setSortAsc] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
	const toggleSort = () => setSortAsc(!sortAsc);

	const transactions = [
		{ id: 1, cif: "9285711832", nik: "3277017005000007", name: "Della Puspita" },
		{ id: 2, cif: "9285711834", nik: "3277017005000009", name: "Erlangga Wahyu Utomo" },
		{ id: 3, cif: "9285711831", nik: "3277017005000006", name: "Khairuddin Nasty" },
		{ id: 4, cif: "9285711833", nik: "3277017005000008", name: "Oktavia Qurrota A'yuni" },
		{ id: 5, cif: "9285711830", nik: "3277017005000005", name: "Ridwan Surya Ghani" },
		{ id: 6, cif: "9285711829", nik: "3277017005000004", name: "Ulion Pardede" },
	];

	const filteredTransactions = transactions.filter(
		(t) =>
			t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			t.cif.includes(searchQuery) ||
			t.nik.includes(searchQuery)
	);

	const sortedTransactions = [...filteredTransactions].sort((a, b) => {
		if (sortAsc) return a.name.localeCompare(b.name);
		return b.name.localeCompare(a.name);
	});

	const pieData = [
		{ name: "QRIS", value: 40, color: "#FFA07A" },
		{ name: "Top Up", value: 35, color: "#FFD700" },
		{ name: "Others", value: 28, color: "#FFB6C1" },
	];

	const handleViewTransactions = (transaction) => {
		navigate("/admin/transactions", { state: { transaction } });
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-home-main">
				{/* TOP ROW: Assets & Category */}
				<div className="top-row">
					{/* ASSET CARD */}
					<section className="asset-panel">
						<div className="asset-header">
							<h2 className="asset-title">Assets Total</h2>
							<div className="asset-total">Rp17.580.062.398.000</div>
						</div>

						<div className="asset-grid">
							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Time Deposits</div>
									<div className="asset-value">Rp 15.000.000</div>
								</div>
								<div className="asset-icon">
									<img src={iconDeposit} alt="Time Deposits" />
								</div>
							</div>

							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Savings</div>
									<div className="asset-value">Rp 15.000.000</div>
								</div>
								<div className="asset-icon">
									<img src={iconSaving} alt="Savings" />
								</div>
							</div>

							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Life Goals</div>
									<div className="asset-value">Rp 0</div>
								</div>
								<div className="asset-icon">
									<img src={iconLifeGoals} alt="Life Goals" />
								</div>
							</div>

							<div className="asset-item">
								<div className="asset-info">
									<div className="asset-label">Pension Funds</div>
									<div className="asset-value">Rp 0</div>
								</div>
								<div className="asset-icon">
									<img src={iconPension} alt="Pension Funds" />
								</div>
							</div>
						</div>
					</section>

					{/* CATEGORY CARD */}
					<section className="category-panel">
						<h2 className="category-title">Transaction Category</h2>

						<div className="category-content">
							<div className="category-list">
								<div className="category-item">
									<span className="category-name">QRIS</span>
									<span className="category-amount">: 2.000.000</span>
								</div>
								<div className="category-item">
									<span className="category-name">Top Up</span>
									<span className="category-amount">: 1.750.000</span>
								</div>
								<div className="category-item">
									<span className="category-name">Others</span>
									<span className="category-amount">: 1.250.000</span>
								</div>

								<div className="category-percentages">
									<div className="percentage-item">
										<span className="percentage-bar" style={{ background: "#FFB6C1", width: "28%" }}></span>
										<span className="percentage-text">28% Others</span>
									</div>
									<div className="percentage-item">
										<span className="percentage-bar" style={{ background: "#FFD700", width: "35%" }}></span>
										<span className="percentage-text">35% Top Up</span>
									</div>
									<div className="percentage-item">
										<span className="percentage-bar" style={{ background: "#FFA07A", width: "40%" }}></span>
										<span className="percentage-text">40% QRIS</span>
									</div>
								</div>
							</div>

							<div className="category-chart">
								<ResponsiveContainer width="100%" height={220}>
									<PieChart>
										<Pie
											data={pieData}
											cx="50%"
											cy="50%"
											outerRadius={95}
											dataKey="value"
											startAngle={90}
											endAngle={450}
										>
											{pieData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</section>
				</div>

				{/* TABLE SECTION */}
				<section className="table-section">
					<div className="table-header">
						<h2>Transaction History</h2>
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
						<table className="transaction-table">
							<thead>
								<tr>
									<th>No</th>
									<th>CIF</th>
									<th>NIK</th>
									<th onClick={toggleSort} className="sortable">
										Customer Name
										<span className="sort-icon">{sortAsc ? "▲" : "▼"}</span>
									</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{sortedTransactions.map((transaction, index) => (
									<tr key={transaction.id}>
										<td>{index + 1}</td>
										<td>{transaction.cif}</td>
										<td>{transaction.nik}</td>
										<td>{transaction.name}</td>
										<td>
											<button 
												className="view-btn"
												onClick={() => handleViewTransactions(transaction)}
											>
												View transaction history
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="table-footer">{sortedTransactions.length} rows</div>
				</section>
			</main>
		</div>
	);
}