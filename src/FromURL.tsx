import { h } from 'preact';
import { useState, useEffect, useReducer } from 'preact/hooks';

import { PROXY_URL, FETCH_MODE } from './config';
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
        fetch(PROXY_URL + url, {
            method: 'HEAD',
            mode: FETCH_MODE,
        }).then(response => {
            const supportsRange = response.headers.get('accept-ranges') == 'bytes';
            setSupportsRange(supportsRange);
            appendLog(supportsRange ? 'Range requests supported' : 'Range requests not supported');
            setSize(parseInt(response.headers.get('content-length')));
            appendLog(`Size is ${response.headers.get('content-length')} bytes`);
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
