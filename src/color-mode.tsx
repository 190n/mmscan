import { h, createContext, ComponentChildren } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

export type ColorMode = 'light' | 'dark';
export type ColorModePreference = ColorMode | 'system';

interface ColorModeContextType {
    colorMode: ColorMode;
    colorModePreference: ColorModePreference;
    setColorModePreference: (pref: ColorModePreference) => void;
}

export const ColorModeContext = createContext({} as ColorModeContextType);

export const useColorMode = () => useContext(ColorModeContext);

export interface ColorModeProviderProps {
    children: ComponentChildren;
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
    let defaultPreference: ColorModePreference = 'system';
    let storedPreference = window.localStorage.getItem('colorModePreference');
    if ((['light', 'dark', 'system'] as Array<string | null>).includes(storedPreference)) {
        defaultPreference = storedPreference as ColorModePreference;
    }

    const [colorModePreference, setColorModePreference] = useState(defaultPreference);
    const [systemTheme, setSystemTheme] = useState<ColorMode>(
        window.hasOwnProperty('matchMedia') ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 'light'
    );

    useEffect(() => {
        if (!window.hasOwnProperty('matchMedia')) return;

        const query = window.matchMedia('(prefers-color-scheme: dark)');
        if (!query.addEventListener) return; // safari

        function changed(e: MediaQueryListEvent) {
            setSystemTheme(e.matches ? 'dark' : 'light');
        }

        query.addEventListener('change', changed);
        return () => query.removeEventListener('change', changed);
    }, []);

    useEffect(() => window.localStorage.setItem('colorModePreference', colorModePreference), [colorModePreference]);

    const colorMode = colorModePreference == 'system' ? systemTheme : colorModePreference;

    useEffect(() => {
        if (colorMode == 'light') {
            document.body.classList.remove('dark');
        } else {
            document.body.classList.add('dark');
        }
    }, [colorMode]);

    return (
        <ColorModeContext.Provider value={{ colorMode, colorModePreference, setColorModePreference }}>
            {children}
        </ColorModeContext.Provider>
    );
};
