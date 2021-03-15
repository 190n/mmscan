import { h, Fragment } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { useSetRecoilState } from 'recoil';

import { PROXY_URL, PROXY_CAP } from './config';
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
    const [supportsRange, setSupportsRange] = useState(false);
    const setStatus = useSetRecoilState(statusState);
    const setProgress = useSetRecoilState(progressState);
    const setWorking = useSetRecoilState(workingState);
    const totalTransferred = useRef(0);
    const log = useLogger();

    useEffect(() => {
        // 2021-03-06
        // can't get any headers from a cors request
        // send HEAD through proxy to determine if ranges work, file size, and whether the real one
        // needs to go through proxy (peek access-control-allow-origin; netlify passes that header through!)
        // now might need to run a proxy server in development (on the same port), since the cors proxy just always sets ACAO to *

        setWorking(true);
        setProgress(undefined);
        setStatus('Preparing request...');

        fetch(PROXY_URL + url, {
            method: 'HEAD',
            mode: 'same-origin',
            headers: {
                'X-Requested-With': window.location.hostname,
            },
        }).then(response => {
            if (response.ok) {
                const supportsRange = response.headers.get('accept-ranges') == 'bytes';
                log(`Ranges ${supportsRange ? 'supported' : 'not supported'}`, LogSeverity.Debug);
                if (!supportsRange) {
                    log('Server does not support range requests, so the entire file must be downloaded.');
                }
                setSupportsRange(supportsRange);
                const size = parseInt(response.headers.get('content-length'));
                log(`Size is ${size} bytes`, LogSeverity.Debug);
                setTotalSize(size);

                const acao = response.headers.get('access-control-allow-origin');
                log(`Access-Control-Allow-Origin: ${acao}`, LogSeverity.Debug);

                let origin = `${window.location.protocol}//${window.location.hostname}`;
                if (window.location.port !== '') {
                    origin += `:${window.location.port}`;
                }

                if (acao == '*' || acao == origin) {
                    log('no proxy needed', LogSeverity.Debug);
                    setUsingProxy(false);
                } else {
                    log(`Using proxy server. There is a maximum of ${PROXY_CAP / 2**20}MiB per request.`, LogSeverity.Info);
                    setUsingProxy(true);
                }

                setReady(true);
            } else {
                log(`${response.status} ${response.statusText}`, LogSeverity.Error);
                setWorking(false);
            }
        }).catch(e => {
            // only for network errors
            // HTTP error codes resolve with response.ok = false
            log(`Could not load file. Are you connected to the Internet?`, LogSeverity.Error);
            setWorking(false);
        });
    }, []);

    const getSize = useCallback(() => totalSize, [totalSize]);

    const readChunk = useCallback(async (size: number, offset: number) => {
        const fetchUrl = usingProxy ? PROXY_URL + url : url;

        if (size == 0) {
            return new Uint8Array(0);
        }

        if (supportsRange) {
            try {
                const response = await fetch(fetchUrl, {
                    headers: {
                        Range: `bytes=${offset}-${offset + size - 1}`,
                    },
                });
                if (!response.ok) {
                    setReady(false);
                    log(`${response.status} ${response.statusText}`, LogSeverity.Error);
                    return null;
                }
                const buf = await response.arrayBuffer();
                return new Uint8Array(buf);
            } catch (e) {
                setReady(false);
                log(`Error: ${e}`, LogSeverity.Error);
                return null;
            }
        } else {
            return new Uint8Array(size);
        }
    }, [url, usingProxy, supportsRange]);

    return (
        <>
            <Status />
            <Log />
            <Analyze getSize={getSize} readChunk={readChunk} ready={ready} filename={url} />
        </>
    );
}
