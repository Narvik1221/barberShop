// src/components/ui/Button.tsx
import React from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  myType?: "default" | "delete";
  className?: string;
  onClick?: any;
  type?: any;
  disabled?: any;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  myType = "default",
  className,
  onClick,
  type,
  disabled = false,
}) => {
  const buttonClass = clsx(
    styles.button,
    {
      [styles.default]: myType === "default",
      [styles.delete]: myType === "delete",
    },
    className
  );

  return (
    <button
      disabled={disabled}
      type={type}
      className={buttonClass}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
