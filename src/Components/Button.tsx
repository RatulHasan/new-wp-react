import {HTMLAttributes} from "react";
import {Link} from "react-router-dom";
import {applyFilters} from "../Helpers/Hooks";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    path?: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export const Button = ({className, children, onClick, path, type = 'button', disabled = false}: ButtonProps) => {
    let buttonClassName = applyFilters('pcm.button_class_name', 'btn-primary-gray')
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
