import React from 'react';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => (
  <div className={`w-full ${className}`}>
    {label && (
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
    )}
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon size={16} className="text-slate-400 group-focus-within:text-teal-600 transition-colors" />
        </div>
      )}
      <input
        className={`
          w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5
          bg-white border rounded-xl text-sm text-slate-800
          placeholder:text-slate-400 font-medium
          transition-all duration-200 outline-none shadow-sm-soft
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300'
          }
        `}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
    )}
  </div>
);

export default Input;
