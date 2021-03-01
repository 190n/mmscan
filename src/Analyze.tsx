import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import MediaInfo from 'mediainfo.js';

export interface AnalyzeProps {
    getSize: () => number | Promise<number>;
    readChunk: (size: number, offset: number) => Promise<Uint8Array>;
    ready?: boolean;
}

export default function Analyze({ getSize, readChunk, ready = true }: AnalyzeProps) {
    const [output, setOutput] = useState('');

    useEffect(() => {
        if (ready) {
            (async () => {
                const mediaInfo = await MediaInfo({
                    locateFile: () => 'https://unpkg.com/mediainfo.js@0.1.4/dist/MediaInfoModule.wasm',
                    format: 'text',
                });

                const result = await mediaInfo.analyzeData(getSize, readChunk) as string;
                setOutput(result);
            })();
        }
    }, [ready]);

    return (
        <div class="Analyze">
            <pre>{output}</pre>
        </div>
    );
}
