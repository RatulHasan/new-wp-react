import { useState, useEffect } from "@wordpress/element";
import { Link, useLocation } from "react-router-dom";
import { NavbarLinkProps } from "../Types/NavigationType";
import { userIs } from "../Helpers/User";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// @ts-ignore
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export const NavbarLink = ({ navigation }: NavbarLinkProps) => {
    const [expandedLinks, setExpandedLinks] = useState<number[]>([]);
    const [currentLink, setCurrentLink] = useState<number>(-1);
    const location = useLocation();

    const toggleLinkExpansion = (index: number) => {
        if (expandedLinks.includes(index)) {
            setExpandedLinks(expandedLinks.filter((i) => i !== index));
        } else {
            setExpandedLinks([index]);
            // setExpandedLinks([...expandedLinks, index]); // To make all child links expanded by default, use [...expandedLinks, index]
        }
    };

    const handleLinkClick = (index: number) => {
        const updatedNavigation = navigation.map((item, i) => ({
            ...item,
            current: i === index || (item.children && item.children.some((child) => child.current)),
        }));
        setCurrentLink(index);
        setExpandedLinks([]); // Reset expanded links when a link is clicked
    };

    useEffect(() => {
        // Find the index of the current active link based on the URL hash
        const activeIndex = navigation.findIndex(
            (item) => item.href === location.pathname.split('/')[1] || item.children?.some((child) => child.href === location.pathname.split('/')[1]) || item.href === '#'
        );
        if (activeIndex !== -1) {
            setCurrentLink(activeIndex);
            setExpandedLinks([activeIndex])
        }
    }, [location, navigation]);

    return (
        <>
            {navigation.map((item, index) => (
                <li key={item.title}>
                    {userIs(item.roles) && (
                        <>
                            {item.children ? (
                                <>
                                    <div
                                        className={classNames(
                                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:cursor-pointer",
                                            currentLink === index
                                                ? "bg-gray-800 text-white active:text-white active:bg-gray-800 hover:text-white hover:bg-gray-800 focus:outline-none focus:bg-gray-800 focus:text-white"
                                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                                        )}
                                        onClick={() => toggleLinkExpansion(index)}
                                    >
                                        {item.icon && (
                                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                        )}
                                        <div onClick={() => handleLinkClick(index)} className="flex items-center justify-between w-full">
                                            <div>{item.title}</div>
                                            <ChevronDownIcon
                                                className={classNames(
                                                    "ml-2 h-5 w-5 text-gray-400 text-right group-hover:text-gray-300 transition ease-in-out duration-150",
                                                    expandedLinks.includes(index) ? "transform rotate-180" : ""
                                                )}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>

                                    {expandedLinks.includes(index) && (
                                        <ul role="list" className="pl-6 py-2 space-y-2">
                                            <NavbarLink navigation={item.children} />
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link
                                    key={index}
                                    to={item.href}
                                    className={classNames(
                                        currentLink === index
                                            ? "bg-gray-800 text-white active:text-white active:bg-gray-800 hover:text-white hover:bg-gray-800 focus:outline-none focus:bg-gray-800 focus:text-white"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800",
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                    onClick={() => handleLinkClick(index)}
                                >
                                    {item.icon && (
                                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    )}
                                    {item.title}
                                </Link>
                            )}
                        </>
                    )}
                </li>
            ))}
        </>
    );
};
