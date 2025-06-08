import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { ListGroup, Row, Card, Col } from 'react-bootstrap';
import { Context } from '../index';

const BrandBar = observer(() => {
    const {device} = useContext(Context);
    return (
        <Row className='d-flex'>
            {device.brands.map(brand =>
                <Col>
                <Card
                style={{cursor: 'pointer'}}
                    key={brand.id}
                    className="p-3"
                    onClick={() => device.setSelectedBrand(brand)}
                    border={brand.id === device.selectedBrand.id ? 'danger' : 'light'}
                >
                    {brand.name}
                </Card>
                </Col>
            )}
        </Row>
    );
});

export default BrandBar;