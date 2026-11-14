function ImagePlaceholder({ label, className = '' }) {
  return (
    <div
      className={`flex min-h-48 items-center justify-center bg-linear-to-br from-gray-200 via-gray-100 to-gray-300 text-sm font-medium text-gray-500 ${className}`}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  )
}

export default ImagePlaceholder
