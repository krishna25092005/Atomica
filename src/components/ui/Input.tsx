import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = "default",
  size = "md",
  className,
  ...props
}) => {
  const baseClasses = "w-full transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default: "bg-white dark:bg-form-input border border-stroke dark:border-form-strokedark text-black dark:text-white focus:border-primary dark:focus:border-primary focus:ring-primary/20",
    filled: "bg-gray-50 dark:bg-form-input border-transparent text-black dark:text-white focus:bg-white dark:focus:bg-form-input focus:border-primary dark:focus:border-primary focus:ring-primary/20",
    outlined: "bg-transparent border-2 border-stroke dark:border-form-strokedark text-black dark:text-white focus:border-primary dark:focus:border-primary focus:ring-primary/20",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2.5 text-base rounded-lg",
    lg: "px-5 py-3 text-lg rounded-xl",
  };

  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            errorClasses,
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
