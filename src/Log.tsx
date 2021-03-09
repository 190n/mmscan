import { h } from 'preact';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import { logState, LogMessage, LogSeverity } from './state';

export function useLogger() {
    const setLog = useSetRecoilState(logState);

    return function logger(message: LogMessage) {
        setLog(currentLog => currentLog.concat([message]));
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
