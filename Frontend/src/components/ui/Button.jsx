import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon: Icon,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:   'bg-navy-900 text-white hover:bg-navy-800 shadow-sm-soft',
    teal:      'bg-teal-600 text-white hover:bg-teal-700 shadow-sm-soft',
    amber:     'bg-amber-500 text-white hover:bg-amber-600 shadow-sm-soft',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm-soft',
    ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm-soft',
    emerald:   'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm-soft',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
          </svg>
          Loading…
        </>
      ) : (
        <>
          {Icon && <Icon size={16} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
