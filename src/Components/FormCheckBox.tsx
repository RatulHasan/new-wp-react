import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Tooltip from "./Tooltip";
import {QuestionMarkCircleIcon} from "@heroicons/react/24/solid";

interface CheckBoxProps {
    label: string;
    name: string;
    id: string;
    className?: string;
    value: any;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    ariaInvalid?: boolean | undefined;
    ariaDescribedBy?: string;
    helpText?: string;
    tooltip?: string;
}

export const FormCheckBox = ({label, name, id, className = '', value, checked, onChange, error, ariaInvalid, ariaDescribedBy,helpText, tooltip}: CheckBoxProps) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 mb-4 mt-4">
                {label}
                {tooltip && (
                    <Tooltip text={tooltip} >
                        <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 ml-1" aria-hidden="true" />
                    </Tooltip>
                )}
            </label>
            <div className="relative mt-2">
                <input
                    type="checkbox"
                    name={name}
                    id={id}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-500 sm:text-sm ${
                        error ? "border-red-500" : ""
                    } ${className}`}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    aria-invalid={ariaInvalid}
                    aria-describedby={ariaDescribedBy}
                />
                {helpText && (
                    <p
                        className="mt-2 text-sm text-gray-500"
                        id={id}
                    >
                        {helpText}
                    </p>
                )}
                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600" id={ariaDescribedBy}>
                    {error}
                </p>
            )}
        </div>
    );
};

// @ts-ignore
window.FormCheckBox = FormCheckBox;
