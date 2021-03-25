import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useSetRecoilState } from 'recoil';

import { filesState } from './state';
import DropTarget from './DropTarget';
import Uploader from './Uploader';

export default function Landing() {
    const [url, setURL] = useState('');
    const setFiles = useSetRecoilState(filesState);

    function handleFiles(files: FileList) {
        let id = Math.floor(Math.random() * 36 ** 4).toString(36);
        while (id.length < 4) {
            id = '0' + id;
        }

        setFiles({ id, files });
        route(`/results/${id}`);
    }

    function handleSubmit() {
        route(`/${url}`);
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
                <Uploader>choose file</Uploader> or drop anywhere on the page
            </p>
            <DropTarget filesCallback={handleFiles} />
        </div>
    );
}
