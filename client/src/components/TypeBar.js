import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Context } from '../index';

const TypeBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <div
            style={{
                maxWidth: '300px', // Adjust as needed
                margin: '1rem auto',
                padding: '1.5rem',
                backgroundColor: '#f8f9fa', // Light gray background
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e0e7ff', // subtle pastel blue border for refinement
            }}
        >
            <ListGroup>
                {device.types.map(type => (
                    <ListGroup.Item
                        style={{
                            cursor: 'pointer',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            backgroundColor: type.id === device.selectedType.id ? '#007bff' : 'transparent',
                            color: type.id === device.selectedType.id ? 'white' : 'inherit',
                            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                            borderRadius: '0.5rem', // Rounded corners for list items
                            marginBottom: '0.25rem', // Add spacing between items
                            boxShadow: type.id === device.selectedType.id ? '0 2px 6px rgba(0, 123, 255, 0.5)' : 'none', // Subtle shadow on selected item
                        }}
                        active={type.id === device.selectedType.id}
                        onClick={() => device.setSelectedType(type)}
                        key={type.id}
                        className="rounded-0" // Remove rounded corners from default ListGroup.Item
                    >
                        {type.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
});

export default TypeBar;
