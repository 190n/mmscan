import { h } from 'preact';
import { useState, useEffect, useReducer } from 'preact/hooks';

import { PROXY_URL } from './config';
import Analyze from './Analyze';

interface FromURLProps {
    url: string;
}

function logReducer(state: string[], action: string): string[] {
    return [...state, action];
}

export default function FromURL({ url }: FromURLProps) {
    const [ready, setReady] = useState(false);
    const [size, setSize] = useState(0);
    const [supportsRange, setSupportsRange] = useState(false);
    const [log, appendLog] = useReducer(logReducer, []);

    useEffect(() => {
        // 2021-03-06
        // can't get any headers from a cors request
        // send HEAD through proxy to determine if ranges work, file size, and whether the real one
        // needs to go through proxy (peek access-control-allow-origin; netlify passes that header through!)
        // now might need to run a proxy server in development (on the same port), since the cors proxy just always sets ACAO to *

        fetch(PROXY_URL + url, {
            method: 'HEAD',
            mode: 'same-origin',
        }).then(response => {
            const supportsRange = response.headers.get('accept-ranges') == 'bytes';
            setSupportsRange(supportsRange);
            appendLog(supportsRange ? 'Range requests supported' : 'Range requests not supported');
            const size = parseInt(response.headers.get('content-length'));
            setSize(size);
            appendLog(`Size is ${size} bytes`);
        }).catch(e => {
            console.log(`CAUGHT ERROR ${e}`);
        });
    }, []);

    function getSize() {
        return size;
    }

    async function readChunk(size: number, offset: number) {

    }

    // return <Analyze getSize={getSize} readChunk={readChunk} ready={ready} />
    return (
        <div>
            <h1>FromURL</h1>
            <ul>
                {log.map(msg => <li>{msg}</li>)}
            </ul>
        </div>
    );
}
