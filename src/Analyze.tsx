import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import MediaInfo from 'mediainfo.js';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { statusState, progressState, workingState, wasmObjectURLState } from './state';

export interface AnalyzeProps {
    getSize: () => number | Promise<number>;
    readChunk: (size: number, offset: number) => Promise<Uint8Array>;
    ready?: boolean;
    filename: string;
}

export default function Analyze({ getSize, readChunk, filename, ready = true }: AnalyzeProps) {
    const [output, setOutput] = useState('');
    const setStatus = useSetRecoilState(statusState);
    const setProgress = useSetRecoilState(progressState);
    const setWorking = useSetRecoilState(workingState);
    const [wasmObjectURL, setWasmObjectURL] = useRecoilState(wasmObjectURLState);

    useEffect(() => {
        if (ready) {
            (async () => {
                setWorking(true);

                let localObjectURL: string;

                if (wasmObjectURL === undefined) {
                    setStatus('Loading MediaInfo...');
                    const wasmBlob = await (await fetch('https://unpkg.com/mediainfo.js@0.1.4/dist/MediaInfoModule.wasm')).blob();
                    localObjectURL = URL.createObjectURL(wasmBlob);
                    setWasmObjectURL(localObjectURL);
                }

                const mediaInfo = await MediaInfo({
                    locateFile: () => wasmObjectURL ?? localObjectURL,
                    format: 'text',
                });

                const totalSize = await getSize();

                async function reader(size: number, offset: number): Promise<Uint8Array> {
                    setProgress(offset / totalSize);
                    return await readChunk(size, offset);
                }

                setStatus('Processing file...');
                const result = await mediaInfo.analyzeData(() => totalSize, reader) as string;
                setOutput(result);
                setWorking(false);
            })();
        }
    }, [ready]);

    return (
        <div class="Analyze">
            <h1>$ mediainfo <strong>{filename}</strong></h1>
            <pre>{output}</pre>
        </div>
    );
}
