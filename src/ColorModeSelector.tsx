import { h } from 'preact';
import { useRecoilState } from 'recoil';

import { ColorModePreference, colorModePreferenceState } from './color-mode';

const names: Record<ColorModePreference, string> = {
    light: 'light',
    dark: 'dark',
    system: 'system default',
};

export default function ColorModeSelector() {
    const [colorModePreference, setColorModePreferece] = useRecoilState(colorModePreferenceState);

    return (
        <select class="ColorModeSelector" value={colorModePreference} onChange={e => setColorModePreferece(e.currentTarget.value as ColorModePreference)}>
            {Object.keys(names).map((n: ColorModePreference) => (
                <option value={n} key={n}>
                    {names[n]}
                </option>
            ))}
        </select>
    )
}
