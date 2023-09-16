import {userCan} from "../Helpers/User";
import {UserCapNames} from "../Types/UserType";
import {PermissionDenied} from "./404";
import {Card} from "./Card";

type HOCProps = {
    role: UserCapNames;
    children: React.ReactNode;
}
export const HOC = ({role, children}: HOCProps) => {
    if (!userCan(role)) {
        return (
            <Card className="overflow-hidden bg-white shadow sm:rounded-lg py-8 px-8 w-full mt-2">
                <PermissionDenied />
            </Card>
        );
    }

    return <>{children}</>;
}

// @ts-ignore
window.HOC = HOC;
