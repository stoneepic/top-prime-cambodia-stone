export default function IconArrow({ className = '' }) {
  return (
    <svg aria-hidden="true" className={`icon icon--arrow ${className}`} viewBox="0 0 24 24">
      <path d="M5 19 19 5" />
      <path d="M8 5h11v11" />
    </svg>
  );
}
