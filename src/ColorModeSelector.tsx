import { h } from 'preact';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import { colorModePreferenceState, colorModeState } from './color-mode';

export default function ColorModeSelector() {
    const colorMode = useRecoilValue(colorModeState),
        setColorModePreferece = useSetRecoilState(colorModePreferenceState);

    return (
        <div>
            theme: {colorMode}
            <a href="#" onClick={() => setColorModePreferece('light')}>set light</a>
            <a href="#" onClick={() => setColorModePreferece('dark')}>set dark</a>
            <a href="#" onClick={() => setColorModePreferece('system')}>set system</a>
        </div>
    )
}
