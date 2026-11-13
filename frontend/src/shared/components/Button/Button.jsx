
const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600',

  secondary:
    'bg-dark text-white hover:bg-gray-700',

  outline:
    'border border-brand-500 text-brand-600 hover:bg-brand-50',

  ghost:
    'text-dark hover:bg-light',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-md font-semibold
        transition-colors duration-200
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-brand-600
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
