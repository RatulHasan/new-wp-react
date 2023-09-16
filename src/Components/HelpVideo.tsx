import {FilmIcon} from "@heroicons/react/24/outline";
import React from "react";

export const HelpVideo = ({onClick}: {onClick: () => void}) => {
    return(
        <>
            <FilmIcon
                className="h-6 w-6 text-gray-500 cursor-pointer"
                onClick={() => onClick()}
            />
        </>
    )
}

// @ts-ignore
window.HelpVideo = HelpVideo;
