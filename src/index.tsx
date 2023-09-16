import React, {createRoot} from '@wordpress/element';
import './app.css';
import './Store/Store';

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
createRoot(document.getElementById('pcm-root')).render(<App/>);
