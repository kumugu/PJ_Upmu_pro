'use client'

import { clsx } from 'clsx'
import { forwardRef, HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'shadow'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  children: ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg transition-shadow',
          {
            'bg-white dark:bg-gray-900 shadow': variant === 'default',
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700': variant === 'outline',
            'bg-white dark:bg-gray-900 shadow-lg': variant === 'shadow',
          },
          {
            'p-2': padding === 'sm',
            'p-4': padding === 'md',
            'p-6': padding === 'lg',
            'p-0': padding === 'none',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
