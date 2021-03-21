import { h, Fragment } from 'preact';
import { useRecoilValue } from 'recoil';
import { route } from 'preact-router';

import { filesState, LogSeverity } from './state';
import Analyze from './Analyze';
import Uploader from './Uploader';
import Status from './Status';
import Log from './Log';

export interface FromUploadProps {
    id?: string;
}

export default function FromUpload({ id }: FromUploadProps) {
    const { id: stateId, files } = useRecoilValue(filesState);

    if (files === undefined) {
        return <Fragment />;
    } else if (stateId == id) {
        route('/results', true);
        return <Fragment />;
    } else if (id !== undefined) {
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
        <>
            <Uploader>upload another</Uploader>
            <Status />
            <Log />
            <Analyze getSize={getSize} readChunk={readChunk} filename={file.name} />
        </>
    );
}
