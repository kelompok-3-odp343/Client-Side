import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import Swal from "sweetalert2";

import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-user-detail.css";

import { fetchAdminUserDetail } from "../service/adminUserDetailService";
import { fetchAdminBlock, fetchAdminUnBlock, fetchApproverList } from "../service/adminUsersService";

export default function AdminUserDetail() {
	const location = useLocation();
	const navigate = useNavigate();
	const userId = location.state?.userId || null;

	const blockRule = sessionStorage.getItem("user_block_action_flow");
	const unblockRule = sessionStorage.getItem("user_unblock_action_flow");

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
	const [checkers, setCheckers] = useState([]);

	useEffect(() => {
		console.log('test', sessionStorage.getItem("user_block_menu_id"));

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

				const list = await fetchApproverList("CHECKER");
				setCheckers(list);
			} catch (err) {
				setError("Failed to fetch user detail");
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [userId]);

	const isBlocked = userData?.blocked;

	const confirmDirectAction = async (type) => {
		const label = type === "block" ? "Block" : "Unblock";

		const result = await Swal.fire({
			title: `${label} User?`,
			text: `Are you sure to ${label.toLowerCase()} ${userData.customerName}?`,
			icon: "warning",
			showCancelButton: true
		});

		if (!result.isConfirmed) return;

		const menuData = {
			menuId: type === "block"
				? sessionStorage.getItem("user_block_menu_id")
				: sessionStorage.getItem("user_unblock_menu_id"),
			menuName: "USER_MANAGEMENT",
			menuAction: type === "block" ? "BLOCK_USER" : "UNBLOCK_USER",
			actionFlow: "NO_APPROVER"
		};

		const payload = {
			userData: {
				userId: userData.userId,
			},
			reason: `Direct ${label.toLowerCase()} (NO_APPROVER rule)`,
			checkerData: null,
			menuData,
			approverData: {}
		};

		const apiCall = type === "block" ? fetchAdminBlock : fetchAdminUnBlock;
		const resp = await apiCall(payload);

		if (resp?.ok) {
			Swal.fire(`${label}ed!`, `User successfully ${label.toLowerCase()}ed.`, "success");
			window.location.reload();
		} else {
			Swal.fire("Failed", `${label} user failed.`, "error");
		}
	};


	const handleBlock = () => {
		if (blockRule === "NO_APPROVER") return confirmDirectAction("block");

		if (blockRule === "CHECKER_AND_APPROVER") {
			setActionType("block");
			return setShowActionModal(true);
		}

		if (blockRule === "APPROVER_ONLY") {
			return Swal.fire("Unauthorized", "You are not allowed to block this user.", "warning");
		}
	};

	const handleUnblock = () => {
		if (unblockRule === "NO_APPROVER") return confirmDirectAction("unblock");

		if (unblockRule === "CHECKER_AND_APPROVER") {
			setActionType("unblock");
			return setShowActionModal(true);
		}

		if (unblockRule === "APPROVER_ONLY") {
			return Swal.fire("Unauthorized", "You are not allowed to unblock this user.", "warning");
		}
	};

	const isFormValid = selectedChecker && reason.trim();

	const handleSubmitAction = async () => {
		if (!isFormValid) return;

		const selectedCheckerObj = checkers.find(c => c.userId === selectedChecker);
		console.log('checker', selectedCheckerObj);


		const checkerData = {
			npp: selectedCheckerObj.npp,
			fullName: selectedCheckerObj.fullName,
			userId: selectedCheckerObj.userId
		};

		const menuData = {
			menuId: actionType === "block"
				? sessionStorage.getItem("user_block_menu_id")
				: sessionStorage.getItem("user_unblock_menu_id"),
			menuName: "USER_MANAGEMENT",
			menuAction: actionType === "block" ? "BLOCK_USER" : "UNBLOCK_USER",
			actionFlow: actionType === "block"
				? sessionStorage.getItem("user_block_action_flow")
				: sessionStorage.getItem("user_unblock_action_flow")
		};

		const payload = {
			userData: {
				userId: userData.userId,
			},
			reason,
			checkerData,
			menuData,
			approverData: {}
		};

		const apiCall = actionType === "block" ? fetchAdminBlock : fetchAdminUnBlock;
		const resp = await apiCall(payload);

		if (resp?.ok) {
			setShowActionModal(false);
			setShowSuccessModal(true);
		} else {
			Swal.fire("Failed", `Failed to ${actionType} user`, "error");
		}
	};

	const handleSuccessClose = () => {
		setShowSuccessModal(false);
		setSelectedChecker("");
		setReason("");
	};

	const handleSuccessViewActivity = () => navigate("/admin/activity");

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
				{/* Header */}
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

				{/* Accounts */}
				<div className="accounts-grid">
					{accounts.map((acc, i) => (
						<div key={i} className="account-card" style={{ background: getCardColor(i) }}>
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

			{/* Modal Action */}
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
									<option key={c.userId} value={c.userId}>
										{c.displayName}
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
								className={`modal-btn modal-btn-user-detail-submit ${!isFormValid ? "disabled" : ""}`}
								disabled={!isFormValid}
								onClick={handleSubmitAction}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Success modal */}
			{showSuccessModal && (
				<div className="modal-overlay">
					<div className="modal-content-user-detail modal-success">
						<h3 className="modal-title">Success</h3>

						<p className="modal-subtitle-user-detail">
							User has been successfully {actionType === "block" ? "blocked" : "unblocked"}.
						</p>

						<div className="modal-actions">
							<button
								className="modal-btn modal-btn-user-detail-close"
								onClick={handleSuccessClose}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
