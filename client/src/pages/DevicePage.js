import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap';
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
    <Container
      fluid
      className="pt-5 pb-5"
      style={{
        maxWidth: 1200,
        backgroundColor: '#ffffff',
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        color: '#374151',
      }}
    >
      {/* Top section: Horizontal layout with image and details side-by-side */}
      <Row className="gx-5 align-items-center mb-5">
        {/* Image column: takes about 40% width */}
        <Col xs={12} md={5} className="text-center">
          <Image
            src={process.env.REACT_APP_API_URL + device.img}
            alt={device.name}
            fluid
            style={{
              maxHeight: 280,
              width: 'auto',
              borderRadius: 12,
              objectFit: 'contain',
              boxShadow: '0 0 16px rgba(0,0,0,0.05)',
              marginBottom: '1.5rem',
            }}
            draggable={false}
          />
        </Col>



        {/* Details column: takes about 60% width */}
        <Col xs={12} md={7}>
          <p
            style={{
              fontSize: 33,
              color: '#111827',
                            fontWeight: 700,
              userSelect: 'none',
            }}
          >
            {device.brand?.name || 'Не указан'}
          </p>

          <h1
            style={{
              fontWeight: 700,
              fontSize: 48,
              marginBottom: 8,
              lineHeight: 1.1,
              color: '#111827',
            }}
          >
            {device.name}
          </h1>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#111827',
              marginBottom: 24,
              userSelect: 'none',
            }}
          >
            Цена: {device.price} &#8381;
          </div>

          <Button
            variant="dark"
            size="lg"
            style={{ borderRadius: 12, padding: '0.75rem 2rem' }}
            onClick={async () => {
              if (!user.isAuth) {
                alert('Сначала войдите в аккаунт, чтобы добавить товар в корзину');
                return;
              }
              try {
                await addToBasket(device.id);
                alert('Товар добавлен в корзину');
              } catch {
                alert('Ошибка при добавлении в корзину');
              }
            }}
            className="mb-3"
          >
            Добавить в корзину
          </Button>

          {user.user?.role === 'ADMIN' && (
            <div className="d-flex gap-3 flex-wrap">
              <Button
                variant="outline-secondary"
                size="md"
                style={{ borderRadius: 12, flex: '1 1 120px' }}
                onClick={() => navigate(`/edit-device/${device.id}`)}
              >
                Редактировать товар
              </Button>
              <Button
                variant="outline-danger"
                size="md"
                style={{ borderRadius: 12, flex: '1 1 120px' }}
                onClick={handleDelete}
              >
                Удалить товар
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Divider */}
      <hr style={{ borderColor: '#e5e7eb', marginBottom: 40 }} />

      {/* Characteristics section: stacked list with scroll */}
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <h2
            style={{
              fontWeight: 700,
              fontSize: 36,
              marginBottom: 24,
              color: '#111827',
              textAlign: 'center',
            }}
          >
            Характеристики
          </h2>

          <div
            style={{
              maxHeight: 280,
              overflowY: 'auto',
              padding: 20,
              borderRadius: 12,
              backgroundColor: '#f9fafb',
              boxShadow: 'inset 0 0 12px rgba(0,0,0,0.03)',
              border: '1px solid #e5e7eb',
              userSelect: 'none',
            }}
          >
            {device.info.length > 0 ? (
              device.info.map((info, index) => (
                <div
                  key={info.id}
                  style={{
                    display: 'flex',
                    padding: '10px 16px',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f3f4f6',
                    borderRadius: 8,
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: '#4b5563',
                      fontSize: 16,
                      flexBasis: '30%',
                      flexShrink: 0,
                    }}
                  >
                    {info.title}
                  </div>
                  <div style={{ fontSize: 16, color: '#374151', flexGrow: 1 }}>
                    {info.description}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>Нет характеристик для данного устройства.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DevicePage;
