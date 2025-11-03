import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Filter, X } from "lucide-react";
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
	const [filterProductType, setFilterProductType] = useState([]);
	const [filterCategory, setFilterCategory] = useState([]);
	const [showProductTypeFilter, setShowProductTypeFilter] = useState(false);
	const [showCategoryFilter, setShowCategoryFilter] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Data dari route state atau default
	const customerData = location.state?.transaction || {
		name: "Erlangga Wahyu Utomo",
		cif: "9285711834",
		nik: "3277017005000004",
	};

	// Static category data - tidak akan berubah saat sorting
	const categoryData = useMemo(
		() => [
			{ name: "QRIS", value: 40, amount: "Rp2.000.000", color: "#FFBC8E" },
			{ name: "Top Up", value: 35, amount: "Rp1.750.000", color: "#FFE8B0" },
			{ name: "Others", value: 25, amount: "Rp1.250.000", color: "#FFDDB7" },
		],
		[]
	);

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

	// Get unique values for filters
	const productTypes = [...new Set(transactions.map((t) => t.productType))];
	const categories = [...new Set(transactions.map((t) => t.category))];

	const tableColumns = [
		{ key: "no", label: "No", sortable: false },
		{ key: "productType", label: "Product Type", sortable: true, filterable: true },
		{ key: "accountNumber", label: "Account Number", sortable: false },
		{ key: "transactionId", label: "Transaction ID", sortable: false },
		{ key: "dateTime", label: "Date & Time", sortable: true },
		{ key: "category", label: "Category", sortable: true, filterable: true },
		{ key: "amount", label: "Amount", sortable: true },
		{ key: "status", label: "Status", sortable: true },
	];

	// Helper function to parse amount string to number
	const parseAmount = (amountStr) => {
		return parseInt(amountStr.replace(/[^0-9]/g, ""), 10);
	};

	// Filter and search
	const filteredTransactions = transactions.filter((t) => {
		// Search filter
		const matchesSearch = Object.values(t).some((val) =>
			val.toString().toLowerCase().includes(searchQuery.toLowerCase())
		);

		// Product type filter
		const matchesProductType =
			filterProductType.length === 0 || filterProductType.includes(t.productType);

		// Category filter
		const matchesCategory =
			filterCategory.length === 0 || filterCategory.includes(t.category);

		return matchesSearch && matchesProductType && matchesCategory;
	});

	const handleSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const sortedTransactions = [...filteredTransactions].sort((a, b) => {
		if (!sortConfig.key) return 0;

		let aVal = a[sortConfig.key];
		let bVal = b[sortConfig.key];

		// Special handling for amount - parse to number
		if (sortConfig.key === "amount") {
			aVal = parseAmount(aVal);
			bVal = parseAmount(bVal);
		}

		// Special handling for date
		if (sortConfig.key === "dateTime") {
			aVal = new Date(aVal).getTime();
			bVal = new Date(bVal).getTime();
		}

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

	const toggleProductTypeFilter = (type) => {
		setFilterProductType((prev) =>
			prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
		);
	};

	const toggleCategoryFilter = (cat) => {
		setFilterCategory((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
		);
	};

	const clearProductTypeFilter = () => {
		setFilterProductType([]);
	};

	const clearCategoryFilter = () => {
		setFilterCategory([]);
	};

	const clearAllFilters = () => {
		setFilterProductType([]);
		setFilterCategory([]);
	};

	const hasActiveFilters = filterProductType.length > 0 || filterCategory.length > 0;

	const renderColumnHeader = (column) => {
		if (!column.filterable) return null;

		const isProductType = column.key === "productType";
		const showFilter = isProductType ? showProductTypeFilter : showCategoryFilter;
		const filterList = isProductType ? productTypes : categories;
		const selectedFilters = isProductType ? filterProductType : filterCategory;
		const toggleFilter = isProductType ? toggleProductTypeFilter : toggleCategoryFilter;
		const clearFilter = isProductType ? clearProductTypeFilter : clearCategoryFilter;
		const setShowFilter = isProductType
			? setShowProductTypeFilter
			: setShowCategoryFilter;

		const hasFilter = selectedFilters.length > 0;

		return (
			<div className="filter-dropdown-container">
				<button
					className={`filter-icon-btn ${hasFilter ? "active" : ""}`}
					onClick={(e) => {
						e.stopPropagation();
						setShowFilter(!showFilter);
					}}
					title="Filter"
				>
					<Filter size={16} />
					{hasFilter && <span className="filter-badge">{selectedFilters.length}</span>}
				</button>

				{showFilter && (
					<>
						<div
							className="filter-dropdown-overlay"
							onClick={() => setShowFilter(false)}
						/>
						<div className="filter-dropdown">
							<div className="filter-dropdown-header">
								<span className="filter-dropdown-title">Filter {column.label}</span>
								{hasFilter && (
									<button
										className="clear-filter-btn"
										onClick={clearFilter}
										title="Clear filter"
									>
										<X size={14} />
										Clear
									</button>
								)}
							</div>
							<div className="filter-options">
								{filterList.map((item) => (
									<label key={item} className="filter-checkbox-label">
										<input
											type="checkbox"
											checked={selectedFilters.includes(item)}
											onChange={() => toggleFilter(item)}
										/>
										<span>{item}</span>
									</label>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		);
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
					tableClassName="transaction-details-table"
					headerColor="teal"
				/>
			</main>
		</div>
	);
}