import React from 'react';

export const AlertDialog = ({ children, open, onClose }) => {
  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="relative"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({ children, className = '' }) => (
  <div className={`bg-blue-950 rounded-lg p-6 max-w-md mx-auto border border-gold-200/20 ${className}`}>
    {children}
  </div>
);

export const AlertDialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

export const AlertDialogTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-medieval ${className}`}>
    {children}
  </h3>
);

export const AlertDialogDescription = ({ children, className = '' }) => (
  <p className={`mt-2 ${className}`}>
    {children}
  </p>
);

export const AlertDialogFooter = ({ children }) => (
  <div className="mt-6 flex justify-end space-x-2">
    {children}
  </div>
);

export const AlertDialogAction = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded font-medieval ${className}`}
  >
    {children}
  </button>
);