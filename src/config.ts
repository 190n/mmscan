export const PROXY_URL = process.env.NODE_ENV == 'production' ? 'https://mmscan.app/proxy/' : 'https://cors-anywhere.herokuapp.com/';
export const FETCH_MODE = process.env.NODE_ENV == 'production' ? 'same-origin' : 'cors';
