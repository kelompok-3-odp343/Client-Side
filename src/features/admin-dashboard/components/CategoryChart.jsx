import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "./../styles/category-chart.css";

// Warna soft luxury gradient
const COLORS = [
	"rgb(255, 179, 71)",
	"rgb(255, 207, 122)",
	"rgb(255, 225, 152)",
	"rgb(255, 237, 188)",
];

const CustomTooltip = ({ active, payload }) => {
	if (!active || !payload?.length) return null;

	const item = payload[0].payload;

	return (
		<div className="chart-tooltip">
			<div className="tooltip-title">{item.name}</div>
			<div className="tooltip-value">
				{item.value}% — Rp {item.amount.toLocaleString("id-ID")}
			</div>
		</div>
	);
};

// Custom label premium
const renderLabel = ({ cx, cy, midAngle, outerRadius, value }) => {
	const RAD = Math.PI / 180;
	const r = outerRadius + 30;
	const x = cx + r * Math.cos(-midAngle * RAD);
	const y = cy + r * Math.sin(-midAngle * RAD);

	return (
		<text
			x={x}
			y={y}
			fill="#333"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
			style={{
				fontWeight: 600,
				fontSize: "14px",
			}}
		>
			{value}%
		</text>
	);
};

export default function CategoryChart({ data }) {
	return (
		<div className="category-chart-card">
			<h2 className="category-chart-title">Transaction Categories</h2>

			<div className="chart-wrapper">
				<ResponsiveContainer width="100%" height={260}>
					<PieChart>
						<Tooltip content={<CustomTooltip />} />

						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius={90}
							labelLine={false}
							label={renderLabel}
							paddingAngle={3}
						>
							{data.map((_, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
									style={{
										filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
										transition: "all 0.3s ease",
									}}
								/>
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>

			<div className="chart-legend">
				{data.map((item, index) => (
					<div key={index} className="legend-item">
						<span
							className="legend-color"
							style={{ backgroundColor: COLORS[index % COLORS.length] }}
						/>
						<span className="legend-text">{item.name}</span>
						<span className="legend-percent">{item.value}%</span>
					</div>
				))}
			</div>
		</div>
	);
}
