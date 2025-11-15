// src/components/Column.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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

const Column = ({ columnId, title, cards, onAddCard, onDeleteColumn, onEditColumn }) => {

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
      {/* Column Header with Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            onClick={onAddCard}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          >
            ➕
          </button>
          <button 
            onClick={onDeleteColumn}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          >
            🗑️
          </button>
        </div>
      </div>
      
      {/* Cards */}
      <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
        {cards.map(card => (
          <Card 
            key={card.id} 
            id={card.id} 
            content={card.content}
            onDelete={card.onDelete}
          />
        ))}
      </SortableContext>
    </div>
    );
};

export default Column;

