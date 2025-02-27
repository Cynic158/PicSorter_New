import React from "react";
import "../styles/components/loader.scss";

interface LoaderProps {
  width?: string;
}

const Loader: React.FC<LoaderProps> = ({ width }) => {
  return (
    <svg
      className="loader-container"
      style={{ width: width ? width : "22px" }}
      viewBox="0 0 384 384"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="active"
        pathLength="360"
        fill="transparent"
        strokeWidth="32"
        cx="192"
        cy="192"
        r="176"
      ></circle>
      <circle
        className="track"
        pathLength="360"
        fill="transparent"
        strokeWidth="32"
        cx="192"
        cy="192"
        r="176"
      ></circle>
    </svg>
  );
};

export default Loader;
