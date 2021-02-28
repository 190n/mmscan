import { useEffect } from 'preact/hooks';

export interface UseDragAndDropOptions {
    filesCallback?: (files: FileList) => void;
    dragOverCallback?: (x: number, y: number) => void;
}

export default function useDragAndDrop({ filesCallback, dragOverCallback }: UseDragAndDropOptions) {
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
}
