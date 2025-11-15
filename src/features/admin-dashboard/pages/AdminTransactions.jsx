import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { fetchAdminTransactionList } from "../service/adminTransactionService";

export default function AdminTransactions() {
	const location = useLocation();
	const tableRef = useRef(null);

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState(null);

	const [filterProductType, setFilterProductType] = useState([]);
	const [filterCategory, setFilterCategory] = useState([]);
	const [showProductTypeFilter, setShowProductTypeFilter] = useState(false);
	const [showCategoryFilter, setShowCategoryFilter] = useState(false);

	const [transactionData, setTransactionData] = useState(null);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	useEffect(() => {
		const loadData = async () => {
			const userId = location.state?.cif || "DEFAULT_USER";
			const resp = await fetchAdminTransactionList(userId);
			setTransactionData(resp.data);
		};
		loadData();
	}, []);

	const transactions = useMemo(() => {
		if (!transactionData) return [];
		return transactionData.transactionHistories.map((t, index) => ({
			id: index + 1,
			productType: t.productTypeLabel,
			accountNumber: t.accountNumber,
			transactionId: t.transactionId,
			dateTime: new Date(t.paymentTime).toLocaleString("id-ID"),
			category: t.transactionCategory,
			amount: `Rp${t.transactionAmount.toLocaleString("id-ID")}`,
			status: t.status,
			rawAmount: t.transactionAmount,
		}));
	}, [transactionData]);

	const customerData = useMemo(() => {
		if (!transactionData) return { name: "-", cif: "-", nik: "-" };
		return {
			name: transactionData.customerName,
			cif: transactionData.customerId,
			nik: transactionData.nik,
		};
	}, [transactionData]);

	const productTypes = useMemo(
		() => [...new Set(transactions.map((t) => t.productType))],
		[transactions]
	);

	const categories = useMemo(
		() => [...new Set(transactions.map((t) => t.category))],
		[transactions]
	);

	const parseAmount = (str) => parseInt(str.replace(/[^0-9]/g, ""), 10);

	const filteredTransactions = useMemo(() => {
		return transactions.filter((t) => {
			const matchesSearch = Object.values(t).some((v) =>
				v.toString().toLowerCase().includes(searchQuery.toLowerCase())
			);

			const matchesProduct =
				filterProductType.length === 0 ||
				filterProductType.includes(t.productType);

			const matchesCategory =
				filterCategory.length === 0 ||
				filterCategory.includes(t.category);

			return matchesSearch && matchesProduct && matchesCategory;
		});
	}, [transactions, searchQuery, filterProductType, filterCategory]);

	const sortedTransactions = useMemo(() => {
		if (!sortConfig) return filteredTransactions;

		const sorted = [...filteredTransactions].sort((a, b) => {
			let aVal = a[sortConfig.key];
			let bVal = b[sortConfig.key];

			if (sortConfig.key === "amount") {
				aVal = parseAmount(aVal);
				bVal = parseAmount(bVal);
			}

			if (sortConfig.key === "dateTime") {
				aVal = new Date(aVal).getTime();
				bVal = new Date(bVal).getTime();
			}

			if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
			if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});

		return sorted;
	}, [filteredTransactions, sortConfig]);

	// PAGINATION
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * rowsPerPage;
		return sortedTransactions.slice(start, start + rowsPerPage);
	}, [sortedTransactions, currentPage, rowsPerPage]);

	const goToPage = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			if (tableRef.current) tableRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, filterProductType, filterCategory, rowsPerPage]);

	const top3CategoryData = useMemo(() => {
		if (!transactionData) return [];

		const totals = {};

		transactionData.transactionHistories.forEach((t) => {
			if (!totals[t.transactionCategory]) totals[t.transactionCategory] = 0;
			totals[t.transactionCategory] += t.transactionAmount;
		});

		const sorted = Object.entries(totals)
			.map(([name, total]) => ({ name, total }))
			.sort((a, b) => b.total - a.total)
			.slice(0, 3);

		const totalOfTop3 = sorted.reduce((a, b) => a + b.total, 0);
		const colors = ["#FF9F40", "#4BC0C0", "#FF6384"];

		return sorted.map((item, idx) => ({
			name: item.name,
			color: colors[idx],
			amount: `Rp${item.total.toLocaleString("id-ID")}`,
			value: Math.round((item.total / totalOfTop3) * 100),
		}));
	}, [transactionData]);

	const toggleProductTypeFilter = (type) => {
		setFilterProductType((prev) =>
			prev.includes(type)
				? prev.filter((t) => t !== type)
				: [...prev, type]
		);
	};

	const toggleCategoryFilter = (cat) => {
		setFilterCategory((prev) =>
			prev.includes(cat)
				? prev.filter((c) => c !== cat)
				: [...prev, cat]
		);
	};

	const renderColumnHeader = (column) => {
		if (!column.filterable) return null;

		const isProduct = column.key === "productType";
		const list = isProduct ? productTypes : categories;
		const selected = isProduct ? filterProductType : filterCategory;
		const toggle = isProduct ? toggleProductTypeFilter : toggleCategoryFilter;
		const clear = isProduct
			? () => setFilterProductType([])
			: () => setFilterCategory([]);

		const show = isProduct ? showProductTypeFilter : showCategoryFilter;
		const setShow =
			isProduct ? setShowProductTypeFilter : setShowCategoryFilter;

		return (
			<div className="filter-dropdown-container">
				<button
					className={`filter-icon-btn ${selected.length ? "active" : ""}`}
					onClick={(e) => {
						e.stopPropagation();
						setShow(!show);
					}}
				>
					<Filter size={16} />
					{selected.length > 0 && (
						<span className="filter-badge">{selected.length}</span>
					)}
				</button>

				{show && (
					<>
						<div
							className="filter-dropdown-overlay"
							onClick={() => setShow(false)}
						/>

						<div className="filter-dropdown">
							<div className="filter-dropdown-header">
								<span>{column.label}</span>

								{selected.length > 0 && (
									<button className="clear-filter-btn" onClick={clear}>
										<X size={14} /> Clear
									</button>
								)}
							</div>

							<div className="filter-options">
								{list.map((item) => (
									<label key={item} className="filter-checkbox-label">
										<input
											type="checkbox"
											checked={selected.includes(item)}
											onChange={() => toggle(item)}
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

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>

			<main className="admin-transactions-main">

				<div className="top-row">
					<InfoCard
						title="Account Details"
						data={[
							{ label: "Customer Name", value: customerData.name },
							{ label: "CIF", value: customerData.cif },
							{ label: "NIK", value: customerData.nik },
						]}
					/>

					<CategoryChart data={top3CategoryData} />
				</div>

				<div ref={tableRef}>
					<DataTable
						title="Transaction Details"
						columns={tableColumns}
						data={paginatedData}
						sortConfig={sortConfig}
						onSort={setSortConfig}
						renderCell={(row, col, idx) =>
							col.key === "no"
								? (currentPage - 1) * rowsPerPage + (idx + 1)
								: col.key === "status"
									? <StatusBadge status={row.status} type="transaction" />
									: row[col.key]
						}
						renderColumnHeader={renderColumnHeader}
						searchBar={
							<div className="search-and-filter">
								<SearchBar
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								{(filterProductType.length > 0 ||
									filterCategory.length > 0) && (
										<button
											className="clear-all-filters-btn"
											onClick={() => {
												setFilterProductType([]);
												setFilterCategory([]);
											}}
										>
											<X size={16} /> Clear All Filters
										</button>
									)}
							</div>
						}
						tableClassName="transaction-details-table"
						headerColor="teal"
					/>
				</div>

				<div className="pagination-wrapper">
					<div className="rows-per-page">
						Show:
						<select
							value={rowsPerPage}
							onChange={(e) => setRowsPerPage(Number(e.target.value))}
						>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>
						rows
					</div>

					<div className="pagination-container">
						<button
							className="pagination-btn"
							onClick={() => goToPage(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Prev
						</button>

						{[...Array(totalPages)].map((_, i) => (
							<button
								key={i}
								className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
								onClick={() => goToPage(i + 1)}
							>
								{i + 1}
							</button>
						))}

						<button
							className="pagination-btn"
							onClick={() => goToPage(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>

				</div>

			</main>
		</div>
	);
}
