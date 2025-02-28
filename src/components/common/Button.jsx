const Button = ({ className, icon, label, onClick }) => {
  return (
    <>
      <button className={className} onClick={onClick}>
        {label} {icon && icon}{" "}
      </button>
    </>
  );
};

export default Button;
