import { h } from 'preact';
import { Router, Route } from 'preact-router';
import { RecoilRoot } from 'recoil';

import Landing from './Landing';
import FromURL from './FromURL';
import FromUpload from './FromUpload';

export default function App() {
    return (
        <RecoilRoot>
            <Router>
                <Route path="/" component={Landing} />
                <Route path="/results" component={FromUpload} />
                <Route path="/:url+" component={FromURL} />
            </Router>
        </RecoilRoot>
    );
}
