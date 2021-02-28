import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import { useFiles } from './FilesContext';
import useDragAndDrop from './useDragAndDrop';

export default function Landing() {
    const [url, setURL] = useState('');
    const fileInput = useRef<HTMLInputElement>(null);
    const [_, setFiles] = useFiles();

    function handleFiles(files: FileList) {
        setFiles(files);
        route('/results');
    }

    useDragAndDrop({
        filesCallback: handleFiles,
    });

    function handleSubmit() {
        route(`/${url}`);
    }

    function handleKeyPress(e: KeyboardEvent) {
        if (e.key == ' ' || e.key == 'Enter') {
            fileInput.current?.click();
        }
    }

    return (
        <div class="Landing">
            <h1 class="title"><strong>mmscan</strong> - scan multimedia files</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={url}
                    onInput={e => setURL(e.currentTarget.value)}
                    placeholder="enter url of file"
                    autofocus
                />
                <button type="submit" class="button filled">
                    &#11169; analyze
                </button>
            </form>
            <p>
                <input
                    type="file"
                    class="hidden"
                    id="file-input"
                    ref={fileInput}
                    onInput={e => handleFiles(e.currentTarget.files)}
                />
                <label for="file-input">
                    <span
                        class="button"
                        role="button"
                        aria-controls="filename"
                        tabIndex={0}
                        onKeyPress={handleKeyPress}
                        onKeyUp={handleKeyPress}
                    >
                        choose file
                    </span>
                </label> or drop anywhere on the page
            </p>
            <button
                style="position: absolute; left: 4px; bottom: 4px;"
                onClick={() => document.body.classList.toggle('dark')}
                class="button"
            >
                swap theme
            </button>
        </div>
    );
}
