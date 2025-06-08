import React, { useEffect, useState, useContext } from 'react';
import { Container, Col, Image, Row, Button, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneDevice, fetchBrands, deleteDevice } from '../http/deviceAPI';
import { addToBasket } from '../http/basketAPI';
import { Context } from '../index';

const DevicePage = () => {
  const [device, setDevice] = useState({ info: [] });
  const { id } = useParams();
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const deviceData = await fetchOneDevice(id);
        const brands = await fetchBrands();
        const brand = brands.find(b => b.id === deviceData.brandId);

        setDevice({ ...deviceData, brand });
      } catch (error) {
        console.error('Ошибка при загрузке устройства:', error);
      }
    };

    load();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Вы точно хотите удалить этот товар?')) {
      try {
        await deleteDevice(id);
        alert('Товар успешно удалён');
        navigate('/'); // Вернуться в магазин
      } catch (error) {
        alert('Ошибка при удалении товара');
        console.error(error);
      }
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={4}>
          <h2 className="text-center">
            <p className="text-center text-muted">Бренд: {device.brand?.name}</p>
            {device.name}
          </h2>
          <Image
            className="mx-auto d-block"
            width={300}
            height={300}
            src={process.env.REACT_APP_API_URL + device.img}
          />
        </Col>

        <Col md={4}>
          <Card
            className="d-flex flex-column align-items-center justify-content-around"
            style={{
              width: 300,
              height: 300,
              fontSize: 32,
              border: '5px solid lightgray',
            }}
          >
            <h3>От: {device.price} руб.</h3>

            <Button
            variant={'outline-dark'}
            onClick={async () => {
                if (!user.isAuth) {
                alert('Сначала войдите в аккаунт, чтобы добавить товар в корзину');
                return;
                }

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


            {user.user?.role === 'ADMIN' && (
              <Button
                variant="danger"
                className="mt-3"
                onClick={handleDelete}
              >
                Удалить товар
              </Button>
            )}
          </Card>
        </Col>
      </Row>

      <Row className="d-flex flex-column m-3">
        <h1>Характеристики</h1>
        {device.info.map((info, index) => (
          <Row
            key={info.id}
            style={{
              background: index % 2 === 0 ? 'lightgray' : 'transparent',
              padding: 10,
            }}
          >
            {info.title}: {info.description}
          </Row>
        ))}
      </Row>
    </Container>
  );
};

export default DevicePage;
