import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import CategoryChart from "../components/CategoryChart";
import InfoCard from "../components/InfoCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
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

	const categoryData = [
		{ name: "QRIS", value: 40, amount: "Rp2.000.000", color: "#FFBC8E" },
		{ name: "Top Up", value: 35, amount: "Rp1.750.000", color: "#FFE8B0" },
		{ name: "Others", value: 25, amount: "Rp1.250.000", color: "#FFDDB7" },
	];

	const accountDetailsData = [
		{ label: "Customer Name", value: customerData.name },
		{ label: "CIF", value: customerData.cif },
		{ label: "NIK", value: customerData.nik },
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

	const tableColumns = [
		{ key: "no", label: "No", sortable: false },
		{ key: "productType", label: "Product Type", sortable: true },
		{ key: "accountNumber", label: "Account Number", sortable: false },
		{ key: "transactionId", label: "Transaction ID", sortable: false },
		{ key: "dateTime", label: "Date & Time", sortable: true },
		{ key: "category", label: "Category", sortable: true },
		{ key: "amount", label: "Amount", sortable: true },
		{ key: "status", label: "Status", sortable: true },
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

	const renderCell = (row, column, index) => {
		if (column.key === "no") return index + 1;
		if (column.key === "status") {
			return <StatusBadge status={row.status} type="transaction" />;
		}
		return row[column.key];
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-transactions-main">
				{/* TOP ROW */}
				<div className="top-row">
					<InfoCard title="Account Details" data={accountDetailsData} />
					<CategoryChart data={categoryData} />
				</div>

				{/* TRANSACTION DETAILS TABLE */}
				<DataTable
					title="Transaction Details"
					columns={tableColumns}
					data={sortedTransactions}
					sortConfig={sortConfig}
					onSort={handleSort}
					renderCell={renderCell}
					searchBar={
						<SearchBar
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					}
					tableClassName="transaction-details-table"
				/>
			</main>
		</div>
	);
}