import { LogSeverity } from './state';

export const PROXY_URL = '/proxy/';
export const PROXY_CAP = 16 * 1024 * 1024; // 16 MiB
export const MIN_LOG_LEVEL = process.env.NODE_ENV == 'production' ? LogSeverity.Info : LogSeverity.Debug;
export const CHUNK_SIZE = 256 * 1024; // 256 KiB
export const WASM_MODULE_URL = 'https://unpkg.com/mediainfo.js@0.1.5/dist/MediaInfoModule.wasm';
