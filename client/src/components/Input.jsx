import React from "react";

const Input = ({ label, id, ...props }) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="mb-2 text-sm font-medium text-slate-600">
        {label}
      </label>
      <input
        id={id}
        className="px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white"
        {...props}
      />
    </div>
  );
};

export default Input;
