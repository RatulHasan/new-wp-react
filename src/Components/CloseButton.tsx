import {XMarkIcon} from "@heroicons/react/24/outline";

type CloseButtonProps = {
    onClick: () => void;
};

export const CloseButton = ({ onClick }: CloseButtonProps) => (
    <button
        className="p-1 ml-auto bg-transparent border-0 text-gray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
        onClick={onClick}
    >
        <XMarkIcon className="w-5 h-5" aria-hidden="true" />
    </button>
);

// @ts-ignore
window.CloseButton = CloseButton;
