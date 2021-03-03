import { h, Fragment, ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { route } from 'preact-router';
import { useSetRecoilState } from 'recoil';

import { filesState } from './state';

export interface UploaderProps {
    children: ComponentChildren;
}

export default function Uploader({ children }: UploaderProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const setFiles = useSetRecoilState(filesState);

    function handleFiles(files: FileList) {
        let id = Math.floor(Math.random() * 36 ** 4).toString(36);
        while (id.length < 4) {
            id = '0' + id;
        }

        setFiles({ id, files });
        route(`/results/${id}`);
    }

    function handleKeyPress(e: KeyboardEvent) {
        if (e.key == ' ' || e.key == 'Enter') {
            fileInput.current?.click();
        }
    }

    return (
        <>
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
                    {children}
                </span>
            </label>
        </>
    )
}
