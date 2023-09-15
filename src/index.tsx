import React, {createRoot} from '@wordpress/element';
import './app.css';
import './Store/Store';

import {HashRouter} from "react-router-dom";

export default function App() {
    return (
        <HashRouter>
            <h1>React App</h1>
        </HashRouter>
    )
}

// Render the app
// @ts-ignore
createRoot(document.getElementById('pcm-root')).render(<App/>);
