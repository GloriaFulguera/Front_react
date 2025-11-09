
export default function Button({ children, onClick, disabled = false, size = "md" }) {
  
  const baseStyles = "bg-black text-white rounded";

  const sizeStyles = size === "sm" 
    ? "px-3 py-1"  
    : "px-4 py-2"; 

  const disabledStyles = disabled 
    ? "opacity-50 cursor-not-allowed" 
    : "hover:bg-gray-800"; 

  const className = `${baseStyles} ${sizeStyles} ${disabledStyles}`;

  return (
    <button 
      className={className} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
}