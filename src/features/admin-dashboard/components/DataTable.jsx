import React from "react";
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
	headerColor = "teal",
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
				<table className={`data-table ${tableClassName} header-${headerColor}`}>
					<thead>
						<tr>
							{columns.map((column, index) => (
								<th
									key={index}
									className={column.sortable ? "sortable" : ""}
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
							<tr key={row.id || rowIndex}>
								{columns.map((column, colIndex) => (
									<td key={colIndex}>
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