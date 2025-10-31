import React from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/category-chart.css";

export default function CategoryChart({ data, title = "Transaction Category" }) {
	return (
		<section className="category-panel">
			<h2 className="panel-title">{title}</h2>

			<div className="category-content">
				<div className="category-list">
					{data.map((item) => (
						<div key={item.name} className="category-item">
							<span className="category-name">{item.name}</span>
							<span className="category-amount">: {item.amount}</span>
						</div>
					))}

					<div className="category-percentages">
						{data.map((item) => (
							<div key={item.name} className="percentage-item">
								<span
									className="percentage-bar"
									style={{ background: item.color, width: `${item.value}%` }}
								></span>
								<span className="percentage-text">
									{item.value}% {item.name}
								</span>
							</div>
						))}
					</div>
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
								endAngle={450}
							>
								{data.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
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