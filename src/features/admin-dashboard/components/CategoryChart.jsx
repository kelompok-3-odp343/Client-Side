import React from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "../styles/category-chart.css";

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
	const RADIAN = Math.PI / 180;
	const radius = outerRadius * 1.35;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="#000"
			textAnchor="middle"
			dominantBaseline="central"
			fontSize="1rem"
			fontWeight="800"
		>
			<tspan x={x} dy="-0.6em">
				{`${(percent * 100).toFixed(0)}%`}
			</tspan>
			<tspan x={x} dy="1.2em" fontSize="0.9rem" fontWeight="700">
				{name}
			</tspan>
		</text>
	);
};

export default function CategoryChart({ data, title = "Transaction Category" }) {
	return (
		<section className="category-panel">
			<h2 className="panel-title">{title}</h2>

			<div className="category-content">
				<div className="category-list">
					{data.map((item, i) => (
						<div className="category-row" key={i}>
							<span className="cat-name">{item.name}</span>
							<span className="cat-separator">:</span>
							<span className="cat-amount">{item.amount}</span>
						</div>
					))}
				</div>

				<div className="category-chart">
					<ResponsiveContainer width="100%" height={220}>
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								outerRadius={95}
								dataKey="value"
								startAngle={90}
								endAngle={-270}
								labelLine={false}
								isAnimationActive={false}
								label={renderCustomLabel}
							>
								{data.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</section>
	);
}

CategoryChart.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			value: PropTypes.number.isRequired,
			color: PropTypes.string.isRequired,
			amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		})
	).isRequired,
	title: PropTypes.string,
};