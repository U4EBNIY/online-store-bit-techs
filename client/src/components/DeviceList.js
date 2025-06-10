import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';
import { Context } from '../index';
import DeviceItem from './DeviceItem';
import { observer } from 'mobx-react-lite';

const DeviceList = observer(() => {
    const { device } = useContext(Context);

    return (
        <Row
            className="d-flex justify-content-start"
            style={{
                gap: '1.5rem',
                padding: '1rem',
            }}
        >
            {device.devices.map(device => (
                <DeviceItem key={device.id} device={device} />
            ))}
        </Row>
    );
});

export default DeviceList;
