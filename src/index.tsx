import { h, render, Fragment, JSX } from 'preact';
import { useState, useRef } from 'preact/hooks';
import MediaInfo, { Result } from 'mediainfo.js';

import './style.scss';

function App() {
    const fileInput = useRef<HTMLInputElement>(null);
    const [log, setLog] = useState('');
    const logRef = useRef('');

    function appendLog(message: string) {
        logRef.current += message + '\n';
        setLog(logRef.current);
    }

    function getFilesFromInput({ currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>) {
        handleFiles(currentTarget.files);
    }

    function getFilesFromDrop(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    }

    function handleFiles(files: FileList) {
        const file = files[0];
        appendLog(`got file: '${file.name}'`);

        MediaInfo({
            locateFile: () => 'https://unpkg.com/mediainfo.js@0.1.4/dist/MediaInfoModule.wasm',
            format: 'text',
        }).then(mi => {
            appendLog('mediainfo loaded');
            file.arrayBuffer().then(buf => {
                appendLog('got buffer');

                function getSize() {
                    return buf.byteLength;
                }

                function readChunk(size: number, offset: number) {
                    return new Uint8Array(buf.slice(offset, offset + size));
                }

                (mi.analyzeData(getSize, readChunk) as Promise<Result>).then(result => {
                    appendLog(result as string);
                })
            });
        });
    }

    return (
        <>
            <h1>mmscan</h1>
            <input
                type="file"
                onInput={getFilesFromInput}
                class="visually-hidden"
                ref={fileInput}
            />
            <button onClick={() => fileInput.current?.click()}>choose file</button>
            <pre>
                {log}
            </pre>
            <div
                class="drop-target"
                onDragEnter={e => { e.stopPropagation(); e.preventDefault(); }}
                onDragOver={e => { e.stopPropagation(); e.preventDefault(); }}
                onDrop={getFilesFromDrop}
            >
                drop files here!
            </div>
        </>
    );
}

render(<App />, document.getElementById('app'));
