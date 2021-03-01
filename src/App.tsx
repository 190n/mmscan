import { h } from 'preact';
import { Router, Route, route } from 'preact-router';
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


function Page1() {
    function handleFiles(files: FileList) {
        console.log(files);
        route('/page2');
    }

    return (
        <input type="file" onInput={e => handleFiles(e.currentTarget.files)} />
    );
}

function Page2() {
    return <p>page 2</p>;
}

// export default function App() {
//     return (
//         <Router>
//             <Route path="/" component={Page1} />
//             <Route path="/page2" component={Page2} />
//         </Router>
//     );
// }
