import Spinner from '../common/Spiner';

export default function Button({
  children, variant = 'primary', size = 'md', loading, icon,
  className = '', ...props
}) {
  const variants = {
    primary: 'btn-primary', secondary: 'btn-secondary',
    danger: 'btn-danger', ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' };

  return (
    <button
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
}