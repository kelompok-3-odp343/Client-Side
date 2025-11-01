import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import CategoryChart from "../components/CategoryChart";
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
		{ id: "T1", cif: "9285711832", nik: "3277017005000007", name: "Della Puspita" },
		{ id: "T2", cif: "9285711834", nik: "3277017005000009", name: "Erlangga Wahyu Utomo" },
		{ id: "T3", cif: "9285711831", nik: "3277017005000006", name: "Khairuddin Nasty" },
		{ id: "T4", cif: "9285711833", nik: "3277017005000008", name: "Oktavia Qurrota A'yuni" },
		{ id: "T5", cif: "9285711830", nik: "3277017005000005", name: "Ridwan Surya Ghani" },
		{ id: "T6", cif: "9285711829", nik: "3277017005000004", name: "Ulion Pardede" },
	];

	const categoryData = [
		{ name: "QRIS", value: 40, amount: "Rp2.000.000", color: "#FFBC8E" },
		{ name: "Top Up", value: 35, amount: "Rp1.750.000", color: "#FFE8B0" },
		{ name: "Others", value: 25, amount: "Rp1.250.000", color: "#FFDDB7" },
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

					<CategoryChart data={categoryData} />
				</div>

				<section className="table-section">
					<div className="table-header">
						<h2>Transaction History</h2>
						<SearchBar
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="table-wrapper">
						<table className="transaction-table">
							<thead>
								<tr>
									<th>No</th>
									<th>CIF</th>
									<th>NIK</th>
									<th onClick={toggleSort} className="sortable">
										Customer Name{" "}
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
												type="button"
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