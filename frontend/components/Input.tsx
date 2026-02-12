
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold uppercase tracking-wider mb-1 text-gray-700">{label}</label>
      <input 
        className={`w-full bg-white border-b-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-700 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
