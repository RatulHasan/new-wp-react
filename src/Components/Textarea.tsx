interface TextInputProps {
    label: string;
    name: string;
    id: string;
    className?: string;
    placeholder?: string;
    value: string|number
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
}
export const Textarea=({label, name, id, className='', placeholder, value, onChange, required = false}: TextInputProps)=> {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
        <textarea
            rows={4}
            name={name}
            id={id}
            required={required}
            className={
                className ? className : `block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`
            }
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
            </div>
        </div>
    )
}

// @ts-ignore
window.Textarea = Textarea;
