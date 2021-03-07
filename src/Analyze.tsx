import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import MediaInfo from 'mediainfo.js';
import { useRecoilState } from 'recoil';

import { wasmObjectURLState } from './state';

export interface AnalyzeProps {
    getSize: () => number | Promise<number>;
    readChunk: (size: number, offset: number) => Promise<Uint8Array>;
    ready?: boolean;
    filename: string;
}

export default function Analyze({ getSize, readChunk, filename, ready = true }: AnalyzeProps) {
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState<number | undefined>(undefined);
    const [working, setWorking] = useState(false);
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
            <h1>$ mediainfo {filename}</h1>
            {working && (
                <p>
                    {status}
                    {typeof progress == 'number' ? (
                        <progress value={progress}>{Math.round(progress * 100)}%</progress>
                    ) : (
                        <progress>(working)</progress>
                    )}
                </p>
            )}
            <pre>{output}</pre>
        </div>
    );
}
