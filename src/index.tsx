import React, {createRoot} from '@wordpress/element';
import './app.css';

import {HashRouter} from "react-router-dom";
import Main from "./Pages/Main";

export default function App() {
    return (
        <HashRouter>
            <Main/>
        </HashRouter>
    )
}

// Render the app
// @ts-ignore
createRoot(document.getElementById('plugin-name-root')).render(<App/>);
