import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-user-detail.css";

export default function AdminUserDetail() {
	const location = useLocation();
	const { id } = useParams();
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showActionModal, setShowActionModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedChecker, setSelectedChecker] = useState("");
	const [reason, setReason] = useState("");
	const [actionType, setActionType] = useState(""); // "block" or "unblock"
	
	// Local state for user data
	const [userData, setUserData] = useState(null);
	const [accounts, setAccounts] = useState([]);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Sample checkers
	const checkers = [
		{ id: "ADM002", name: "Khairuddin Nasty" },
		{ id: "ADM004", name: "Checker 2" },
		{ id: "ADM005", name: "Checker 3" },
	];

	// Fetch user details (mock) and load saved status
	useEffect(() => {
		const fetchUserDetails = async () => {
			setLoading(true);
			setError(null);
			
			try {
				const stateUser = location.state?.user;
				
				if (stateUser) {
					setUserData(stateUser);
					setAccounts(stateUser.accounts || []);
				} else {
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

	const colors = ["#6DDDD0", "#FFBC8E", "#CABEE3"];

	// Get color based on diagonal pattern
	const getCardColor = (index) => {
		const row = Math.floor(index / 3);
		const col = index % 3;
		const colorIndex = (row + col) % 3;
		return colors[colorIndex];
	};

	const handleUnblock = () => {
		setActionType("unblock");
		setShowActionModal(true);
	};

	const handleBlock = () => {
		setActionType("block");
		setShowActionModal(true);
	};

	const handleSubmitAction = async () => {
		if (!selectedChecker) {
			alert("Please select a checker");
			return;
		}
		if (!reason.trim()) {
			alert("Please provide a reason");
			return;
		}

		try {
			// Load existing activities or create new array
			let activitiesList = [];
			const storedActivities = sessionStorage.getItem('activities');
			
			if (storedActivities) {
				try {
					activitiesList = JSON.parse(storedActivities);
				} catch (e) {
					console.error('Error parsing activities:', e);
					activitiesList = [];
				}
			}
			
			// Get current date and admin info
			const now = new Date();
			const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
			const adminName = sessionStorage.getItem('adminName') || 'Della Puspita';
			const adminId = sessionStorage.getItem('adminId') || 'ADM001';
			
			// Create new activity
			const newActivity = {
				id: activitiesList.length + 1,
				activityId: `ACK00000${activitiesList.length + 1}`,
				actionFlow: "Check & Approval",
				actionType: actionType, // "block" or "unblock"
				data: `P00${activitiesList.length + 1}`,
				createdTime: dateStr,
				createdBy: adminId,
				checkerId: selectedChecker,
				approverId: "",
				status: "Pending Check",
				customerName: userData.customerName,
				cif: userData.cif,
				reason: reason,
				createdAt: `${dateStr} by ${adminName} (${adminId})`,
				checkedBy: selectedChecker,
				checkedAt: "",
				approvedBy: "",
				approvedAt: "",
				rejectionNotes: "-",
			};
			
			// Add to activities list
			activitiesList.push(newActivity);
			sessionStorage.setItem('activities', JSON.stringify(activitiesList));
			
			// Close modal and show success
			setShowActionModal(false);
			setShowSuccessModal(true);
			
			// Trigger event for Activity page to refresh
			window.dispatchEvent(new Event('activityStatusChanged'));
		} catch (err) {
			console.error("Error creating request:", err);
			setError("Failed to create request. Please try again.");
		}
	};

	const handleSuccessViewActivity = () => {
		navigate("/admin/activity");
	};

	const handleSuccessClose = () => {
		setShowSuccessModal(false);
		setSelectedChecker("");
		setReason("");
		setActionType("");
	};

	const cancelAction = () => {
		setShowActionModal(false);
		setSelectedChecker("");
		setReason("");
		setActionType("");
	};

	const isBlocked = userData?.status === "Blocked";
	const isFormValid = selectedChecker && reason.trim();

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
					<div className="action-buttons">
						<button 
							className={`unblock-btn ${!isBlocked ? "disabled" : ""}`}
							onClick={handleUnblock}
							disabled={!isBlocked}
						>
							Unblock
						</button>
						<button 
							className={`block-btn ${isBlocked ? "disabled" : ""}`}
							onClick={handleBlock}
							disabled={isBlocked}
						>
							Block
						</button>
					</div>
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

			{/* Action Modal - Block/Unblock */}
			{showActionModal && (
				<div className="modal-overlay">
					<div className="modal-content modal-action">
						<h3 className="modal-title">{actionType === "block" ? "Block" : "Unblock"} User Request</h3>
						<div className="modal-field">
							<label className="modal-label">Checker*</label>
							<select
								className="modal-select"
								value={selectedChecker}
								onChange={(e) => setSelectedChecker(e.target.value)}
							>
								<option value="">Choose a checker</option>
								{checkers.map((checker) => (
									<option key={checker.id} value={checker.id}>
										{checker.name} ({checker.id})
									</option>
								))}
							</select>
						</div>
						
						<div className="modal-field">
							<label className="modal-label">Reason*</label>
							<textarea
								className="modal-textarea"
								placeholder="Type here ..."
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								rows={5}
							/>
						</div>
						
						<span className="modal-required">*required</span>
						
						<div className="modal-actions">
							<button className="modal-btn modal-btn-cancel" onClick={cancelAction}>
								Cancel
							</button>
							<button 
								className={`modal-btn modal-btn-submit ${!isFormValid ? 'disabled' : ''}`}
								onClick={handleSubmitAction}
								disabled={!isFormValid}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Success Modal with Navigation Options */}
			{showSuccessModal && (
				<div className="modal-overlay">
					<div className="modal-content modal-success">
						<h3 className="modal-title">
							{actionType === "block" ? "Block" : "Unblock"} request submitted successfully!
						</h3>
						<p className="modal-subtitle">The request is now pending checker approval.</p>
						<div className="modal-actions modal-actions-vertical">
							<button className="modal-btn modal-btn-primary" onClick={handleSuccessViewActivity}>
								View Activity List
							</button>
							<button className="modal-btn modal-btn-secondary" onClick={handleSuccessClose}>
								Stay on This Page
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}