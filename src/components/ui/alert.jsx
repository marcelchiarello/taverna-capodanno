import React from 'react';

export const Alert = ({ children, className = '' }) => (
  <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

export const AlertTitle = ({ children, className = '' }) => (
  <h5 className={`text-lg font-medieval mb-2 ${className}`}>
    {children}
  </h5>
);

export const AlertDescription = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);