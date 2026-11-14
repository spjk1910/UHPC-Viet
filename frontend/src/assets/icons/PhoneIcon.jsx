function PhoneIcon({ className = 'mt-1 h-4 w-4 shrink-0 text-brand-500' }) {
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
      <path d="M6.6 3.5 11 2.2l2.4 5.7-2.7 2.2a15.8 15.8 0 0 0 6.2 6.2l2.2-2.7 5.7 2.4-1.3 4.4a2.5 2.5 0 0 1-2.7 1.8C12.2 20.9 5.1 13.8 3.8 5.2a2.5 2.5 0 0 1 1.8-2.7Z" />
    </svg>
  )
}

export default PhoneIcon
