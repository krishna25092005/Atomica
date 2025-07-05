"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: "fade-in" | "fade-in-up" | "fade-in-down" | "fade-in-left" | "fade-in-right" | "scale-in" | "slide-in-up" | "slide-in-down";
  delay?: number;
  duration?: number;
  className?: string;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration = 0.5,
  className = "",
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClasses = () => {
    const baseClasses = "transition-all ease-out";
    const durationClass = duration >= 1 ? "duration-1000" : duration >= 0.5 ? "duration-500" : "duration-300";
    
    switch (animation) {
      case "fade-in":
        return `${baseClasses} ${durationClass} ${isVisible ? "opacity-100" : "opacity-0"}`;
      case "fade-in-up":
        return `${baseClasses} ${durationClass} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;
      case "fade-in-down":
        return `${baseClasses} ${durationClass} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`;
      case "fade-in-left":
        return `${baseClasses} ${durationClass} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`;
      case "fade-in-right":
        return `${baseClasses} ${durationClass} ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`;
      case "scale-in":
        return `${baseClasses} ${durationClass} ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`;
      case "slide-in-up":
        return `${baseClasses} ${durationClass} ${isVisible ? "translate-y-0" : "translate-y-full"}`;
      case "slide-in-down":
        return `${baseClasses} ${durationClass} ${isVisible ? "translate-y-0" : "-translate-y-full"}`;
      default:
        return `${baseClasses} ${durationClass} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;
    }
  };

  return (
    <div
      className={cn(getAnimationClasses(), className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
