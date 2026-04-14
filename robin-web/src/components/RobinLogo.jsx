// Neobrutalism Robin Logo — bold geometric R with thick stroke
export default function RobinLogo({ size = 36, dark = false }) {
  const bg  = dark ? '#FDC800' : '#1C293C';
  const txt = dark ? '#1C293C' : '#FDC800';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill={bg}/>
      <rect width="48" height="48" fill="none" stroke="#1C293C" strokeWidth={dark ? 0 : 2}/>
      <path
        d="M12 10 L12 38 M12 10 L28 10 Q36 10 36 19 Q36 26 28 28 L37 38 M12 10 L12 28 L28 28"
        stroke={txt}
        strokeWidth="4.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
