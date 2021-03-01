import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';

export interface DropTargetProps {
    filesCallback?: (files: FileList) => void;
    dragOverCallback?: (x: number, y: number) => void;
}

export default function DropTarget({ filesCallback, dragOverCallback }: DropTargetProps) {
    function drop(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();
        filesCallback?.(e.dataTransfer.files);
    }

    function dragOver(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();
        dragOverCallback?.(e.pageX, e.pageY);
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
        <Fragment />
    );
}
