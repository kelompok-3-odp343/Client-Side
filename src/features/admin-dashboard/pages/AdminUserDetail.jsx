import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-user-detail.css";

export default function AdminUserDetail() {
	const location = useLocation();
	const { id } = useParams();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Data dari route state atau default
	const userData = location.state?.user || {
		customerName: "Ulion Pardede",
		id: id,
	};

	const accounts = [
		{
			id: 1,
			accountNumber: "1234567890",
			accountType: "Time Deposit",
			effectiveBalance: "Rp5.000.000",
			accountStatus: "Active",
			color: "cyan",
		},
		{
			id: 2,
			accountNumber: "1234567890",
			accountType: "Time Deposit",
			effectiveBalance: "Rp5.000.000",
			accountStatus: "Active",
			color: "peach",
		},
		{
			id: 3,
			accountNumber: "1234567890",
			accountType: "Time Deposit",
			effectiveBalance: "Rp5.000.000",
			accountStatus: "Active",
			color: "yellow",
		},
		{
			id: 4,
			accountNumber: "1234567890",
			accountType: "Time Deposit",
			effectiveBalance: "Rp5.000.000",
			accountStatus: "Active",
			color: "salmon",
		},
		{
			id: 5,
			accountNumber: "1234567890",
			accountType: "Time Deposit",
			effectiveBalance: "Rp5.000.000",
			accountStatus: "Active",
			color: "teal",
		},
		{
			id: 6,
			accountNumber: "1234567890",
			accountType: "Time Deposit",
			effectiveBalance: "Rp5.000.000",
			accountStatus: "Active",
			color: "mint",
		},
		{
			id: 7,
			accountNumber: "1234567890",
			accountType: "Time Deposit",
			effectiveBalance: "Rp5.000.000",
			accountStatus: "Active",
			color: "beige",
		},
	];

	const getCardColorClass = (color) => {
		return `account-card card-${color}`;
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-user-detail-main">
				<div className="user-detail-header">
					<h2>{userData.customerName}</h2>
				</div>

				<div className="accounts-grid">
					{accounts.map((account) => (
						<div key={account.id} className={getCardColorClass(account.color)}>
							<div className="account-card-content">
								<div className="account-row">
									<span className="account-label">Account Number</span>
									<span className="account-value">: {account.accountNumber}</span>
								</div>
								<div className="account-row">
									<span className="account-label">Account Type</span>
									<span className="account-value">: {account.accountType}</span>
								</div>
								<div className="account-row">
									<span className="account-label">Effective Balance</span>
									<span className="account-value">: {account.effectiveBalance}</span>
								</div>
								<div className="account-row">
									<span className="account-label">Account Status</span>
									<span className="account-value">: {account.accountStatus}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}