import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-transactions.css";

export default function AdminTransactions() {
	const location = useLocation();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Data dari route state atau default
	const customerData = location.state?.transaction || {
		name: "Erlangga Wahyu Utomo",
		cif: "9285711834",
		nik: "3277017005000004",
	};

	const pieData = [
		{ name: "QRIS", value: 40, color: "#FFA07A" },
		{ name: "Top Up", value: 35, color: "#FFD700" },
		{ name: "Others", value: 28, color: "#FFB6C1" },
	];

	const transactions = [
		{
			id: 1,
			productType: "Saving",
			accountNumber: "1234567890",
			transactionId: "20251023054245000290",
			dateTime: "23 Oct 2025 10:42:32",
			category: "QRIS",
			amount: "Rp500.000",
			status: "Pending",
		},
		{
			id: 2,
			productType: "Time Deposit",
			accountNumber: "1234567890",
			transactionId: "20251023054245000290",
			dateTime: "23 Oct 2025 10:42:32",
			category: "Transfer",
			amount: "Rp2.000.000",
			status: "Failed",
		},
		{
			id: 3,
			productType: "Saving",
			accountNumber: "1234567890",
			transactionId: "20251023054245000290",
			dateTime: "23 Oct 2025 10:42:32",
			category: "E-wallet",
			amount: "Rp100.000",
			status: "Success",
		},
		{
			id: 4,
			productType: "Saving",
			accountNumber: "1234567890",
			transactionId: "20251023054245000290",
			dateTime: "23 Oct 2025 10:42:32",
			category: "Bill Payment",
			amount: "Rp200.000",
			status: "Pending",
		},
		{
			id: 5,
			productType: "Pension Fund",
			accountNumber: "1234567890",
			transactionId: "20251023054245000290",
			dateTime: "23 Oct 2025 10:42:32",
			category: "QRIS",
			amount: "Rp70.000",
			status: "Failed",
		},
		{
			id: 6,
			productType: "Life Goals",
			accountNumber: "1234567890",
			transactionId: "20251023054245000290",
			dateTime: "23 Oct 2025 10:42:32",
			category: "Transfer",
			amount: "Rp50.000",
			status: "Success",
		},
	];

	const filteredTransactions = transactions.filter((t) =>
		Object.values(t).some((val) =>
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

	const sortedTransactions = [...filteredTransactions].sort((a, b) => {
		if (!sortConfig.key) return 0;

		const aVal = a[sortConfig.key];
		const bVal = b[sortConfig.key];

		if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
		if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

	const getStatusClass = (status) => {
		switch (status.toLowerCase()) {
			case "success":
				return "status-success";
			case "pending":
				return "status-pending";
			case "failed":
				return "status-failed";
			default:
				return "";
		}
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-transactions-main">
				{/* TOP ROW */}
				<div className="top-row">
					{/* ACCOUNT DETAILS */}
					<section className="account-details-panel">
						<h2 className="panel-title">Account Details</h2>
						<div className="details-grid">
							<div className="detail-item">
								<span className="detail-label">Customer Name</span>
								<span className="detail-value">: {customerData.name}</span>
							</div>
							<div className="detail-item">
								<span className="detail-label">CIF</span>
								<span className="detail-value">: {customerData.cif}</span>
							</div>
							<div className="detail-item">
								<span className="detail-label">NIK</span>
								<span className="detail-value">: {customerData.nik}</span>
							</div>
						</div>
					</section>

					{/* TRANSACTION CATEGORY */}
					<section className="category-panel">
						<h2 className="panel-title">Transaction Category</h2>
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

				{/* TRANSACTION DETAILS TABLE */}
				<section className="table-section">
					<div className="table-header">
						<h2>Transaction Details</h2>
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
									<th
										className="sortable"
										onClick={() => handleSort("productType")}
									>
										Product Type
										{sortConfig.key === "productType" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th
										className="sortable"
										onClick={() => handleSort("accountNumber")}
									>
										Account Number
										{sortConfig.key === "accountNumber" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th>Transaction ID</th>
									<th
										className="sortable"
										onClick={() => handleSort("dateTime")}
									>
										Date & Time
										{sortConfig.key === "dateTime" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th
										className="sortable"
										onClick={() => handleSort("category")}
									>
										Category
										{sortConfig.key === "category" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th
										className="sortable"
										onClick={() => handleSort("amount")}
									>
										Amount
										{sortConfig.key === "amount" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
									<th
										className="sortable"
										onClick={() => handleSort("status")}
									>
										Status
										{sortConfig.key === "status" && (
											<span className="sort-icon">
												{sortConfig.direction === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
								</tr>
							</thead>
							<tbody>
								{sortedTransactions.map((transaction, index) => (
									<tr key={transaction.id}>
										<td>{index + 1}</td>
										<td>{transaction.productType}</td>
										<td>{transaction.accountNumber}</td>
										<td>{transaction.transactionId}</td>
										<td>{transaction.dateTime}</td>
										<td>{transaction.category}</td>
										<td>{transaction.amount}</td>
										<td>
											<span className={`status-badge ${getStatusClass(transaction.status)}`}>
												{transaction.status}
											</span>
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