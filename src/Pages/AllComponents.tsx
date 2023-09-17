import {__} from "@wordpress/i18n";
import {NotFound, PermissionDenied} from "../Components/404";

export const AllComponents = () => {
    return (
        <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
                {__('Not Found', 'plugin-name')}
            </h3>
            <NotFound />
            <h3 className="text-base font-semibold leading-6 text-gray-900">
                {__('Permission Denied', 'plugin-name')}
            </h3>
            <PermissionDenied />
        </div>
    );
}
