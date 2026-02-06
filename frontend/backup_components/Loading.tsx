import React from "react";

type Props = {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Loading: React.FC<Props> = ({ label = "Loading", size = "md", className = "" }) => {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  return (
    <div className={`rounded-xl bg-green-900 p-5 flex items-center gap-3 ${className}`}>
      <svg
        className={`animate-spin ${sizeClass} text-white`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span className="text-white text-lg font-semibold">{label}</span>
    </div>
  );
};

export default Loading;
