import clsx from 'clsx';

export default function Card({ children, className, ...props }) {
  return (
    <div className={clsx('glass-panel p-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  );
}
