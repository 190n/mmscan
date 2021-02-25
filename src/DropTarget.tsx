import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export default function DropTarget() {
    function drop(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();
        console.log('drop');
    }

    function dragOver(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();
        console.log('dragover');
    }

    useEffect(() => {
        document.body.addEventListener('drop', drop, false);
        document.body.addEventListener('dragover', dragOver, false);

        return () => {
            document.body.removeEventListener('drop', drop, false);
            document.body.removeEventListener('dragover', dragOver, false);
        };
    }, []);

    return (
        <div></div>
    );
}
