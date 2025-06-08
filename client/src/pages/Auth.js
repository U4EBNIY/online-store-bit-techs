import React, { useContext, useState } from 'react';
import { Button, Card, Container, Row, Form, Col } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { registration, login } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import ReCAPTCHA from 'react-google-recaptcha';

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const click = async () => {
    try {
      if (loginAttempts >= 2 && !captchaValue) {
        alert("Пожалуйста, пройдите капчу");
        return;
      }

      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password, role);
      }
      user.setUser(data);
      user.setIsAuth(true);
      navigate(SHOP_ROUTE);
    } catch (e) {
      setLoginAttempts(prev => prev + 1);
      alert(e.response?.data?.message || "Ошибка входа");
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
          {!isLogin && (
            <Form.Group className="mt-3">
              <Form.Label>Выберите роль:</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Пользователь"
                  name="role"
                  type="radio"
                  value="USER"
                  checked={role === 'USER'}
                  onChange={e => setRole(e.target.value)}
                />
                <Form.Check
                  inline
                  label="Админ"
                  name="role"
                  type="radio"
                  value="ADMIN"
                  checked={role === 'ADMIN'}
                  onChange={e => setRole(e.target.value)}
                />
              </div>
            </Form.Group>
          )}

          {isLogin && loginAttempts >= 2 && (
            <div className="mt-3">
              <ReCAPTCHA
                sitekey="6LfCyFkrAAAAAMYR4D_UmTKyyZb1UXWgEONhJXRo" // <-- замени на ключ от Google reCAPTCHA
                onChange={handleCaptchaChange}
              />
            </div>
          )}

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

            <Col xs="auto" className="d-flex flex-column gap-2">
            <Button variant="outline-success" onClick={click}>
                {isLogin ? 'Войти' : 'Регистрация'}
            </Button>

            {isLogin && (
                <Button
                variant="secondary"
                onClick={() => navigate(SHOP_ROUTE)}
                >
                Войти как гость
                </Button>
            )}
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
