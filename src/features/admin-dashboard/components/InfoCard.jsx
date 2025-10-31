import React from "react";
import PropTypes from "prop-types";
import "../styles/info-card.css";

export default function InfoCard({ title, data, className = "" }) {
	return (
		<section className={`info-card ${className}`}>
			<h2 className="info-card-title">{title}</h2>
			<div className="info-card-content">
				{data.map((item) => (
					<div key={item.label} className="info-row">
						<span className="info-label">{item.label}</span>
						<span className="info-value">: {item.value}</span>
					</div>
				))}
			</div>
		</section>
	);
}

InfoCard.propTypes = {
	title: PropTypes.string.isRequired,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		})
	).isRequired,
	className: PropTypes.string,
};