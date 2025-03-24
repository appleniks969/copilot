import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  footerActions?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerActions,
  footerActions,
}) => {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {(title || subtitle || headerActions) && (
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center">{headerActions}</div>}
        </div>
      )}
      
      <div className="p-4">{children}</div>
      
      {footerActions && (
        <div className="px-4 py-3 border-t border-gray-200">{footerActions}</div>
      )}
    </div>
  );
};

export default Card;
