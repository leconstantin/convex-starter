import { cn } from '@/lib/utils';

export function PageContainer({
  className,
  children,
  ...props
}: React.ComponentProps<'section'>) {
  return (
    <section className="border-grid" {...props}>
      <div className="container-wrapper relative">
        <div className={cn('container ', className)}>{children}</div>
      </div>
    </section>
  );
}
