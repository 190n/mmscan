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

enum URLStatus { Yes, Maybe, No };

export default function FromURL({ url }: FromURLProps) {
    const [ready, setReady] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const [usingProxy, setUsingProxy] = useState(false);
    const [failed, setFailed] = useState(false);
    const setStatus = useSetRecoilState(statusState);
    const setProgress = useSetRecoilState(progressState);
    const setWorking = useSetRecoilState(workingState);
    const log = useLogger();

    useEffect(() => {
        (async () => {
            async function checkUrl(url: string): Promise<URLStatus> {
                try {
                    const response = await fetch(url, {
                        mode: 'cors',
                        method: 'HEAD',
                    });

                    if (!response.ok) {
                        log(`HTTP error: ${response.status} ${response.statusText}`, LogSeverity.Error);
                        return URLStatus.No;
                    }

                    if (!response.headers.get('accept-ranges')?.includes('bytes')) {
                        log('server does not support range requests!', LogSeverity.Error);
                        return URLStatus.No;
                    }

                    setTotalSize(parseInt(response.headers.get('content-length')));
                    return URLStatus.Yes;
                } catch (e) {
                    // might be possible with proxy
                    log(`checkUrl caught error ${e}`, LogSeverity.Debug);
                    return URLStatus.Maybe;
                }
            }

            // fetch first without a proxy to see if we can
            // if this errors, either we need a proxy or range requests aren't supported
            switch (await checkUrl(url)) {
                case URLStatus.Yes:
                    // go ahead with request
                    log('no proxy needed', LogSeverity.Debug);
                    setUsingProxy(true);
                    setReady(true);
                    break;
                case URLStatus.Maybe:
                    // try proxy
                    if (await checkUrl(PROXY_URL + url) == URLStatus.Yes) {
                        setUsingProxy(true);
                        setReady(true);
                        log('Using a proxy server. Only 16 MiB per request may be sent through the proxy server.');
                    } else {
                        setFailed(true);
                        log('If you can access the file through your browser, try downloading it and uploading it to mmscan.');
                    }
                    break;
                case URLStatus.No:
                    // can't do it
                    setFailed(true);
                    log('If you can access the file through your browser, try downloading it and uploading it to mmscan.');
                    break;
            }
        })();
    }, []);

    const getSize = useCallback(() => totalSize, [totalSize]);

    const readChunk = useCallback(async (size: number, offset: number) => {
        if (size == 0) {
            return new Uint8Array(0);
        }

        const fetchUrl = usingProxy ? PROXY_URL + url : url,
            response = await fetch(fetchUrl, {
                headers: {
                    Range: `bytes=${offset}-${offset + size - 1}`,
                },
            }),
            buf = await response.arrayBuffer();

        return new Uint8Array(buf);
    }, [url, usingProxy]);

    return (
        <Analyze
            getSize={getSize}
            readChunk={readChunk}
            ready={ready} filename={url}
        />
    );
}
