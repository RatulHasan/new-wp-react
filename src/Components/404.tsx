import {__} from "@wordpress/i18n";
import {Link} from "react-router-dom";
import {applyFilters} from "../Helpers/Hooks";

const red = applyFilters('pcm.red', 'gray');
export const NotFound = ({goBackUrl='/'}: {goBackUrl?: string}) => {
    return(
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-indigo-600">
                    {__('404', 'pcm')}
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    {__('Page not found', 'pcm')}
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    {__('Sorry, we couldn’t find the page you’re looking for.', 'pcm')}
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to={goBackUrl} className="text-sm font-semibold text-gray-900">
                        <span aria-hidden="true">&larr;</span> {__('Go back home', 'pcm')}
                    </Link>
                </div>
            </div>
        </main>
    )
}
export const PermissionDenied = () => {
    return(
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className={"text-base font-semibold text-"+red+"-600"}>
                    {__('403', 'pcm')}
                </p>
                <h1 className={"mt-4 text-3xl font-bold tracking-tight text-"+red+"-600 sm:text-5xl"}>
                    {__('Permission denied!', 'pcm')}
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    {__('Sorry, you don’t have permission to access this page.', 'pcm')}
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to={'/'} className="text-sm font-semibold text-gray-900">
                        <span aria-hidden="true">&larr;</span> {__('Go back home', 'pcm')}
                    </Link>
                </div>
            </div>
        </main>
    )
}

// @ts-ignore
window.NotFound = NotFound;
// @ts-ignore
window.PermissionDenied = PermissionDenied;
