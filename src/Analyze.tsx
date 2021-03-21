import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import MediaInfo from 'mediainfo.js';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { WASM_MODULE_URL, CHUNK_SIZE } from './config';
import { statusState, progressState, workingState, wasmObjectURLState, LogSeverity } from './state';
import Status from './Status';
import Log, { useLogger } from './Log';
import Uploader from './Uploader';

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
    const log = useLogger();

    useEffect(() => {
        if (ready) {
            (async () => {
                setWorking(true);

                let localObjectURL: string;

                if (wasmObjectURL === undefined) {
                    setStatus('Loading MediaInfo...');
                    const wasmBlob = await (await fetch(WASM_MODULE_URL)).blob();
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

                try {
                    setOutput(await mediaInfo.analyzeData(() => totalSize, reader) as string);
                } catch (e) {
                    log(`error while processing: ${e}`, LogSeverity.Error);
                } finally {
                    setWorking(false);
                }
            })();
        }
    }, [ready]);

    return (
        <div class="Analyze">
            <Uploader>upload another</Uploader>
            <Status />
            <Log />
            <h1>$ mediainfo <strong>{filename}</strong></h1>
            <pre>{output}</pre>
        </div>
    );
}
