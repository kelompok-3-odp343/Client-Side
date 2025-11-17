import React from "react";
import PropTypes from "prop-types";
import "../styles/pagination.css";

export default function Pagination({
	currentPage,
	totalPages,
	rowsPerPage,
	onPageChange,
	onRowsPerPageChange,
	theme = "teal",
	maxVisiblePages = 9,
}) {
	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	const renderPageNumbers = () => {
		const pages = [];
		const halfVisible = Math.floor(maxVisiblePages / 2);

		let startPage = Math.max(1, currentPage - halfVisible);
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<button
					key={i}
					className={`pagination-number ${currentPage === i ? "active" : ""}`}
					onClick={() => handlePageChange(i)}
				>
					{i}
				</button>
			);
		}

		if (endPage < totalPages) {
			pages.push(
				<span key="ellipsis" className="pagination-dots">
					…
				</span>
			);
		}

		return pages;
	};

	return (
		<div className={`pagination-wrapper theme-${theme}`}>
			<div className="rows-per-page">
				<span>Show</span>
				<select
					value={rowsPerPage}
					onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
					className="rows-select"
				>
					<option value={10}>10</option>
					<option value={25}>25</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
				</select>
				<span>rows</span>
			</div>

			<div className="pagination-controls">
				<button
					className="pagination-btn"
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Prev
				</button>

				{renderPageNumbers()}

				<button
					className="pagination-btn"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</div>
	);
}

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	onRowsPerPageChange: PropTypes.func.isRequired,
	theme: PropTypes.oneOf(["teal", "peach", "purple"]),
	maxVisiblePages: PropTypes.number,
};