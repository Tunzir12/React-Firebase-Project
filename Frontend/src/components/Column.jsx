// src/components/Column.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import Card from './Card'; 

const columnStyle = {
    flexShrink: 0,
    width: '300px',
    padding: '10px',
    backgroundColor: '#f4f5f7',
    borderRadius: '6px',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 2px 0 rgba(9,30,66,.13)',
};

const Column = ({ columnId, title, cards }) => {
    // 1. Make the Column sortable for reordering columns (Horizontal DND)
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging: isColumnDragging,
    } = useSortable({ id: columnId, data: { type: 'Column' } });

    // 2. Make the Column droppable for receiving Cards (Vertical DND)
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: columnId,
        data: { type: 'Container', cards: cards },
    });

    const style = {
        ...columnStyle,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isColumnDragging ? 0.5 : 1,
        border: isOver ? '2px dashed #007bff' : 'none',
    };

    // Combine refs for sortable and droppable
    const setNodeRef = (node) => {
        setSortableRef(node);
        setDroppableRef(node);
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <h2>{title} ({cards.length})</h2>
            
            {/* SortableContext for reordering cards within this column */}
            <SortableContext 
                items={cards.map(card => card.id)} 
                // Use vertical strategy for cards within a column
                strategy={verticalListSortingStrategy} 
            >
                {cards.map(card => (
                    <Card key={card.id} id={card.id} content={card.content} />
                ))}
            </SortableContext>
        </div>
    );
};

export default Column;