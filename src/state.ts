import { atom } from 'recoil';

export const filesState = atom<{ id: string, files?: FileList }>({
    key: 'filesState',
    default: { id: '' },
    dangerouslyAllowMutability: true, // Object.freeze throws error when called on FileList
});

export const statusState = atom({
    key: 'statusState',
    default: '',
});

export const progressState = atom<number | undefined>({
    key: 'progressState',
    default: undefined,
});

export const workingState = atom({
    key: 'workingState',
    default: false,
});

export const wasmObjectURLState = atom<string | undefined>({
    key: 'wasmObjectURLState',
    default: undefined,
});

export enum LogSeverity { Debug, Info, Warning, Error };

export interface LogMessage {
    text: string;
    severity: LogSeverity;
}

export const logState = atom<LogMessage[]>({
    key: 'logState',
    default: [],
});
