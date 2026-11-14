function EmailIcon({ className = 'mt-1 h-4 w-4 shrink-0 text-brand-500' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 5.5h18v13H3v-13Zm1.2 1.2 7.8 6 7.8-6M4.2 17.3l5.2-4m6.4 0 5.2 4" />
    </svg>
  )
}

export default EmailIcon
