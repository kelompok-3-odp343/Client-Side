import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-activity-detail.css";

export default function AdminActivityDetail() {
	const location = useLocation();
	const { id } = useParams();
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Modals and form state
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [successDetails, setSuccessDetails] = useState(null);
	const [rejectNotes, setRejectNotes] = useState("");
	const [selectedApprover, setSelectedApprover] = useState("");

	// Activity data state
	const [activityData, setActivityData] = useState(null);

	// Get current user role from sessionStorage - for demo, allow all roles
	// In production, this should be strictly from backend authentication
	const currentUserRole = sessionStorage.getItem("userRole") || "maker"; // maker, checker, approver

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Load activity data from either location.state or sessionStorage
	useEffect(() => {
		let mounted = true;

		const loadActivity = () => {
			// Prioritize route state
			if (location.state && location.state.activity) {
				if (mounted) setActivityData(location.state.activity);
				return;
			}

			// Try sessionStorage
			const stored = sessionStorage.getItem('activities');
			if (stored) {
				try {
					const activities = JSON.parse(stored);
					const found = activities.find(a => a.activityId === id);
					if (found) {
						if (mounted) setActivityData(found);
						return;
					}
				} catch (e) {
					console.error('Error loading activity:', e);
				}
			}

			// Fallback inline dummy if not found
			const fallback = {
				activityId: id || "ACK000001",
				actionType: "unblock",
				data: "P001",
				customerName: "Ulion Pardede",
				cif: "1234567890",
				status: "Pending Check",
				createdBy: "ADM001",
				createdAt: "2025-11-01 10:00:00 by Della Puspita (ADM001)",
				checkedBy: "ADM002",
				checkedAt: "",
				approvedBy: "",
				approvedAt: "",
				reason: "System automatically blocked the user due to multiple failed login attempts.",
				rejectionNotes: "-",
			};
			if (mounted) setActivityData(fallback);
		};

		loadActivity();

		return () => {
			mounted = false;
		};
	}, [id, location.state]);

	// Approvers used in checker's approve modal
	const approvers = [
		{ id: "ADM003", name: "Wira Natanael Uli" },
		{ id: "ADM005", name: "Approver 2" },
	];

	// Actions: Reject / Approve flows
	const handleReject = () => {
		setShowRejectModal(true);
	};

	const handleApprove = () => {
		// Check current status to determine role
		if (activityData.status === "Pending Check") {
			// Checker stage - need to choose approver
			setShowApproveModal(true);
			return;
		}
		if (activityData.status === "Pending Approval") {
			// Approver stage - direct approval
			confirmApproval();
		}
	};

	const buildSuccessDetails = (activity, label, timestamp) => {
		if (!activity) return null;

		const actionMenu =
			activity.actionMenu ||
			(activity.actionType === "block" ? "Block User" : "Unblock User");

		return {
			timestampLabel: label,          // "Checked at" / "Approved at" / "Rejected at"
			timestamp,
			activityId: activity.activityId || "-",
			menu: activity.menu || "User Management",
			actionMenu,
		};
	};

	const confirmRejection = () => {
		if (!rejectNotes.trim()) {
			alert("Please provide rejection notes");
			return;
		}

		const now = new Date();
		const dateStr = now.toISOString().replace("T", " ").substring(0, 19);
		const displayTime = now.toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});

		const adminName = sessionStorage.getItem("adminName") || "Admin User";
		const storedAdminId = sessionStorage.getItem("adminId");
		const adminId = storedAdminId
			? storedAdminId
			: currentUserRole === "checker"
			? "ADM002"
			: "ADM003";

		let updatedActivity = activityData;

		const stored = sessionStorage.getItem("activities");
		if (stored) {
			try {
				const activities = JSON.parse(stored);
				const index = activities.findIndex(
					(a) => a.activityId === activityData.activityId
				);

				if (index !== -1) {
					activities[index] = {
						...activities[index],
						status: "Rejected",
						rejectionNotes: rejectNotes,
						checkedAt:
							currentUserRole === "checker"
								? `${dateStr} by ${adminName} (${adminId})`
								: activities[index].checkedAt,
						approvedAt:
							currentUserRole === "approver"
								? `${dateStr} by ${adminName} (${adminId})`
								: activities[index].approvedAt,
					};

					sessionStorage.setItem("activities", JSON.stringify(activities));

					setActivityData(activities[index]);
					updatedActivity = activities[index];
				}
			} catch (e) {
				console.error("Error updating activity:", e);
			}
		}

		setShowRejectModal(false);
		setRejectNotes("");

		const actionType = updatedActivity?.actionType === "block" ? "Block User" : "Unblock User";

		setSuccessMessage("Activity Rejected");
		setSuccessDetails(
			buildSuccessDetails(
				{ ...updatedActivity, actionMenu: updatedActivity?.actionMenu || actionType },
				"Rejected at",
				<strong>{displayTime}</strong>
			)
		);
		setShowSuccessModal(true);

		// Trigger refresh event
		window.dispatchEvent(new Event("activityStatusChanged"));
	};

	const confirmCheckerApproval = () => {
		if (!selectedApprover) {
			alert("Please select an approver");
			return;
		}

		const now = new Date();
		const dateStr = now.toISOString().replace("T", " ").substring(0, 19);
		const displayTime = now.toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});
		const adminName = sessionStorage.getItem("adminName") || "Khairuddin Nasty";
		const adminId = sessionStorage.getItem("adminId") || "ADM002";

		let updatedActivity = activityData;

		const stored = sessionStorage.getItem('activities');
		if (stored) {
			try {
				const activities = JSON.parse(stored);
				const index = activities.findIndex(a => a.activityId === activityData.activityId);
				
				if (index !== -1) {
					activities[index] = {
						...activities[index],
						status: "Pending Approval",
						approverId: selectedApprover,
						checkedAt: `${dateStr} by ${adminName} (${adminId})`,
					};
					
					sessionStorage.setItem('activities', JSON.stringify(activities));
					
					// Update local state
					setActivityData(activities[index]);
					updatedActivity = activities[index];
				}
			} catch (e) {
				console.error('Error updating activity:', e);
			}
		}

		setShowApproveModal(false);
		setSelectedApprover("");

		// Success modal general (Checked)
		const actionType = updatedActivity?.actionType === "block" ? "Block User" : "Unblock User";

		setSuccessMessage("Activity Checked");
		setSuccessDetails(
			buildSuccessDetails(
				{ ...updatedActivity, actionMenu: updatedActivity?.actionMenu || actionType },
				"Checked at",
				<strong>{displayTime}</strong>
			)
		);
		setShowSuccessModal(true);

		// Trigger refresh event
		window.dispatchEvent(new Event("activityStatusChanged"));
	};

	const confirmApproval = () => {
		const now = new Date();
		const dateStr = now.toISOString().replace("T", " ").substring(0, 19);
		const displayTime = now.toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});
		const adminName = sessionStorage.getItem("adminName") || "Wira Natanael Uli";
		const adminId = sessionStorage.getItem("adminId") || "ADM003";

		const stored = sessionStorage.getItem('activities');
		if (stored) {
			try {
				const activities = JSON.parse(stored);
				const index = activities.findIndex(a => a.activityId === activityData.activityId);
				
				if (index !== -1) {
					activities[index] = {
						...activities[index],
						status: "Approved",
						approvedAt: `${dateStr} by ${adminName} (${adminId})`,
						approvedBy: adminId,
					};
					
					sessionStorage.setItem('activities', JSON.stringify(activities));
					
					// Update local state
					setActivityData(activities[index]);
					
					// Update user status based on action type
					const savedStatuses = sessionStorage.getItem("userStatuses");
					let statuses = {};
					if (savedStatuses) {
						try {
							statuses = JSON.parse(savedStatuses);
						} catch (e) {
							console.error("Error parsing user statuses:", e);
						}
					}
					
					if (activityData && activityData.cif) {
						// If action was "unblock", set to Active; if "block", set to Blocked
						const actionType = activities[index].actionType || "unblock";
						statuses[activityData.cif] = actionType === "unblock" ? "Active" : "Blocked";
						sessionStorage.setItem("userStatuses", JSON.stringify(statuses));
					}

					// Trigger refresh events
					window.dispatchEvent(new Event("userStatusChanged"));
					window.dispatchEvent(new Event("activityStatusChanged"));

					// Show success modal
					const actionType = activities[index].actionType || "unblock";
					const actionMenu = actionType === "block" ? "Block User" : "Unblock User";

					setSuccessMessage("Activity Approved");
					setSuccessDetails(
						buildSuccessDetails(
							{ ...activities[index], actionMenu },
							"Approved at",
							<strong>{displayTime}</strong>
						)
					);
					setShowSuccessModal(true);
				}
			} catch (e) {
				console.error('Error updating activity:', e);
			}
		}
	};

	const cancelReject = () => {
		setShowRejectModal(false);
		setRejectNotes("");
	};

	const cancelApprove = () => {
		setShowApproveModal(false);
		setSelectedApprover("");
	};

	const closeSuccess = () => {
		setShowSuccessModal(false);
		setSuccessMessage("");
		setSuccessDetails(null);
	};

	// Determine workflow step based on status
	const getWorkflowStep = () => {
		if (!activityData || !activityData.status) return 0;
		switch (String(activityData.status)) {
			case "Pending Check":
				return 1;
			case "Pending Approval":
				return 2;
			case "Approved":
				return 3;
			case "Rejected":
				return 0;
			default:
				return 1;
		}
	};

	// Show loading if data not loaded yet
	if (!activityData) {
		return (
			<div className="admin-container">
				<AdminNavBar onMenuToggle={toggleSidebar} />
				<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
				<main className="admin-activity-detail-main">
					<div className="loading-state">Loading activity details...</div>
				</main>
			</div>
		);
	}

	const workflowStep = getWorkflowStep();

	const parseTimelineInfo = (raw) => {
		if (!raw) return { dateTime: "-", actor: "" };

		const [datePartRaw, actor] = raw.split(" by ");
		let dateTime = datePartRaw;

		if (/^\d{4}-\d{2}-\d{2}/.test(datePartRaw)) {
			const [date, time] = datePartRaw.split(" ");
			const [year, month, day] = date.split("-").map(Number);
			const [hour = 0, minute = 0] = (time || "").split(":").map(Number);

			const d = new Date(year, month - 1, day, hour, minute);

			dateTime = d.toLocaleString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
		}

		return { dateTime, actor };
	};

	const createdInfo = parseTimelineInfo(activityData.createdAt);
	const checkedInfo = parseTimelineInfo(activityData.checkedAt);
	const approvedInfo = parseTimelineInfo(activityData.approvedAt);
	const rejectedInfo = parseTimelineInfo(activityData.checkedAt || activityData.approvedAt);

	// Determine if current user can take action
	const canReject = () => {
		if (!activityData || !activityData.status) return false;
		const status = activityData.status;
		
		// Can't change if already final state
		if (status === "Approved" || status === "Rejected") {
			return false;
		}
		
		// Can reject at any pending stage
		return status === "Pending Check" || status === "Pending Approval";
	};

	const canApprove = () => {
		if (!activityData || !activityData.status) return false;
		const status = activityData.status;
		
		// Can't change if already final state
		if (status === "Approved" || status === "Rejected") {
			return false;
		}
		
		// Can approve at any pending stage
		return status === "Pending Check" || status === "Pending Approval";
	};

	const isRejectFormValid = rejectNotes.trim();
	const isApproveFormValid = selectedApprover;

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-activity-detail-main">
				<div className="activity-detail-header">
					<h2>User Management</h2>
					<p className="activity-action">
						Action: {activityData.actionType === "block" ? "Block" : "Unblock"} User
					</p>
				</div>

				<div className="activity-detail-card">
					<div className="activity-detail-grid">
						<div className="activity-detail-row">
							<span className="activity-label">Activity ID</span>
							<span className="activity-value">: {activityData.activityId}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Data</span>
							<span className="activity-value">: {activityData.data}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Customer Name</span>
							<span className="activity-value">: {activityData.customerName}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">CIF</span>
							<span className="activity-value">: {activityData.cif}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Reason</span>
							<span className="activity-value">: {activityData.reason}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Rejection Notes</span>
							<span className="activity-value">: {activityData.rejectionNotes}</span>
						</div>
					</div>

					{/* Workflow Timeline */}
					<div className="workflow-timeline">
						<div className={`workflow-step ${workflowStep >= 1 || activityData.status === "Rejected" ? "completed" : ""}`}>
							<div className="workflow-circle"></div>
							<div className="workflow-info">
								<div className="workflow-title">Created</div>
								<div className="workflow-subtitle">
									{createdInfo.dateTime}
									{createdInfo.actor && (
										<>
											<br />
											{createdInfo.actor}
										</>
									)}
								</div>
							</div>
						</div>

						{activityData.status !== "Rejected" ? (
							<>
								<div className={`workflow-step ${workflowStep >= 2 ? "completed" : ""} ${workflowStep === 1 ? "current" : ""}`}>
									<div className="workflow-circle"></div>
									<div className="workflow-info">
										<div className="workflow-title">
											{workflowStep === 1 ? "Pending Check" : workflowStep >= 2 ? "Checked" : "Pending Check"}
										</div>
										{workflowStep >= 2 && (
											<div className="workflow-subtitle">
												{checkedInfo.dateTime}
												{checkedInfo.actor && (
													<>
														<br />
														{checkedInfo.actor}
													</>
												)}
											</div>
										)}
									</div>
								</div>

								<div className={`workflow-step ${workflowStep >= 3 ? "completed" : ""} ${workflowStep === 2 ? "current" : ""}`}>
									<div className="workflow-circle"></div>
									<div className="workflow-info">
										<div className="workflow-title">
											{workflowStep === 2 ? "Pending Approval" : workflowStep >= 3 ? "Approved" : "Pending Approval"}
										</div>
										{workflowStep >= 3 && (
											<div className="workflow-subtitle">
												{approvedInfo.dateTime}
												{approvedInfo.actor && (
													<>
														<br />
														{approvedInfo.actor}
													</>
												)}
											</div>
										)}
									</div>
								</div>
							</>
						) : (
							<div className="workflow-step completed">
								<div className="workflow-circle"></div>
								<div className="workflow-info">
									<div className="workflow-title">Rejected</div>
									<div className="workflow-subtitle">
										{rejectedInfo.dateTime}
										{rejectedInfo.actor && (
											<>
												<br />
												{rejectedInfo.actor}
											</>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="activity-actions">
					<button
						className={`activity-btn activity-btn-reject ${!canReject() ? "disabled" : ""}`}
						onClick={handleReject}
						disabled={!canReject()}
					>
						Reject
					</button>
					<button
						className={`activity-btn activity-btn-approve ${!canApprove() ? "disabled" : ""}`}
						onClick={handleApprove}
						disabled={!canApprove()}
					>
						Approve
					</button>
				</div>
			</main>

			{/* Reject Modal */}
			{showRejectModal && (
				<div className="modal-overlay">
					<div className="modal-content modal-reject">
						<h3 className="modal-title">Rejection Notes*</h3>
						<textarea
							className="modal-textarea"
							placeholder="Type here ..."
							value={rejectNotes}
							onChange={(e) => setRejectNotes(e.target.value)}
							rows={5}
						/>
						<span className="modal-required">*required</span>
						<div className="modal-actions">
							<button className="modal-btn modal-btn-cancel" onClick={cancelReject}>
								Cancel
							</button>
							<button 
								className={`modal-btn modal-btn-submit ${!isRejectFormValid ? 'disabled' : ''}`}
								onClick={confirmRejection}
								disabled={!isRejectFormValid}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Approve Modal (for Checker) */}
			{showApproveModal && (
				<div className="modal-overlay">
					<div className="modal-content modal-approve">
						<h3 className="modal-title">Approver*</h3>
						<select
							className="modal-select"
							value={selectedApprover}
							onChange={(e) => setSelectedApprover(e.target.value)}
						>
							<option value="">Choose an approver</option>
							{approvers.map((approver) => (
								<option key={approver.id} value={approver.id}>
									{approver.name} ({approver.id})
								</option>
							))}
						</select>
						<span className="modal-required">*required</span>
						<div className="modal-actions">
							<button className="modal-btn modal-btn-cancel" onClick={cancelApprove}>
								Cancel
							</button>
							<button 
								className={`modal-btn modal-btn-submit ${!isApproveFormValid ? 'disabled' : ''}`}
								onClick={confirmCheckerApproval}
								disabled={!isApproveFormValid}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Success Modal */}
			{showSuccessModal && (
				<div className="modal-overlay">
					<div className="modal-content modal-success">
						<h3 className="modal-title">{successMessage}</h3>

						{successDetails && (
							<>
								<p className="modal-subtitle">
									{successDetails.timestampLabel} {successDetails.timestamp}
								</p>

								<div className="activity-summary-card">
									<div className="activity-row">
										<span className="activity-label">Activity ID</span>
										<span className="activity-value">
											: {successDetails.activityId}
										</span>
									</div>
									<div className="activity-row">
										<span className="activity-label">Menu</span>
										<span className="activity-value">: {successDetails.menu}</span>
									</div>
									<div className="activity-row">
										<span className="activity-label">Action Menu</span>
										<span className="activity-value">
											: {successDetails.actionMenu}
										</span>
									</div>
								</div>
							</>
						)}

						<div className="modal-actions">
							<button className="modal-btn modal-btn-close" onClick={closeSuccess}>
								Close
							</button>
							{successDetails && (
								<button
									className="modal-btn modal-btn-view"
									onClick={() => {
										closeSuccess();
										navigate("/admin/activity");
									}}
								>
									View Activity List
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}