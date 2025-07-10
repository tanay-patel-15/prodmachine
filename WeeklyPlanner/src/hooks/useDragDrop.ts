import { useState, useCallback } from 'react';
import { DragDropData } from '../types';

export const useDragDrop = () => {
  const [draggedItem, setDraggedItem] = useState<DragDropData | null>(null);

  const startDrag = useCallback((data: DragDropData) => {
    setDraggedItem(data);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const isDragging = draggedItem !== null;

  return {
    draggedItem,
    startDrag,
    endDrag,
    isDragging,
  };
}; 