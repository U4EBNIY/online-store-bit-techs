import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Context } from '../index';

const BrandBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <div
            style={{
                maxWidth: '1200px',
                margin: '1rem auto',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e0e7ff', // subtle pastel blue border for refinement
            }}
        >
            <Row className="d-flex" style={{ gap: '0.5rem' }}>
                {device.brands.map(brand => (
                    <Col
                        key={brand.id}
                        xs={6}
                        sm={4}
                        md={3}
                        lg={2}
                        style={{ marginBottom: '0.5rem' }}
                    >
                        <Card
                            style={{
                                cursor: 'pointer',
                                border:
                                    brand.id === device.selectedBrand.id
                                        ? '2px solid #6366f1' // Indigo-500 pastel highlight
                                        : '1px solid #cbd5e1', // Light gray border for default cards
                                borderRadius: '0.75rem',
                                boxShadow:
                                    brand.id === device.selectedBrand.id
                                        ? '0 6px 18px rgba(99, 102, 241, 0.3)'
                                        : '0 2px 6px rgba(203, 213, 225, 0.4)', // lighter subtle shadows
                                transition:
                                    'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0.5rem', // Reduced padding inside the card
                                textAlign: 'center',
                                wordBreak: 'break-word', // Enable word wrapping
                                fontWeight: '600',
                                color: '#374151', // Neutral Gray-700
                                userSelect: 'none',
                                backgroundColor: '#fff',
                                boxSizing: 'border-box',
                            }}
                            onClick={() => device.setSelectedBrand(brand)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    device.setSelectedBrand(brand);
                                }
                            }}
                            aria-pressed={brand.id === device.selectedBrand.id}
                        >
                            {brand.name}
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
});

export default BrandBar;
