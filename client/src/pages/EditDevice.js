import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneDevice, updateDevice } from '../http/deviceAPI';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Context } from '../index';

const EditDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState(null);
  const [info, setInfo] = useState([]);

  useEffect(() => {
  if (user.user.role !== 'ADMIN') {
    alert('Доступ запрещён');
    navigate('/');
    return;
  }

  fetchOneDevice(id).then(device => {
    setName(device.name);
    setPrice(device.price);

    // Добавляем number для каждого элемента info
    const enrichedInfo = (device.info || []).map(i => ({
      ...i,
      number: Date.now() + Math.random()  // уникальный идентификатор
    }));
    setInfo(enrichedInfo);
  }).catch(() => {
    alert('Ошибка загрузки товара');
    navigate('/');
  });
}, [id, navigate, user]);

  const selectFile = (e) => {
    setImg(e.target.files[0]);
  };

  const addInfo = () => {
    setInfo([...info, { title: '', description: '', number: Date.now() }]);
  };

  const removeInfo = (number) => {
    setInfo(info.filter(i => i.number !== number));
  };

  const changeInfo = (key, value, number) => {
    setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i));
  };

  const saveChanges = async () => {
    if (!name || !price) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', `${price}`);
    if (img) {
      formData.append('img', img);
    }
    formData.append('info', JSON.stringify(info));

    try {
      await updateDevice(id, formData);
      alert('Товар успешно обновлён');
      navigate(`/device/${id}`);
    } catch (e) {
      alert('Ошибка при обновлении товара');
      console.error('Ошибка при обновлении товара:', e);
    }
  };

  return (
        <Container className="mt-4">
    <h2>Редактирование товара</h2>
    <Form>
        <Form.Group className="mb-3">
        <Form.Label>Название</Form.Label>
        <Form.Control value={name} onChange={e => setName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Цена</Form.Label>
        <Form.Control
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Изображение</Form.Label>
        <Form.Control type="file" onChange={selectFile} />
        </Form.Group>

        <div className="mb-3">
        <Button variant="outline-dark" onClick={addInfo}>
            Добавить новое свойство
        </Button>
        </div>

        {info.map(i => (
        <Row className="mb-3" key={i.number}>
            <Col md={4}>
            <Form.Control
                value={i.title}
                onChange={(e) => changeInfo('title', e.target.value, i.number)}
                placeholder="Введите название свойства"
            />
            </Col>
            <Col md={4}>
            <Form.Control
                value={i.description}
                onChange={(e) => changeInfo('description', e.target.value, i.number)}
                placeholder="Введите описание свойства"
            />
            </Col>
            <Col md={4} className="d-flex align-items-center">
            <Button onClick={() => removeInfo(i.number)} variant="outline-danger">
                Удалить
            </Button>
            </Col>
        </Row>
        ))}

        <div className="">
        <Button variant="success" onClick={saveChanges}>
            Сохранить изменения
        </Button>
        </div>
    </Form>
    </Container>
  );
};

export default EditDevice;
