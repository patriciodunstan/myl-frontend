import { forwardRef, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';

// ========================================
//    CARD
// ========================================
interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={`
        bg-slate-800
        rounded-xl
        border-2
        border-slate-700
        shadow-md
        transition-all
        duration-[250ms]
        ${hoverable ? 'hover:-translate-y-1 hover:border-[#e94560] hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-4 p-6 ${className ?? ''}`}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={`text-xl font-display font-bold text-[#e94560] ${className ?? ''}`}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 pt-0 ${className ?? ''}`}>{children}</div>;
}

// ========================================
//    INPUT
// ========================================
export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`
        w-full
        px-3
        py-3
        bg-slate-900
        border-2
        border-slate-700
        rounded-lg
        text-white
        text-base
        font-sans
        transition-all
        duration-[150ms]
        focus:outline-none
        focus:border-[#e94560]
        focus:shadow-[0_0_0_3px_rgba(233,69,96,0.2)]
        placeholder:text-slate-400
        ${className}
      `}
      {...props}
    />
  );
}

// ========================================
//    SELECT
// ========================================
export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={`
        w-full
        px-3
        py-3
        bg-slate-900
        border-2
        border-slate-700
        rounded-lg
        text-white
        text-base
        font-sans
        cursor-pointer
        transition-all
        duration-[150ms]
        focus:outline-none
        focus:border-[#e94560]
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

// ========================================
//    BUTTON
// ========================================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', isLoading, leftIcon, rightIcon, className = '', children, disabled, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-[#e94560] text-white border-[#e94560] hover:bg-[#ff6b6b] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(233,69,96,0.4)]',
      secondary: 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:border-slate-400',
      ghost: 'hover:bg-slate-800 text-slate-400 hover:text-slate-200',
    };

    const sizeClasses = {
      default: 'px-6 py-3 text-base',
      sm: 'px-3 py-2 text-sm',
      lg: 'px-8 py-4 text-xl',
    };

    return (
      <button
        ref={ref}
        className={`
          inline-flex
          items-center
          justify-center
          gap-2
          border-2
          rounded-lg
          font-semibold
          font-display
          cursor-pointer
          transition-all
          duration-[150ms]
          whitespace-nowrap
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 animate-spin">⟳</span>
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ========================================
//    BADGE
// ========================================
interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
}

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-slate-950 border-slate-700 text-slate-300',
    accent: 'bg-[rgba(233,69,96,0.1)] border-[#e94560] text-[#e94560]',
    success: 'bg-[rgba(74,222,128,0.2)] border-green-400 text-green-400',
    warning: 'bg-[rgba(251,191,36,0.2)] border-amber-400 text-amber-400',
    error: 'bg-[rgba(239,68,68,0.2)] border-red-500 text-red-500',
  };

  return (
    <span
      className={`
        inline-flex
        px-2
        py-0.5
        text-xs
        font-semibold
        rounded
        border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// ========================================
//    SCORE BAR (Similarity/Score Badge)
// ========================================
interface ScoreBarProps {
  score: number; // 0-1
  label?: string;
  className?: string;
}

export function ScoreBar({ score, label, className = '' }: ScoreBarProps) {
  const percentage = Math.round(score * 100);
  const hue = Math.max(0, Math.min(120, percentage * 1.2)); // 0-120 hue (red to green)
  const textColor = percentage >= 70 ? 'text-white' : percentage >= 40 ? 'text-slate-100' : 'text-slate-300';

  return (
    <span
      className={`
        inline-flex
        px-3
        py-1
        rounded-lg
        text-xs
        font-bold
        whitespace-nowrap
        ${textColor}
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, #e94560, hsl(${hue}, 70%, 60%))`,
      }}
    >
      {label || `Score: ${percentage}%`}
    </span>
  );
}

// ========================================
//    SPINNER
// ========================================
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-slate-700
        border-t-[#e94560]
        rounded-full
        animate-spin
      `}
    />
  );
}

// ========================================
//    EMPTY STATE
// ========================================
interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, message, icon, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        px-12
        py-12
        text-center
        text-slate-400
        ${className}
      `}
    >
      {icon && (
        <div className="w-20 h-20 mb-4 opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-bold font-display text-slate-300 mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-base max-w-[400px] leading-[1.6]">
          {message}
        </p>
      )}
    </div>
  );
}

// ========================================
//    LABEL (Form Label)
// ========================================
interface LabelProps {
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

export function Label({ htmlFor, children, className = '' }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`
        block
        text-sm
        font-semibold
        text-slate-300
        mb-2
        uppercase
        tracking-wider
        ${className}
      `}
    >
      {children}
    </label>
  );
}

// ========================================
//    FORM GROUP
// ========================================
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className = '' }: FormGroupProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

// ========================================
//    FORM HELP TEXT
// ========================================
interface FormHelpProps {
  children: ReactNode;
  className?: string;
}

export function FormHelp({ children, className = '' }: FormHelpProps) {
  return (
    <p
      className={`
        text-xs
        text-slate-400
        mt-1
        leading-[1.4]
        ${className}
      `}
    >
      {children}
    </p>
  );
}

// ========================================
//    PRICE AVAILABILITY BADGE
// ========================================
interface PriceAvailabilityProps {
  availability: 'disponible' | 'limitado' | 'sin_stock';
  className?: string;
}

export function PriceAvailability({ availability, className = '' }: PriceAvailabilityProps) {
  const variantClasses = {
    disponible: 'bg-[rgba(74,222,128,0.2)] text-green-400 border-green-400',
    limitado: 'bg-[rgba(251,191,36,0.2)] text-amber-400 border-amber-400',
    sin_stock: 'bg-[rgba(239,68,68,0.2)] text-red-500 border-red-500',
  };

  return (
    <span
      className={`
        inline-block
        px-3
        py-1
        rounded-lg
        text-xs
        font-semibold
        uppercase
        border
        ${variantClasses[availability]}
        ${className}
      `}
    >
      {availability.replace('_', ' ')}
    </span>
  );
}
