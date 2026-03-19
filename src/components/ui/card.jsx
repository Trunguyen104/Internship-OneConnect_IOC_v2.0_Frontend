import { cn } from '@/lib/cn';

function CardRoot({ children, className = '', ...props }) {
  return (
    <div
      data-slot='card'
      className={cn('flex min-h-[420px] flex-col rounded-2xl bg-white p-5 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      data-slot='card-header'
      className={cn('flex items-start justify-between gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({ children, className = '', ...props }) {
  return (
    <div
      data-slot='card-title'
      className={cn('text-lg leading-snug font-semibold text-slate-900', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CardDescription({ children, className = '', ...props }) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-sm text-slate-500', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CardAction({ children, className = '', ...props }) {
  return (
    <div data-slot='card-action' className={cn('shrink-0', className)} {...props}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '', ...props }) {
  return (
    <div data-slot='card-content' className={cn('min-h-0 flex-1', className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      data-slot='card-footer'
      className={cn('mt-auto flex items-center justify-end gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Content: CardContent,
  Footer: CardFooter,
});

export default Card;
export {
  Card,
  CardRoot,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};
