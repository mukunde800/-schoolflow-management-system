export default function Spinner({ size = 'md', fullScreen }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const spinner = (
    <div className={`animate-spin rounded-full border-2 border-primary-600 border-t-transparent ${sizes[size]}`} />
  );
  if (fullScreen) return <div className="flex items-center justify-center h-screen">{spinner}</div>;
  return spinner;
}