import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

export type ColorMode = 'light' | 'dark';
export type ColorModePreference = ColorMode | 'system';

export const colorModePreferenceState = atom<ColorModePreference>({
    key: 'colorModePreferenceState',
    default: window.localStorage.getItem('colorModePreference') as ColorModePreference ?? 'system',
});

export const systemColorModeState = atom<ColorMode>({
    key: 'systemColorModeState',
    default: window.matchMedia
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : 'light',
});

export const colorModeState = selector<ColorMode>({
    key: 'colorModeState',
    get: ({ get }) => {
        const pref = get(colorModePreferenceState);
        if (pref == 'system') {
            return get(systemColorModeState);
        } else {
            return pref;
        }
    }
});

export function ColorModeHandler() {
    const colorMode = useRecoilValue(colorModeState);
    const colorModePreference = useRecoilValue(colorModePreferenceState);
    const setSystemColorMode = useSetRecoilState(systemColorModeState);

    useEffect(() => {
        if (colorMode == 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [colorMode]);

    useEffect(() => {
        window.localStorage.setItem('colorModePreference', colorModePreference);
    }, [colorModePreference]);

    useEffect(() => {
        if (!window.matchMedia) return;

        const query = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemColorMode(query.matches ? 'dark' : 'light');

        if (query.addEventListener) {
            query.addEventListener('change', e => {
                setSystemColorMode(e.matches ? 'dark' : 'light');
            });
        }
    }, []);

    return <Fragment />;
}
