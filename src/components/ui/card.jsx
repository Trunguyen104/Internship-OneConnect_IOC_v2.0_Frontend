import PropTypes from 'prop-types';

import { cn } from '@/lib/cn';

function CardRoot({ children, className = '', ...props }) {
  return (
    <div
      data-slot="card"
      className={cn('flex min-h-[420px] flex-col rounded-2xl bg-white p-5 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}

CardRoot.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex items-start justify-between gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

function CardTitle({ children, className = '', ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn('text-lg leading-snug font-semibold text-slate-900', className)}
      {...props}
    >
      {children}
    </div>
  );
}

CardTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

function CardDescription({ children, className = '', ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-slate-500', className)}
      {...props}
    >
      {children}
    </div>
  );
}

CardDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

function CardAction({ children, className = '', ...props }) {
  return (
    <div data-slot="card-action" className={cn('shrink-0', className)} {...props}>
      {children}
    </div>
  );
}

CardAction.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

function CardContent({ children, className = '', ...props }) {
  return (
    <div data-slot="card-content" className={cn('min-h-0 flex-1', className)} {...props}>
      {children}
    </div>
  );
}

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('mt-auto flex items-center justify-end gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

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
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
};
