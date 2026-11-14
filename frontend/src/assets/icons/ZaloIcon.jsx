function ZaloIcon({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="9" fill="#0068FF" />
      <path
        d="M8 11h24v17H19l-7 5v-5H8z"
        fill="white"
      />
      <text
        x="20"
        y="23"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill="#0068FF"
      >
        Zalo
      </text>
    </svg>
  )
}

export default ZaloIcon
