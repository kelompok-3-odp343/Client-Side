import React from "react";
import PropTypes from "prop-types";
import "../styles/search-bar.css";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
	return (
		<div className="search-container">
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className="search-input"
			/>
			<i className="fas fa-search search-icon"></i>
		</div>
	);
}

SearchBar.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
};