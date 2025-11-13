export default function CheckCircleIcon({ className = "", style = {} }) {
  return (
    <i 
      className={`icon-check ${className}`}
      style={{
        fontSize: '14px',
        display: 'inline-block',
        lineHeight: '1',
        ...style
      }}
      aria-hidden="true"
    ></i>
  );
}
