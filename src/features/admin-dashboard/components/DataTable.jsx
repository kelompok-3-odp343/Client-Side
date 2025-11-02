import React from "react";
import PropTypes from "prop-types";
import "../styles/data-table.css";

export default function DataTable({
	title,
	columns,
	data,
	sortConfig,
	onSort,
	renderCell,
	searchBar,
	tableClassName = "",
}) {
	const getSortIcon = (columnKey) => {
		if (sortConfig?.key === columnKey) {
			return sortConfig.direction === "asc" ? "▲" : "▼";
		}
		return null;
	};

	return (
		<section className="data-table-section">
			<div className="table-header">
				<h2>{title}</h2>
				{searchBar}
			</div>

			<div className="table-wrapper">
				<table className={`data-table ${tableClassName}`}>
					<thead>
						<tr>
							{columns.map((column) => (
								<th
									key={column.key}
									className={`${column.sortable ? "sortable " : ""}${column.key}-col`}
									onClick={column.sortable ? () => onSort(column.key) : undefined}
								>
									{column.label}
									{column.sortable && sortConfig && (
										<span className="sort-icon">{getSortIcon(column.key)}</span>
									)}
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
		})
	).isRequired,
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	sortConfig: PropTypes.shape({
		key: PropTypes.string,
		direction: PropTypes.oneOf(["asc", "desc"]),
	}),
	onSort: PropTypes.func,
	renderCell: PropTypes.func,
	searchBar: PropTypes.node,
	tableClassName: PropTypes.string,
};