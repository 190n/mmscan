import { h, Fragment } from 'preact';
import { useRecoilValue } from 'recoil';

import { statusState, progressState, workingState } from './state';

export default function Status() {
    const status = useRecoilValue(statusState);
    const progress = useRecoilValue(progressState);
    const working = useRecoilValue(workingState);

    return (
        <Fragment>
            {working && (
                <p>
                    {status}
                    {typeof progress == 'number' ? (
                        <progress value={progress}>{Math.round(progress * 100)}%</progress>
                    ) : (
                        <progress>(working)</progress>
                    )}
                </p>
            )}
        </Fragment>
    )
}
