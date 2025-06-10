import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, Card, Container, Form, Alert } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { registration, login } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import ReCAPTCHA from 'react-google-recaptcha';
import './Auth.css';

// Функция для создания промиса с таймаутом
const withTimeout = (promise, timeout = 8000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Превышено время ожидания от сервера')), timeout)
    )
  ]);
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // Ref to the scrollable container to disable scrolling
  const containerRef = useRef(null);

  useEffect(() => {
    // Disable scrolling on the entire document to remove scrollbar for auth page
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const click = async () => {
    try {
      if (loginAttempts >= 2 && !captchaValue) {
        setError('Пожалуйста, подтвердите, что вы не робот');
        return;
      }

      setIsLoading(true);
      setError(null);
      
      let data;
      const request = isLogin 
        ? login(email, password) 
        : registration(email, password, role);

      // Добавляем таймаут к запросу
      data = await withTimeout(request);

      user.setUser(data);
      user.setIsAuth(true);
      navigate(SHOP_ROUTE);
    } catch (e) {
      setLoginAttempts(prev => prev + 1);
      setError(e.response?.data?.message || e.message || 
        (isLogin ? 'Ошибка входа' : 'Ошибка регистрации'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    // Just navigate to shop without changing auth state
    navigate(SHOP_ROUTE);
  };

  return (
    <div className="auth-background">
      <Container
        ref={containerRef}
        className="d-flex justify-content-center align-items-start min-vh-100"
        style={{ maxWidth: '1200px', overflow: 'hidden', paddingTop: '12rem', paddingBottom: '3rem' }}
      >
        <Card className="auth-card shadow-lg">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="auth-title">{isLogin ? 'Вход' : 'Регистрация'}</h2>
            </div>

            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}

            <Form className="auth-form">
              <Form.Group className="mb-3">
                <Form.Control
                  className="auth-input"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  autoComplete="username"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="password-input-group">
                  <Form.Control
                    className="auth-input"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <Button 
                    variant="link" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                </div>
              </Form.Group>

              {!isLogin && (
                <Form.Group className="mb-3">
                  <div className="d-flex gap-2">
                    <Button
                      variant={role === 'USER' ? 'primary' : 'outline-secondary'}
                      onClick={() => setRole('USER')}
                      className="flex-grow-1"
                    >
                      Пользователь
                    </Button>
                    <Button
                      variant={role === 'ADMIN' ? 'primary' : 'outline-secondary'}
                      onClick={() => setRole('ADMIN')}
                      className="flex-grow-1"
                    >
                      Администратор
                    </Button>
                  </div>
                </Form.Group>
              )}

              {isLogin && loginAttempts >= 2 && (
                <div className="mb-3">
                  <ReCAPTCHA
                    sitekey="6LfCyFkrAAAAAMYR4D_UmTKyyZb1UXWgEONhJXRo"
                    onChange={handleCaptchaChange}
                  />
                </div>
              )}

              <Button
                variant="primary"
                onClick={click}
                disabled={isLoading}
                className="w-100 mb-3 auth-submit-btn"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    {isLogin ? 'Вход...' : 'Регистрация...'}
                  </>
                ) : isLogin ? 'Войти' : 'Зарегистрироваться'}
              </Button>

              {isLogin && (
                <Button
                  variant="outline-secondary"
                  onClick={handleGuestLogin}
                  className="w-100 mb-3"
                  style={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'background-color 0.3s, color 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  Войти как гость
                </Button>
              )}

              <div className="text-center mt-3">
                {isLogin ? (
                  <>
                    Нет аккаунта?{' '}
                    <NavLink to={REGISTRATION_ROUTE} className="auth-link">
                      Зарегистрируйтесь
                    </NavLink>
                  </>
                ) : (
                  <>
                    Уже есть аккаунт?{' '}
                    <NavLink to={LOGIN_ROUTE} className="auth-link">
                      Войдите
                    </NavLink>
                  </>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
});

export default Auth;
