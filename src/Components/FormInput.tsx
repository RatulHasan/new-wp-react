import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import Tooltip from "./Tooltip";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name: string;
    id: string;
    type?: "text" | "number" | "email" | "password" | "tel" | "url" | "search" | "date" | "time" | "datetime-local" | "month" | "week" | "range" | "color";
    className?: string;
    placeholder?: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: any;
    required?: boolean;
    helpText?: string;
    disabled?: boolean;
    tooltip?: string;
    min?: number; // Added min prop
    max?: number; // Added max prop
    autoComplete?: string;
    autoFocus?: boolean;
}

export const FormInput = ({label, name, id, className = "", type = "text", placeholder, value='', onChange, error, required = false, helpText = "", disabled = false, tooltip, min, max,autoComplete = 'off', autoFocus = false}: NumberInputProps) => {
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (type === "number" && (min !== undefined || max !== undefined)) {
            const numericValue = Number(event.target.value);
            if ((min !== undefined && numericValue < min) || (max !== undefined && numericValue > max)) {
                return; // Do not update the value if it is outside the min/max range
            }
        }
        onChange(event);
    };

    return (
        <div>
            <div className="relative mt-2 rounded-md">
                <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                    {tooltip && (
                        <Tooltip text={tooltip}>
                            <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 ml-1" aria-hidden="true" />
                        </Tooltip>
                    )}
                </label>
                <input
                    type={type}
                    name={name}
                    autoComplete={autoComplete}
                    id={id}
                    className={`relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        error ? "border-red-500 !ring-red-500" : ""
                    } ${className}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInput}
                    required={required}
                    disabled={disabled}
                    autoFocus={autoFocus}
                />
                {helpText && (
                    <p className="mt-2 text-sm text-gray-500" id={id}>
                        {helpText}
                    </p>
                )}
                {/*{!isSelectionValid && (*/}
                {/*    <p className="mt-2 text-sm text-red-600">{__('This field is required.', 'pcm')}</p>*/}
                {/*)}*/}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600" id={'error'+id}>
                    {error}
                </p>
            )}
        </div>
    );
};

// @ts-ignore
window.FormInput = FormInput;
