import {useRef } from "@wordpress/element";
import {QuestionMarkCircleIcon} from "@heroicons/react/24/solid";

interface Props {
    text: string;
    children?: React.ReactNode;
}

const ToolTip = ({ children, text }: Props) => {
    const tooltipRef = useRef<HTMLSpanElement>(null);
    const container = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={container}
            onMouseEnter={({ clientX, clientY }) => {
                if (!tooltipRef.current || !container.current) return;
                const { left, top, width, height } = container.current.getBoundingClientRect();
                const tooltipWidth = tooltipRef.current.offsetWidth;
                const tooltipHeight = tooltipRef.current.offsetHeight;

                const leftPosition = clientX - left - tooltipWidth / 2;
                const topPosition = clientY - top - tooltipHeight / 2;
                tooltipRef.current.style.left = leftPosition + "px";
                tooltipRef.current.style.top = topPosition + "px";
                tooltipRef.current.style.width = "auto";
                tooltipRef.current.style.minWidth = Math.min(width - leftPosition, leftPosition) + "px";
                tooltipRef.current.style.zIndex = "auto";
            }}
            className="group relative inline-block text-left"
        >
            {children ? children : <QuestionMarkCircleIcon className="h-5 w-5 text-gray-600 ml-1" aria-hidden="true" />}
            {text ? (
                <span
                    ref={tooltipRef}
                    className="p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-gray-800 text-xs text-white rounded absolute top-full whitespace-normal left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
          {text}
        </span>
            ) : null}
        </div>
    );
};

// @ts-ignore
window.ToolTip = ToolTip;
export default ToolTip;
