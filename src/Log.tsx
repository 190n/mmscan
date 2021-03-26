import { h, JSX } from 'preact';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { FaBug, FaInfo, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';

import { logState, LogSeverity } from './state';
import { MIN_LOG_LEVEL } from './config';

const logIcons: Record<LogSeverity, JSX.Element> = {
    [LogSeverity.Debug]:   <FaBug title="debug" />,
    [LogSeverity.Info]:    <FaInfo title="info" />,
    [LogSeverity.Warning]: <FaExclamationTriangle title="warning" />,
    [LogSeverity.Error]:   <FaExclamationCircle title="error" />,
};

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
                    {logIcons[severity]} {text}
                </li>
            ))}
        </ol>
    );
}
