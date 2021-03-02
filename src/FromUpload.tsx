import { h, Fragment } from 'preact';
import { useRecoilValue } from 'recoil';

import { filesState } from './state';
import Analyze from './Analyze';

export interface FromUploadProps {
    id: string;
}

export default function FromUpload({ id }: FromUploadProps) {
    const { id: stateId, files } = useRecoilValue(filesState);

    if (files === undefined || stateId != id) {
        return <Fragment />;
    }

    const file = files[0];

    function getSize() {
        return file.size;
    }

    async function readChunk(size: number, offset: number) {
        return new Uint8Array(await file.slice(offset, offset + size).arrayBuffer());
    }

    return <Analyze getSize={getSize} readChunk={readChunk} />;
}
