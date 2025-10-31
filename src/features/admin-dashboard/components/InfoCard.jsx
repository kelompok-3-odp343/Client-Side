import React from "react";
import "../styles/info-card.css";

export default function InfoCard({ title, data, className = "" }) {
	return (
		<section className={`info-card ${className}`}>
			<h2 className="info-card-title">{title}</h2>
			<div className="info-card-content">
				{data.map((item, index) => (
					<div key={index} className="info-row">
						<span className="info-label">{item.label}</span>
						<span className="info-value">: {item.value}</span>
					</div>
				))}
			</div>
		</section>
	);
}