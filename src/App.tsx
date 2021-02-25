import { h } from 'preact';
import { Router, Route } from 'preact-router';

import Landing from './Landing';
import FromURL from './FromURL';

export default function App() {
    return (
        <Router>
            <Route path="/" component={Landing} />
            <Route path="/:url+" component={FromURL} />
        </Router>
    )
}
