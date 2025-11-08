import React from "react";
import PropTypes from "prop-types";
import "../styles/data-table.css";

const getSortIcon = (sortConfig, columnKey, onSort) => {
	const isActive = sortConfig?.key === columnKey;
	const ascActive = isActive && sortConfig.direction === "asc";
	const descActive = isActive && sortConfig.direction === "desc";

	return (
		<span
			className={`sort-icons ${isActive ? "active" : ""}`}
			onClick={(e) => {
				e.stopPropagation();
				onSort(columnKey);
			}}
			role="button"
			title="Sort"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onSort(columnKey);
			}}
		>
			<span className={`arrow up ${ascActive ? "active" : ""}`}>↑</span>
			<span className={`arrow down ${descActive ? "active" : ""}`}>↓</span>
		</span>
	);
};

export default function DataTable({
	title,
	columns,
	data,
	sortConfig,
	onSort,
	renderCell,
	renderColumnHeader,
	searchBar,
	tableClassName = "",
	headerColor = "teal",
}) {
	return (
		<section className="data-table-section">
			<div className="table-header">
				<h2>{title}</h2>
				{searchBar}
			</div>

			<div className="table-wrapper">
				<table className={`data-table ${tableClassName} header-${headerColor}`}>
					<thead>
						<tr>
							{columns.map((column) => (
								<th
									key={column.key}
									className={`${column.sortable ? "sortable " : ""}${column.key}-col`}
								>
									<div className="th-content">
										<span className="th-label">{column.label}</span>
										<div className="th-icons">
											{column.sortable &&
												getSortIcon(sortConfig, column.key, onSort)}
											{column.filterable &&
												renderColumnHeader &&
												renderColumnHeader(column)}
										</div>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row, rowIndex) => (
							<tr key={row.id || JSON.stringify(row)}>
								{columns.map((column) => (
									<td key={column.key} className={`${column.key}-col`}>
										{renderCell ? renderCell(row, column, rowIndex) : row[column.key]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="table-footer">{data.length} rows</div>
		</section>
	);
}

DataTable.propTypes = {
	title: PropTypes.string.isRequired,
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			sortable: PropTypes.bool,
			filterable: PropTypes.bool,
		})
	).isRequired,
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	sortConfig: PropTypes.shape({
		key: PropTypes.string,
		direction: PropTypes.oneOf(["asc", "desc"]),
	}),
	onSort: PropTypes.func,
	renderCell: PropTypes.func,
	renderColumnHeader: PropTypes.func,
	searchBar: PropTypes.node,
	tableClassName: PropTypes.string,
	headerColor: PropTypes.string,
};