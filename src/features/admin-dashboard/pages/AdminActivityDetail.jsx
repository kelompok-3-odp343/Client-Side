import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import "../styles/admin-activity-detail.css";

export default function AdminActivityDetail() {
	const location = useLocation();
	const { id } = useParams();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Modals and form state
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [rejectNotes, setRejectNotes] = useState("");
	const [selectedApprover, setSelectedApprover] = useState("");

	// Activity data state
	const [activityData, setActivityData] = useState(null);

	// Get current user role from sessionStorage (fallback to 'maker')
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
				data: "P001",
				customerName: "Ulion Pardede",
				cif: "1234567890",
				status: "Pending Check",
				createdBy: "ADM001",
				createdAt: "2025-11-01 10:00:00 by Della Puspita (ADM001)",
				checkedBy: "",
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
		// We intentionally include location.state and id
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
		// If checker, they choose approver then submit
		if (currentUserRole === "checker") {
			setShowApproveModal(true);
			return;
		}
		// If approver, confirm final approval
		if (currentUserRole === "approver") {
			const confirmed = window.confirm("Are you sure you want to approve this request?");
			if (confirmed) confirmApproval();
		}
	};

	const confirmRejection = () => {
		if (!rejectNotes.trim()) {
			alert("Please provide rejection notes");
			return;
		}

		// Prepare admin info
		const now = new Date();
		const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
		const adminName = sessionStorage.getItem('adminName') || 'Admin User';
		const storedAdminId = sessionStorage.getItem('adminId');
		const adminId = storedAdminId ? storedAdminId : (currentUserRole === 'checker' ? 'ADM002' : 'ADM003');

		// Update activity in sessionStorage
		const stored = sessionStorage.getItem('activities');
		if (stored) {
			try {
				const activities = JSON.parse(stored);
				const index = activities.findIndex(a => a.activityId === activityData.activityId);
				
				if (index !== -1) {
					activities[index] = {
						...activities[index],
						status: "Rejected",
						rejectionNotes: rejectNotes,
						checkedAt: currentUserRole === 'checker' ? `${dateStr} by ${adminName} (${adminId})` : activities[index].checkedAt,
						approvedAt: currentUserRole === 'approver' ? `${dateStr} by ${adminName} (${adminId})` : activities[index].approvedAt,
					};
					
					sessionStorage.setItem('activities', JSON.stringify(activities));
					
					// Update local state
					setActivityData(activities[index]);
				}
			} catch (e) {
				console.error('Error updating activity:', e);
			}
		} else {
			// If no stored activities, create one with Rejected status (edge case)
			const newActivity = {
				...activityData,
				status: "Rejected",
				rejectionNotes: rejectNotes,
				checkedAt: currentUserRole === 'checker' ? `${dateStr} by ${adminName} (${adminId})` : "",
				approvedAt: currentUserRole === 'approver' ? `${dateStr} by ${adminName} (${adminId})` : "",
			};
			sessionStorage.setItem('activities', JSON.stringify([newActivity]));
			setActivityData(newActivity);
		}

		setShowRejectModal(false);
		setRejectNotes("");

		// Trigger refresh event
		window.dispatchEvent(new Event("activityStatusChanged"));
		
		alert("Activity has been rejected");
	};

	const confirmCheckerApproval = () => {
		if (!selectedApprover) {
			alert("Please select an approver");
			return;
		}

		const now = new Date();
		const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
		const adminName = sessionStorage.getItem('adminName') || 'Khairuddin Nasty';
		const adminId = sessionStorage.getItem('adminId') || 'ADM002';

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
				}
			} catch (e) {
				console.error('Error updating activity:', e);
			}
		} else {
			const newActivity = {
				...activityData,
				status: "Pending Approval",
				approverId: selectedApprover,
				checkedAt: `${dateStr} by ${adminName} (${adminId})`,
			};
			sessionStorage.setItem('activities', JSON.stringify([newActivity]));
			setActivityData(newActivity);
		}

		setShowApproveModal(false);
		setSelectedApprover("");

		// Trigger refresh event
		window.dispatchEvent(new Event("activityStatusChanged"));
		
		alert("Activity has been approved and sent to approver");
	};

	const confirmApproval = () => {
		const now = new Date();
		const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
		const adminName = sessionStorage.getItem('adminName') || 'Wira Natanael Uli';
		const adminId = sessionStorage.getItem('adminId') || 'ADM003';

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
					
					// Unblock user in userStatuses
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
						statuses[activityData.cif] = "Active";
						sessionStorage.setItem("userStatuses", JSON.stringify(statuses));
					}

					// Trigger refresh events
					window.dispatchEvent(new Event("userStatusChanged"));
					window.dispatchEvent(new Event("activityStatusChanged"));

					// Show success message
					alert("Activity has been approved. Account has been unblocked successfully!");
				}
			} catch (e) {
				console.error('Error updating activity:', e);
			}
		} else {
			// Edge case: no activities array present
			const newActivity = {
				...activityData,
				status: "Approved",
				approvedAt: `${dateStr} by ${adminName} (${adminId})`,
				approvedBy: adminId,
			};
			sessionStorage.setItem('activities', JSON.stringify([newActivity]));
			setActivityData(newActivity);

			// update userStatuses
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
				statuses[activityData.cif] = "Active";
				sessionStorage.setItem("userStatuses", JSON.stringify(statuses));
			}

			window.dispatchEvent(new Event("userStatusChanged"));
			window.dispatchEvent(new Event("activityStatusChanged"));

			alert("Activity has been approved. Account has been unblocked successfully!");
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

	// Determine workflow step based on status - safe guards
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

	// Determine if current user can take action
	const canReject = () => {
		if (!activityData || !activityData.status) return false;
		if (activityData.status === "Approved" || activityData.status === "Rejected") {
			return false;
		}
		if (currentUserRole === "checker" && activityData.status === "Pending Check") {
			return true;
		}
		if (currentUserRole === "approver" && activityData.status === "Pending Approval") {
			return true;
		}
		return false;
	};

	const canApprove = () => {
		if (!activityData || !activityData.status) return false;
		if (activityData.status === "Approved" || activityData.status === "Rejected") {
			return false;
		}
		if (currentUserRole === "checker" && activityData.status === "Pending Check") {
			return true;
		}
		if (currentUserRole === "approver" && activityData.status === "Pending Approval") {
			return true;
		}
		return false;
	};

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-activity-detail-main">
				<div className="activity-detail-header">
					<h2>User Management</h2>
					<p className="activity-action">Action: Unblock User</p>
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
							<span className="activity-label">Status</span>
							<span className="activity-value">: {activityData.status}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Created by</span>
							<span className="activity-value">: {activityData.createdBy}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Created At</span>
							<span className="activity-value">: {activityData.createdAt}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Checked by</span>
							<span className="activity-value">: {activityData.checkedBy || "-"}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Checked At</span>
							<span className="activity-value">: {activityData.checkedAt || "-"}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Approved by</span>
							<span className="activity-value">: {activityData.approvedBy || "-"}</span>
						</div>
						<div className="activity-detail-row">
							<span className="activity-label">Approved At</span>
							<span className="activity-value">: {activityData.approvedAt || "-"}</span>
						</div>
						<div className="activity-detail-row activity-detail-row-full">
							<span className="activity-label">Reason</span>
							<span className="activity-value">: {activityData.reason}</span>
						</div>
					</div>

					{/* Workflow Timeline */}
					<div className="workflow-timeline">
						<div className={`workflow-step ${workflowStep >= 1 ? "completed" : ""} ${workflowStep === 1 ? "current" : ""}`}>
							<div className="workflow-circle"></div>
							<div className="workflow-info">
								<div className="workflow-title">
									{activityData.status === "Rejected" ? "Rejected" : workflowStep === 1 && activityData.status === "Pending Check" ? "Pending Check" : "Created at " + (activityData.createdAt ? activityData.createdAt.split(" by ")[0] : "")}
								</div>
								<div className="workflow-subtitle">
									{activityData.createdAt}
								</div>
							</div>
						</div>

						{activityData.status !== "Rejected" && (
							<>
								<div className={`workflow-step ${workflowStep >= 2 ? "completed" : ""} ${workflowStep === 2 ? "current" : ""}`}>
									<div className="workflow-circle"></div>
									<div className="workflow-info">
										<div className="workflow-title">
											{workflowStep === 2 && activityData.status === "Pending Approval" ? "Pending approval" : workflowStep >= 2 ? "Checked at " + (activityData.checkedAt ? activityData.checkedAt.split(" by ")[0] : "") : "Pending Check"}
										</div>
										{workflowStep >= 2 && (
											<div className="workflow-subtitle">
												{activityData.checkedAt || "-"}
											</div>
										)}
									</div>
								</div>

								<div className={`workflow-step ${workflowStep >= 3 ? "completed" : ""}`}>
									<div className="workflow-circle"></div>
									<div className="workflow-info">
										<div className="workflow-title">
											{workflowStep >= 3 ? "Approved at " + (activityData.approvedAt ? activityData.approvedAt.split(" by ")[0] : "") : "Pending approval"}
										</div>
										{workflowStep >= 3 && (
											<div className="workflow-subtitle">
												{activityData.approvedAt || "-"}
											</div>
										)}
									</div>
								</div>
							</>
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
							<button className="modal-btn modal-btn-submit" onClick={confirmRejection}>
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
							<button className="modal-btn modal-btn-submit" onClick={confirmCheckerApproval}>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}