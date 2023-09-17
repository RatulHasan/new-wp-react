import React from "@wordpress/element";
import {Sidebar} from "./Sidebar";
import {Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {__} from "@wordpress/i18n";
import {CogIcon, HomeIcon} from "@heroicons/react/24/outline";
import {applyFilters} from "../Helpers/Hooks";
import {Card} from "../Components/Card";
import {NotFound} from "../Components/404";
import {addAction} from "../Helpers/Hooks";
import {AllComponents} from "./AllComponents";

addAction('plugin-name_notification', 'plugin-name_notification', (message: string, type: string = 'success') => {
    // @ts-ignore
    toast[type](message);
});

export type NavigationType = {
    key: string,
    title: string,
    href: string,
    icon: any,
    current: boolean,
    children?: NavigationType[],
    component?: any
}
export default function Main() {
    let navigations: NavigationType[] = [
        {key: 'dashboard', title: __('Dashboard', 'plugin-name'), href: '/', icon: HomeIcon, current: false, component: Dashboard},
        {key: 'components', title: __('Components', 'plugin-name'), href: 'components', icon: CogIcon, current: false,
            children: [
                {key: 'all', title: __('All Components', 'test-wp-plugin'), href: 'components', icon: CogIcon, current: false, component: AllComponents},
            ]
        },
    ] as NavigationType[];

    navigations = applyFilters('plugin-name.sidebar_navigations', navigations);
    let paths = [
        {key: 'general/:id', title: __('General', 'plugin-name'), href: 'settings/general/:id', icon: CogIcon, current: false, component: Dashboard},
    ];
    paths = applyFilters('plugin-name.routes', paths);

    return (
        <>
            {(
                <div>
                    <Sidebar navigations={navigations}/>
                    <main className="pb-12 lg:pl-72">
                        <div className="sm:px-6 lg:px-2">
                            <Routes>
                                <Route path="*" element={<Card><NotFound /></Card>} />
                                {navigations.map((navigation, index) => {
                                        if (navigation.children) {
                                            return navigation.children.map((child, index) => {
                                                const component = typeof child.component === 'function'
                                                return (
                                                    component ? (<Route key={index} path={child.href} element={<child.component/>}/>) : <Route path="*" element={<Card><NotFound /></Card>} />
                                                )
                                            })
                                        }else {
                                            const component = typeof navigation.component === 'function'
                                            return (
                                                component ? (<Route key={index} path={navigation.href} element={<navigation.component/>}/>) : <Route path="*" element={<Card><NotFound /></Card>} />
                                            )
                                        }
                                    })
                                }

                                {paths.map((path, index) => {
                                        const component = typeof path.component === 'function'
                                        return (
                                            component ? (<Route key={index} path={path.href} element={<path.component/>}/>) : <Route path="*" element={<Card><NotFound /></Card>} />
                                        )
                                    })
                                }
                            </Routes>
                            <div>
                                <ToastContainer
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss={false}
                                    draggable={false}
                                    pauseOnHover
                                    theme="light"
                                />
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </>
    )
}
