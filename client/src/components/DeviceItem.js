import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from '../utils/consts';
import { Col, Card, Image } from 'react-bootstrap';

const DeviceItem = observer(({ device }) => {
    const { device: deviceStore } = useContext(Context);
    const navigate = useNavigate();

    const brand = deviceStore.brands.find(b => b.id === device.brandId);

    return (
        <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            style={{ marginBottom: '2rem', cursor: 'pointer', minWidth: 280 }}
            onClick={() => navigate(`${DEVICE_ROUTE}/${device.id}`)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
        >
            <Card
                style={{
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    border: 'none',
                    overflow: 'hidden',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '100%', // square aspect ratio
                        backgroundColor: '#f8fafc',
                    }}
                >
                    <Image
                        src={process.env.REACT_APP_API_URL + device.img}
                        alt={device.name}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            userSelect: 'none',
                        }}
                        draggable={false}
                    />
                </div>
                <Card.Body style={{ padding: '1.25rem', flexGrow: 1 }}>
                    <Card.Title
                        style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: '#111827',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginBottom: '0.25rem',
                        }}
                        title={device.name}
                    >
                        {device.name}
                    </Card.Title>
                    <Card.Text
                        style={{
                            fontSize: '0.95rem',
                            color: '#6b7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                        }}
                        title={brand ? brand.name : 'Бренд не указан'}
                    >
                        {brand ? brand.name : 'Бренд не указан'}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
});

export default DeviceItem;
