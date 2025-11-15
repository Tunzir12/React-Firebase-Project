// src/components/Card.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const cardStyle = {
    padding: '10px',
    margin: '8px 0',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 1px 0 rgba(9,30,66,.25)',
    cursor: 'pointer',
    opacity: 1,
    border: '1px solid #ccc'
};

const Card = ({ id, content, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        ...cardStyle,
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{content}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ❌
        </button>
      </div>
    </div>
    );
};

export default Card;