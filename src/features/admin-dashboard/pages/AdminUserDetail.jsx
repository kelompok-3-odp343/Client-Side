import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-user-detail.css";

export default function AdminUserDetail() {
	const location = useLocation();
	const { id } = useParams();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showUnblockModal, setShowUnblockModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	
	// Local state for user data
	const [userData, setUserData] = useState(null);
	const [accounts, setAccounts] = useState([]);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Fetch user details from API
	useEffect(() => {
		const fetchUserDetails = async () => {
			setLoading(true);
			setError(null);
			
			try {
				// TODO: Replace with actual API call
				// const response = await fetch(`/api/admin/users/${id}`);
				// const data = await response.json();
				
				// For now, use state data or defaults
				const stateUser = location.state?.user;
				
				if (stateUser) {
					setUserData(stateUser);
					setAccounts(stateUser.accounts || []);
				} else {
					// Fallback: fetch from API
					// const data = await getUserById(id);
					// setUserData(data.user);
					// setAccounts(data.accounts);
					
					// Temporary default data
					setUserData({
						customerName: "Ulion Pardede",
						cif: id || "9285711830",
						status: "Blocked",
					});
					setAccounts([
						{
							id: 1,
							accountNumber: "1234567890",
							accountType: "Time Deposit",
							effectiveBalance: "Rp5.000.000",
							status: "Active",
						},
						{
							id: 2,
							accountNumber: "1234567891",
							accountType: "Savings",
							effectiveBalance: "Rp12.500.000",
							status: "Blocked",
						},
						{
							id: 3,
							accountNumber: "1234567892",
							accountType: "Time Deposit",
							effectiveBalance: "Rp8.750.000",
							status: "Active",
						},
						{
							id: 4,
							accountNumber: "1234567893",
							accountType: "Pension Fund",
							effectiveBalance: "Rp15.000.000",
							status: "Active",
						},
						{
							id: 5,
							accountNumber: "1234567894",
							accountType: "Life Goals",
							effectiveBalance: "Rp3.200.000",
							status: "Active",
						},
						{
							id: 6,
							accountNumber: "1234567895",
							accountType: "Savings",
							effectiveBalance: "Rp20.000.000",
							status: "Blocked",
						},
						{
							id: 7,
							accountNumber: "1234567896",
							accountType: "Time Deposit",
							effectiveBalance: "Rp6.500.000",
							status: "Active",
						},
					]);
				}
			} catch (err) {
				setError(err.message || "Failed to fetch user details");
				console.error("Error fetching user details:", err);
			} finally {
				setLoading(false);
			}
		};

		// Load status from sessionStorage
		const savedStatuses = sessionStorage.getItem('userStatuses');
		if (savedStatuses) {
			try {
				const statuses = JSON.parse(savedStatuses);
				if (statuses[id]) {
					setUserData(prev => prev ? { ...prev, status: statuses[id] } : null);
				}
			} catch (e) {
				console.error('Error parsing user statuses:', e);
			}
		}

		fetchUserDetails();
	}, [id, location.state]);

	const colors = ["#FFBC8E", "#FFE8B0", "#6DDDD0"];

	// Get color based on diagonal pattern
	const getCardColor = (index) => {
		const row = Math.floor(index / 3);
		const col = index % 3;
		const colorIndex = (row + col) % 3;
		return colors[colorIndex];
	};

	const handleUnblock = () => {
		setShowUnblockModal(true);
	};

	const confirmUnblock = async () => {
		try {
			// TODO: Replace with actual API call
			// await fetch(`/api/admin/users/${userData.cif}/unblock`, {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' }
			// });
			
			// Update local user status
			const updatedUser = {
				...userData,
				status: "Active",
			};
			setUserData(updatedUser);
			
			// Update accounts status
			const updatedAccounts = accounts.map(acc => ({ ...acc, status: "Active" }));
			setAccounts(updatedAccounts);
			
			// Save to sessionStorage for persistence
			const savedStatuses = sessionStorage.getItem('userStatuses');
			let statuses = {};
			if (savedStatuses) {
				try {
					statuses = JSON.parse(savedStatuses);
				} catch (e) {
					console.error('Error parsing user statuses:', e);
				}
			}
			statuses[userData.cif] = "Active";
			sessionStorage.setItem('userStatuses', JSON.stringify(statuses));
			
			// Trigger event for AdminUsers to refresh
			window.dispatchEvent(new Event('userStatusChanged'));
			
			setShowUnblockModal(false);
		} catch (err) {
			console.error("Error unblocking user:", err);
			setError("Failed to unblock user. Please try again.");
		}
	};

	const cancelUnblock = () => {
		setShowUnblockModal(false);
	};

	const isBlocked = userData?.status === "Blocked";

	if (loading) {
		return (
			<div className="admin-container">
				<AdminNavBar onMenuToggle={toggleSidebar} />
				<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
				<main className="admin-user-detail-main">
					<div className="loading-state">Loading user details...</div>
				</main>
			</div>
		);
	}

	if (error || !userData) {
		return (
			<div className="admin-container">
				<AdminNavBar onMenuToggle={toggleSidebar} />
				<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
				<main className="admin-user-detail-main">
					<div className="error-state">{error || "User not found"}</div>
				</main>
			</div>
		);
	}

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-user-detail-main">
				<div className="user-detail-header">
					<div className="user-info">
						<h2 className="user-name">{userData.customerName}</h2>
						<div className="user-meta">
							<span className="user-cif">CIF: {userData.cif}</span>
							<span className={`user-status ${userData.status === "Blocked" ? "blocked" : "active"}`}>
								Customer Status: {userData.status}
							</span>
						</div>
					</div>
					<button 
						className={`unblock-btn ${!isBlocked ? "disabled" : ""}`}
						onClick={handleUnblock}
						disabled={!isBlocked}
					>
						Unblock
					</button>
				</div>

				<div className="accounts-grid">
					{accounts.map((account, index) => (
						<div
							key={account.id || index}
							className="account-card"
							style={{ background: getCardColor(index) }}
						>
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
									<span className="account-value">: {account.status}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</main>

			{/* Unblock Confirmation Modal */}
			{showUnblockModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h3 className="modal-title">Are you sure you want to unblock this account?</h3>
						<div className="modal-actions">
							<button className="modal-btn modal-btn-no" onClick={cancelUnblock}>
								No
							</button>
							<button className="modal-btn modal-btn-yes" onClick={confirmUnblock}>
								Yes
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}