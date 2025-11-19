import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import AdminSideBar from "../components/AdminSideBar";
import Swal from "sweetalert2";

import { fetchAdminActivityDetail, postAdminApproval } from "../service/adminActivityService";

import "../styles/admin-activity-detail.css";

export default function AdminActivityDetail() {
	const location = useLocation();
	const navigate = useNavigate();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [successDetails, setSuccessDetails] = useState(null);
	const [rejectNotes, setRejectNotes] = useState("");
	const [selectedApprover, setSelectedApprover] = useState("");

	const [activityData, setActivityData] = useState(null);

	const currentUserRole = sessionStorage.getItem("role") || "MAKER";

	useEffect(() => {
		let mounted = true;
		const passedId = location.state?.activityId;

		if (!passedId) {
			navigate("/admin/activity");
			return;
		}

		const load = async () => {
			const result = await fetchAdminActivityDetail(passedId);
			if (mounted) setActivityData(result);
		};

		load();
		return () => (mounted = false);
	}, [location.state]);

	const approvers = [
		{ id: "ADM003", name: "Wira Natanael Uli", npp: "64888" },
		{ id: "ADM005", name: "Approver 2", npp: "64877" }
	];

	const handleApprove = () => {
		if (activityData.status === "PENDING_CHECKER") {
			setShowApproveModal(true);
			return;
		}
		if (activityData.status === "PENDING_APPROVER") {
			confirmFinalApproval();
		}
	};

	const confirmCheckerApproval = async () => {
		if (!selectedApprover) {
			Swal.fire("Warning", "Please select an approver", "warning");
			return;
		}

		const selected = approvers.find(a => a.id === selectedApprover);

		const payload = {
			activityId: activityData.activityId,
			isApprove: true,
			approverData: {
				userId: selected.id,
				npp: selected.npp,
				fullName: selected.name
			}
		};

		setShowApproveModal(false);

		const resp = await postAdminApproval(payload);

		if (resp.ok) {
			const timestamp = new Date(resp.data.updatedTime).toLocaleString("en-GB");

			setSuccessMessage("Activity Checked");
			setSuccessDetails({
				timestampLabel: "Checked at",
				timestamp,
				activityId: activityData.activityId,
				menu: activityData.menu,
				actionMenu: activityData.menu_action
			});
			setShowSuccessModal(true);
		} else {
			Swal.fire("Error", "Failed to submit checking", "error");
		}
	};

	const confirmFinalApproval = async () => {
		const payload = {
			activityId: activityData.activityId,
			isApprove: true,
			approverData: {}
		};

		const resp = await postAdminApproval(payload);

		if (resp.ok) {
			const timestamp = new Date(resp.data.updatedTime).toLocaleString("en-GB");

			setSuccessMessage("Activity Approved");
			setSuccessDetails({
				timestampLabel: "Approved at",
				timestamp,
				activityId: activityData.activityId,
				menu: activityData.menu,
				actionMenu: activityData.menu_action
			});
			setShowSuccessModal(true);
		} else {
			Swal.fire("Error", "Approval failed", "error");
		}
	};

	const handleReject = () => setShowRejectModal(true);

	const confirmRejection = () => {
		if (!rejectNotes.trim()) {
			alert("Please provide rejection notes");
			return;
		}

		const now = new Date();
		const displayTime = now.toLocaleString("en-GB");

		setShowRejectModal(false);

		setSuccessMessage("Activity Rejected");
		setSuccessDetails({
			timestampLabel: "Rejected at",
			timestamp: displayTime,
			activityId: activityData.activityId,
			menu: activityData.menu,
			actionMenu: activityData.menu_action
		});
		setShowSuccessModal(true);
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

	const getWorkflowStep = () => {
		if (!activityData) return 0;
		switch (activityData.status) {
			case "PENDING_CHECKER": return 1;
			case "PENDING_APPROVER": return 2;
			case "APPROVED": return 3;
			case "REJECTED": return 0;
			default: return 1;
		}
	};

	const workflowStep = getWorkflowStep();

	const parseTimelineInfo = (raw) => {
		if (!raw) return { dateTime: "-", actor: "" };
		const d = new Date(raw.replace("TZ", "Z"));
		if (!isNaN(d.getTime())) {
			return {
				dateTime: d.toLocaleString("en-GB", {
					day: "numeric",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}),
				actor: "",
			};
		}
		return { dateTime: raw, actor: "" };
	};

	const createdInfo = parseTimelineInfo(activityData?.created_time);
	const checkedInfo = parseTimelineInfo(activityData?.checker_updated_time);
	const approvedInfo = parseTimelineInfo(activityData?.approver_updated_time);
	const rejectedInfo = parseTimelineInfo(activityData?.checker_updated_time);

	const canReject = () =>
		activityData.status === "PENDING_CHECKER" ||
		activityData.status === "PENDING_APPROVER";

	const canApprove = () =>
		activityData.status === "PENDING_CHECKER" ||
		activityData.status === "PENDING_APPROVER";

	if (!activityData) {
		return (
			<div className="admin-container">
				<AdminNavBar onMenuToggle={toggleSidebar} />
				<AdminSideBar isOpen={isSidebarOpen} />
				<main className="admin-activity-detail-main">
					<div className="loading-state">Loading activity details...</div>
				</main>
			</div>
		);
	}

	return (
		<div className="admin-container">
			<AdminNavBar onMenuToggle={toggleSidebar} />
			<AdminSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<main className="admin-activity-detail-main">
				<div className="activity-detail-header">
					<h2>{activityData.menu?.replace("_", " ")}</h2>
					<p className="activity-action">
						Action: {activityData.menu_action?.replace("_", " ")}
					</p>
				</div>

				<div className="activity-detail-card">
					<div className="activity-detail-grid">

						<div className="activity-detail-row">
							<span className="activity-label">Activity ID</span>
							<span className="activity-value">: {activityData.activityId}</span>
						</div>

						<div className="activity-detail-row">
							<span className="activity-label">User ID</span>
							<span className="activity-value">
								: {activityData.activityData?.userId}
							</span>
						</div>

						<div className="activity-detail-row">
							<span className="activity-label">Customer Name</span>
							<span className="activity-value">
								: {activityData.activityData?.customerName}
							</span>
						</div>

						<div className="activity-detail-row">
							<span className="activity-label">CIF</span>
							<span className="activity-value">
								: {activityData.activityData?.customerId}
							</span>
						</div>

						<div className="activity-detail-row">
							<span className="activity-label">Reason</span>
							<span className="activity-value">: {activityData.reason}</span>
						</div>

						<div className="activity-detail-row">
							<span className="activity-label">Rejection Notes</span>
							<span className="activity-value">: -</span>
						</div>

					</div>

					<div className="workflow-timeline">
						<div className={`workflow-step ${workflowStep >= 1 || activityData.status === "REJECTED" ? "completed" : ""}`}>
							<div className="workflow-circle"></div>
							<div className="workflow-info">
								<div className="workflow-title">Created</div>
								<div className="workflow-subtitle">{createdInfo.dateTime}</div>
							</div>
						</div>

						{activityData.status !== "REJECTED" ? (
							<>
								<div className={`workflow-step ${workflowStep >= 2 ? "completed" : ""} ${workflowStep === 1 ? "current" : ""}`}>
									<div className="workflow-circle"></div>
									<div className="workflow-info">
										<div className="workflow-title">
											{workflowStep >= 2 ? "Checked" : "Pending Check"}
										</div>
										{workflowStep >= 2 && (
											<div className="workflow-subtitle">{checkedInfo.dateTime}</div>
										)}
									</div>
								</div>

								<div className={`workflow-step ${workflowStep >= 3 ? "completed" : ""} ${workflowStep === 2 ? "current" : ""}`}>
									<div className="workflow-circle"></div>
									<div className="workflow-info">
										<div className="workflow-title">
											{workflowStep >= 3 ? "Approved" : "Pending Approval"}
										</div>
										{workflowStep >= 3 && (
											<div className="workflow-subtitle">{approvedInfo.dateTime}</div>
										)}
									</div>
								</div>
							</>
						) : (
							<>
								<div className="workflow-step completed">
									<div className="workflow-circle"></div>
									<div className="workflow-info">
										<div className="workflow-title">Rejected</div>
										<div className="workflow-subtitle">{rejectedInfo.dateTime}</div>
									</div>
								</div>
							</>
						)}

					</div>
				</div>

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
								className={`modal-btn modal-btn-submit ${!rejectNotes.trim() ? "disabled" : ""}`}
								onClick={confirmRejection}
								disabled={!rejectNotes.trim()}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

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
							{approvers.map((a) => (
								<option key={a.id} value={a.id}>
									{a.name} ({a.id}) — NPP: {a.npp}
								</option>
							))}
						</select>

						<span className="modal-required">*required</span>

						<div className="modal-actions">
							<button className="modal-btn modal-btn-cancel" onClick={cancelApprove}>
								Cancel
							</button>
							<button
								className={`modal-btn modal-btn-submit ${!selectedApprover ? "disabled" : ""}`}
								onClick={confirmCheckerApproval}
								disabled={!selectedApprover}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

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
										<span className="activity-value">
											: {successDetails.menu}
										</span>
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

							<button
								className="modal-btn modal-btn-view"
								onClick={() => {
									closeSuccess();
									navigate("/admin/activity");
								}}
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