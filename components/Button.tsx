import Link from 'next/link';
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: never;
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href: string;
}

type Props = ButtonProps | LinkButtonProps;

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0';
  
  const variants = {
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
    secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-gray-200',
    outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props;
    
    // External link
    if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      return (
        <a
          href={href}
          className={combinedClassName}
          {...(anchorProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    
    // Internal link
    return (
      <Link
        href={href}
        className={combinedClassName}
        {...(anchorProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <button
      className={combinedClassName}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
