import React, { useEffect, useState } from 'react';
import { Container, Col, Image, Row, Button, Card} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchOneDevice } from '../http/deviceAPI';
import { fetchBrands } from '../http/deviceAPI';
import { addToBasket } from '../http/basketAPI';

const DevicePage = () => {
    const [device, setDevice] = useState({info: []});
    const {id} = useParams();

    useEffect (() => {
        fetchOneDevice(id).then(data => setDevice(data))
    }, [])

useEffect(() => {
    const load = async () => {
        const deviceData = await fetchOneDevice(id);
        const brands = await fetchBrands();

        console.log('deviceData:', deviceData);
        console.log('brands:', brands);

        const brand = brands.find(b => b.id === deviceData.brandId);
        console.log('brand:', brand); // <--- важно

        setDevice({ ...deviceData, brand });
    };

    load();
}, []);


    return (
        <Container className='mt-3'>
            <Row>
                <Col md={4}>
                    <h2 className='text-center'><p className='text-center text-muted'>Бренд: {device.brand?.name}</p>
{device.name}</h2>
                    <Image className="mx-auto d-block" width={300} height={300} src={process.env.REACT_APP_API_URL + device.img} />
                </Col>

                <Col md={4}>
                    <Card
                    className='d-flex flex-column align-items-center justify-content-around'
                    style={{width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
                    >
                        <h3>От: {device.price} руб.</h3>

                        <Button
                            variant={'outline-dark'}
                            onClick={async () => {
                                try {
                                    await addToBasket(device.id);
                                    alert('Товар добавлен в корзину');
                                } catch (error) {
                                    alert('Ошибка при добавлении в корзину');
                                }
                            }}
                        >
                            Добавить в корзину
                        </Button>

                    </Card>
                </Col>
            </Row>

            <Row className='d-flex flex-column m-3'>
                <h1>Характерстики</h1>
                {device.info.map((info, index) => 
                    <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row>
        </Container>
    );
};

export default DevicePage;