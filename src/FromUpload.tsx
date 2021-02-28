import { h, Fragment } from 'preact';
import { route } from 'preact-router';

import { useFiles } from './FilesContext';
import Analyze from './Analyze';

export default function FromUpload() {
    const [files] = useFiles();

    if (files === undefined) {
        route('/');
        return <Fragment />;
    }

    const file = files[0];

    function getSize() {
        return file.size;
    }

    async function readChunk(size: number, offset: number) {
        return new Uint8Array(await file.slice(offset, offset + size).arrayBuffer());
    }

    return (
        <Analyze getSize={getSize} readChunk={readChunk} />
    );
}
