import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`rounded-xl shadow-lg bg-white ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
}

export const CardContent = ({ children }: CardContentProps) => {
  return <div className="p-4">{children}</div>;
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className }: CardHeaderProps) => {
  return <h3 className={`text-base font-semibold ${className}`}>{children}</h3>;
};