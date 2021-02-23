import { h, render, Fragment, JSX } from 'preact';

function App() {
    function handleFiles({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) {
        console.log(currentTarget.files);
    }

    return (
        <>
            <h1>mmscan</h1>
            <input type="file" onInput={handleFiles} />
        </>
    );
}

render(<App />, document.getElementById('app'));
