import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <select ref={ref} className={`input ${error ? 'border-red-500' : ''} ${className}`} {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
));

export default Select;