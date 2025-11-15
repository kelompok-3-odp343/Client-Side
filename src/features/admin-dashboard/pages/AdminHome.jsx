import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import SearchBar from "../components/SearchBar";
import CategoryChart from "../components/CategoryChart";
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
	const [searchQuery, setSearchQuery] = useState("");
	const [sortConfig, setSortConfig] = useState(null);

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

	const transactions = [
		{ id: "T1", cif: "9285711832", nik: "3277017005000007", name: "Della Puspita" },
		{ id: "T2", cif: "9285711834", nik: "3277017005000009", name: "Erlangga Wahyu Utomo" },
		{ id: "T3", cif: "9285711831", nik: "3277017005000006", name: "Khairuddin Nasty" },
		{ id: "T4", cif: "9285711833", nik: "3277017005000008", name: "Oktavia Qurrota A'yuni" },
		{ id: "T5", cif: "9285711830", nik: "3277017005000005", name: "Ridwan Surya Ghani" },
		{ id: "T6", cif: "9285711829", nik: "3277017005000004", name: "Ulion Alberto Perkasa Pardede" },
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

	const sortedTransactions = sortConfig
        ? [...filteredTransactions].sort((a, b) => {
              const { key, direction } = sortConfig;
              const dir = direction === "asc" ? 1 : -1;
              const va = a[key];
              const vb = b[key];

              if (typeof va === "string" && typeof vb === "string") {
                  return va.localeCompare(vb) * dir;
              }
              if (va > vb) return 1 * dir;
              if (va < vb) return -1 * dir;
              return 0;
          })
        : filteredTransactions;

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
									<th className="col-no">No</th>
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
								{sortedTransactions.map((transaction, index) => (
									<tr key={transaction.id}>
										<td className="col-no">{index + 1}</td>
										<td>{transaction.cif}</td>
										<td>{transaction.nik}</td>
										<td>{transaction.name}</td>
										<td className="col-action">
											<button
												className="view-btn"
												onClick={() => handleViewTransactions(transaction)}
												type="button"
												title="View transaction history"
											>
												<Clock size={30} />
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