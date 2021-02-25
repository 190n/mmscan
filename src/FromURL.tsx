import { h, Fragment } from 'preact';

interface FromURLProps {
    url: string;
}

export default function FromURL({ url }: FromURLProps) {
    return (
        <>
            URL: {url}<br />
            <a href="/">back home</a>
        </>
    );
}
