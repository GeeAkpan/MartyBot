import type { AnchorHTMLAttributes, ReactNode } from 'react'
import s from './Button.module.scss'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'ghost' | 'dark'
  size?: 'md' | 'lg'
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: Props) {
  const external = rest.href?.startsWith('http')
  return (
    <a
      className={[s.btn, s[variant], s[size], className].filter(Boolean).join(' ')}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
