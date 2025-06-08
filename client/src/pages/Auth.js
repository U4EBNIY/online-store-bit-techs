import React, { useContext, useState } from 'react';
import { Button, Card, Container, Row, Form, Col } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { registration, login } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '..';

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const history = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER'); // 🟢 Добавляем состояние роли

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password, role); // 🟢 передаём роль
            }

            user.setUser(data);
            user.setIsAuth(true);
            history(SHOP_ROUTE);
        } catch (e) {
            alert(e.response?.data?.message || 'Ошибка');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: window.innerHeight - 54 }}>
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />

                    {/* 🟢 Показываем выбор роли только при регистрации */}
                    {!isLogin &&
                        <div className="mt-3">
                            <Form.Check
                                type="radio"
                                label="Пользователь"
                                name="roleRadios"
                                value="USER"
                                checked={role === 'USER'}
                                onChange={() => setRole('USER')}
                            />
                            <Form.Check
                                type="radio"
                                label="Администратор"
                                name="roleRadios"
                                value="ADMIN"
                                checked={role === 'ADMIN'}
                                onChange={() => setRole('ADMIN')}
                            />
                        </div>
                    }

                    <Row className="d-flex justify-content-between mt-3 ps-3 pe-3">
                        <Col>
                            {isLogin ? (
                                <div>
                                    Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                                </div>
                            ) : (
                                <div>
                                    Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                                </div>
                            )}
                        </Col>
                        <Col xs="auto">
                            <Button variant="outline-success" onClick={click}>
                                {isLogin ? 'Войти' : 'Регистрация'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
