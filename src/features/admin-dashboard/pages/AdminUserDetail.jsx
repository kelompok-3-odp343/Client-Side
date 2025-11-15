import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";

import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";

import { fetchAdminUserDetail } from "../service/adminUserDetailService";
import "../styles/admin-user-detail.css";

export default function AdminUserDetail() {
	const location = useLocation();
	const navigate = useNavigate();
	const userId = location.state?.userId || null;

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
	const [userData, setUserData] = useState(null);
	const [accounts, setAccounts] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [showActionModal, setShowActionModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const [selectedChecker, setSelectedChecker] = useState("");
	const [reason, setReason] = useState("");
	const [actionType, setActionType] = useState("");
	const [lastActivity, setLastActivity] = useState(null);

	const checkers = [
		{ id: "ADM002", name: "Khairuddin Nasty" },
		{ id: "ADM004", name: "Checker 2" },
		{ id: "ADM005", name: "Checker 3" }
	];

	useEffect(() => {
		const load = async () => {
			if (!userId) {
				setError("User not found");
				setLoading(false);
				return;
			}

			try {
				const resp = await fetchAdminUserDetail(userId);

				setUserData(resp.data);
				setAccounts(resp.data.accounts || []);
			} catch (err) {
				setError("Failed to fetch user detail");
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [userId]);

	const isBlocked = userData?.isBlocked;
	const isFormValid = selectedChecker && reason.trim();

	const handleBlock = () => {
		setActionType("block");
		setShowActionModal(true);
	};

	const handleUnblock = () => {
		setActionType("unblock");
		setShowActionModal(true);
	};

	const handleSubmitAction = () => {
		if (!isFormValid) return;

		const now = new Date();
		const createdTimeDisplay = now.toLocaleString("en-GB");
		let activities = [];
		try {
			const stored = sessionStorage.getItem("activities");
			if (stored) activities = JSON.parse(stored);
		} catch (_) { }

		const newActivity = {
			id: activities.length + 1,
			activityId: `ACT${String(activities.length + 1).padStart(5, "0")}`,
			menu: "User Management",
			actionFlow: "Check & Approval",
			actionType,
			actionMenu: actionType === "block" ? "Block User" : "Unblock User",
			createdTimeDisplay,
			customerName: userData.customerName,
			cif: userData.customerId,
			reason,
			status: "Pending Check",
			checkerId: selectedChecker
		};

		activities.push(newActivity);
		sessionStorage.setItem("activities", JSON.stringify(activities));

		setLastActivity(newActivity);
		setShowActionModal(false);
		setShowSuccessModal(true);
		window.dispatchEvent(new Event("activityStatusChanged"));
	};

	const handleSuccessClose = () => {
		setShowSuccessModal(false);
		setSelectedChecker("");
		setReason("");
	};

	const handleSuccessViewActivity = () => {
		navigate("/admin/activity");
	};

	const cancelAction = () => {
		setShowActionModal(false);
		setSelectedChecker("");
		setReason("");
	};

	const colors = ["#6DDDD0", "#FFBC8E", "#CABEE3"];
	const getCardColor = (index) => colors[index % 3];

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
							<span className="user-cif">
								<span className="label">Customer ID :</span>
								<span className="value">{userData.customerId}</span>
							</span>

							<span className={`user-status ${isBlocked ? "blocked" : "active"}`}>
								<span className="label">Status :</span>
								<span className="value">{isBlocked ? "Blocked" : "Active"}</span>
							</span>
						</div>
					</div>
					<div className="action-buttons">
						<button
							className={`unblock-btn ${!isBlocked ? "disabled" : ""}`}
							onClick={handleUnblock}
							disabled={!isBlocked}
						>
							<Unlock size={24} />
							<span>Unblock</span>
						</button>

						<button
							className={`block-btn ${isBlocked ? "disabled" : ""}`}
							onClick={handleBlock}
							disabled={isBlocked}
						>
							<Lock size={24} />
							<span>Block</span>
						</button>
					</div>
				</div>

				<div className="accounts-grid">
					{accounts.map((acc, i) => (
						<div
							key={i}
							className="account-card"
							style={{ background: getCardColor(i) }}
						>
							<div className="account-card-content">
								<div className="account-row">
									<span className="account-label">Account Number</span>
									<span className="account-value">: {acc.accountNumber}</span>
								</div>

								<div className="account-row">
									<span className="account-label">Product Type</span>
									<span className="account-value">: {acc.productName}</span>
								</div>

								<div className="account-row">
									<span className="account-label">Account Status</span>
									<span className="account-value">: {acc.accountStatus}</span>
								</div>

								<div className="account-row">
									<span className="account-label">Balance</span>
									<span className="account-value">
										: Rp{acc.effectiveBalance.toLocaleString("id-ID")}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</main>

			{showActionModal && (
				<div className="modal-overlay">
					<div className="modal-content-user-detail modal-action">
						<h3 className="modal-title">
							{actionType === "block" ? "Block User" : "Unblock User"} Request
						</h3>

						<div className="modal-field">
							<label className="modal-label">Checker*</label>
							<select
								className="modal-select-user-detail"
								value={selectedChecker}
								onChange={(e) => setSelectedChecker(e.target.value)}
							>
								<option value="">Select Checker</option>
								{checkers.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name} ({c.id})
									</option>
								))}
							</select>
						</div>

						<div className="modal-field">
							<label className="modal-label">Reason*</label>
							<textarea
								className="modal-textarea-user-detail"
								rows={5}
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="Type reason..."
							/>
						</div>

						<span className="modal-required-user-detail">*required</span>

						<div className="modal-actions">
							<button className="modal-btn modal-btn-cancel" onClick={cancelAction}>
								Cancel
							</button>

							<button
								className={`modal-btn modal-btn-user-detail-submit ${!isFormValid ? "disabled" : ""
									}`}
								disabled={!isFormValid}
								onClick={handleSubmitAction}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

			{showSuccessModal && lastActivity && (
				<div className="modal-overlay">
					<div className="modal-content-user-detail modal-success">
						<h3 className="modal-title">Activity Created</h3>

						<p className="modal-subtitle-user-detail">
							Created at <strong>{lastActivity.createdTimeDisplay}</strong>
						</p>

						<div className="activity-summary-card">
							<div className="activity-row">
								<span className="activity-label">Activity ID</span>
								<span className="activity-value">: {lastActivity.activityId}</span>
							</div>

							<div className="activity-row">
								<span className="activity-label">Action Menu</span>
								<span className="activity-value">: {lastActivity.actionMenu}</span>
							</div>

							<div className="activity-row">
								<span className="activity-label">Checker</span>
								<span className="activity-value">: {lastActivity.checkerId}</span>
							</div>
						</div>

						<div className="modal-actions">
							<button
								className="modal-btn modal-btn-user-detail-close"
								onClick={handleSuccessClose}
							>
								Close
							</button>

							<button
								className="modal-btn modal-btn-user-detail-view"
								onClick={handleSuccessViewActivity}
							>
								View Activity List
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}