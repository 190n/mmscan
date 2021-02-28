import { h, createContext, JSX } from 'preact';
import { useContext, useState } from 'preact/hooks';

type FilesContextType = [FileList | undefined, (files: FileList) => void];

export const FilesContext = createContext<FilesContextType>([undefined, () => {}]);

export const useFiles = () => useContext(FilesContext);

export function FilesProvider({ children }: { children: JSX.Element }) {
    const [files, setFiles] = useState<FileList | undefined>(undefined);

    return (
        <FilesContext.Provider value={[files, setFiles]}>
            {children}
        </FilesContext.Provider>
    );
}
