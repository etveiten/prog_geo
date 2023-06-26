import React from "react";
import PropTypes from "prop-types";
import "./OpacitySlider.css";

//Component creating a slider for opacity

const OpacitySlider = ({ value, onChange }) => {
  const handleChange = (event) => {
    const newValue = parseFloat(event.target.value);
    onChange(newValue);
  };

  return (
    <div className="opacity-container">
      <div className="opacity-slider">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

OpacitySlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OpacitySlider;
