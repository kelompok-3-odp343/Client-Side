import React from "react";
import PropTypes from "prop-types";
import "../styles/status-badge.css";

export default function StatusBadge({ status, type = "transaction" }) {
	const getStatusClass = () => {
		const statusLower = status.toLowerCase();

		if (type === "transaction") {
			switch (statusLower) {
				case "success":
					return "status-success";
				case "pending":
					return "status-pending";
				case "failed":
					return "status-failed";
				default:
					return "";
			}
		}

		if (type === "user") {
			switch (statusLower) {
				case "active":
					return "status-active";
				case "blocked":
					return "status-blocked";
				default:
					return "";
			}
		}

		return "";
	};

	return <span className={`status-badge ${getStatusClass()}`}>{status}</span>;
}

StatusBadge.propTypes = {
	status: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["transaction", "user"]),
};