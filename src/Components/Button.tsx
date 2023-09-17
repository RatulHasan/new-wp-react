import {HTMLAttributes} from "react";
import {Link} from "react-router-dom";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    path?: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export const Button = ({className, children, onClick, path, type = 'button', disabled = false}: ButtonProps) => {
    let buttonClassName = 'btn-primary'
    const buttonClass = className ? `${buttonClassName} ${className}` : buttonClassName;

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    if (path) {
        return (
            <Link
                to={path}
                className={buttonClass}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={buttonClass}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// @ts-ignore
window.Button = Button;
