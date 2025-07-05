import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "gradient";
  size?: "sm" | "md" | "lg";
  hover?: boolean;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = "default",
  size = "md",
  hover = true,
  className,
  children,
  ...props
}) => {
  const baseClasses = "rounded-xl transition-all duration-300 ease-out";
  
  const variantClasses = {
    default: "bg-white dark:bg-boxdark border border-stroke dark:border-strokedark shadow-default",
    elevated: "bg-white dark:bg-boxdark shadow-lg dark:shadow-boxdark/10",
    outlined: "bg-transparent border-2 border-stroke dark:border-strokedark",
    gradient: "bg-gradient-to-br from-primary/10 to-secondary/10 border border-stroke/50 dark:border-strokedark/50",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClasses = hover 
    ? "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.02]" 
    : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
