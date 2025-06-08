import React, { useContext, useEffect } from 'react';
import TypeBar from '../components/TypeBar';
import { Container, Row, Col } from 'react-bootstrap';
import BrandBar from '../components/BrandBar';
import DeviceList from '../components/DeviceList';
import {observer} from 'mobx-react-lite';
import {fetchBrands, fetchDevice, fetchTypes} from '../http/deviceAPI';
import {Context} from '../index';
import Pages from '../components/Pages';

const Shop = observer (() => {
    const {device} = useContext(Context);

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data));
        fetchBrands().then(data => device.setBrands(data));
        fetchDevice(null, null, 1, 2).then(data => {
            device.setDevices(data.rows);
            device.setTotalCount(data.count);
        });
    }, []);


    useEffect (() => {
        fetchDevice(device.selectedType.id, device.selectedBrand.id, device.page, 2).then(data => {
            device.setDevices(data.rows);
            device.setTotalCount(data.count);
        });
    }, [device.page, device.selectedType, device.selectedBrand,])

    return ( 
        <Container>
            <Row className='mt-2'>
                <Col md={3}>
                    <TypeBar />
                </Col>

                <Col md={9}>
                    <BrandBar />
                    <DeviceList />
                    <Pages />
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;