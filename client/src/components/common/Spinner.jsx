import clsx from 'clsx';

export default function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={clsx(
      'animate-spin rounded-full border-2 border-line-700 border-t-accent-violet',
      sizes[size], className
    )} />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function InlineError({ message }) {
  return (
    <div className="rounded-lg border border-accent-rose/30 bg-accent-rose/10 px-4 py-3 text-sm text-accent-rose">
      {message || 'Something went wrong. Please try again.'}
    </div>
  );
}
