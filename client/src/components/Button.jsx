import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) => {
  const baseStyle =
    "w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 flex justify-center items-center";
  const variants = {
    primary: "bg-accent hover:bg-blue-600 shadow-md",
    charity: "bg-charity hover:bg-rose-600 shadow-md",
    outline:
      "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-slate-300",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
