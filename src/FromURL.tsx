import { h, Fragment } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { useSetRecoilState } from 'recoil';

import { PROXY_URL, PROXY_CAP, CHUNK_SIZE } from './config';
import Analyze from './Analyze';
import { statusState, progressState, workingState, LogSeverity } from './state';
import Log, { useLogger } from './Log';
import Status from './Status';

interface FromURLProps {
    url: string;
}

function logReducer(state: string[], action: string): string[] {
    return [...state, action];
}

export default function FromURL({ url }: FromURLProps) {
    const [ready, setReady] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const [usingProxy, setUsingProxy] = useState(false);
    const setStatus = useSetRecoilState(statusState);
    const setProgress = useSetRecoilState(progressState);
    const setWorking = useSetRecoilState(workingState);
    const totalTransferred = useRef(0);
    const log = useLogger();

    useEffect(() => {
        (async () => {
            async function checkUrl(url: string) {
                const response = await fetch(url, {
                    mode: 'cors',
                    method: 'HEAD',
                });

                if (!response.ok) {
                    log('response not ok', LogSeverity.Debug);
                }

                if (!response.headers.get('accept-ranges')?.includes('bytes')) {
                    log('server does not support range requests!', LogSeverity.Error);
                    return; // TODO set error state, suggest downloading file manually
                }
            }

            // fetch first without a proxy to see if we can
            // if this errors, either we need a proxy or range requests aren't supported
            try {
                checkUrl(url);
            } catch (e) {
                log('fetch threw error', LogSeverity.Debug);
                checkUrl(PROXY_URL + url);
            }
        })();
    }, []);

    const getSize = useCallback(() => totalSize, [totalSize]);

    const readChunk = useCallback(async (size: number, offset: number) => {
        throw 'abort';
    }, [url, usingProxy, supportsRange]);

    return (
        <>
            <Status />
            <Log />
            <Analyze getSize={getSize} readChunk={readChunk} ready={ready} filename={url} />
        </>
    );
}
