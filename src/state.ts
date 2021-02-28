import { atom } from 'recoil';

export const filesState = atom<FileList | undefined>({
    key: 'filesState',
    default: undefined,
    dangerouslyAllowMutability: true, // Object.freeze throws error when called on FileList
});
