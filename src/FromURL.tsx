import { h, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import Analyze from './Analyze';

interface FromURLProps {
    url: string;
}

export default function FromURL({ url }: FromURLProps) {
    const [ready, setReady] = useState(false);
    const [size, setSize] = useState(0);
    const [supportsRange, setSupportsRange] = useState(false);

    useEffect(() => {
        fetch(url, {
            method: 'HEAD',
            mode: 'no-cors',
        }).then(response => {
            console.log(response.headers);
        });
    }, []);

    function getSize() {
        return size;
    }

    async function readChunk(size: number, offset: number) {

    }

    return <Analyze getSize={getSize} readChunk={readChunk} ready={ready} />
}
