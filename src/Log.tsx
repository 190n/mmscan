import { h } from 'preact';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import { logState, LogSeverity } from './state';
import { MIN_LOG_LEVEL } from './config';

export function useLogger() {
    const setLog = useSetRecoilState(logState);

    return function logger(text: string, severity: LogSeverity = LogSeverity.Info) {
        if (severity >= MIN_LOG_LEVEL) {
            setLog(currentLog => currentLog.concat([{ text, severity }]));
        }

        console.log(`[${LogSeverity[severity]}] ${text}`);
    }
}

export default function Log() {
    const log = useRecoilValue(logState);

    return (
        <ol class="Log">
            {log.map(({ text, severity }) => (
                <li>
                    [{LogSeverity[severity]}]
                    {text}
                </li>
            ))}
        </ol>
    );
}
