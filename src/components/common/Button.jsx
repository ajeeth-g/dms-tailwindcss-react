const Button = ({ className, icon, label, onClick }) => {
    return (
        <>
            <button className={className} onClick={onClick}>{icon && icon} {label}</button>
        </>
    )
}

export default Button