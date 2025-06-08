import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Context } from '../index';
import { NavLink, useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { BASKET_ROUTE } from '../utils/consts';


const NavBar = observer(() => {
  const { user, device } = useContext(Context);
  const navigate = useNavigate();

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem('token');
  };

  const handleHomeClick = () => {
    device.resetFilters();         // 💥 сброс фильтров
    navigate(SHOP_ROUTE);          // переход на /shop
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Button variant="link" className="text-white text-decoration-none p-0 fs-5" onClick={handleHomeClick}>
          Интернет-магазин - "Мир Техники"
        </Button>

        {user.isAuth ? (
          <Nav className="ms-auto" style={{ color: 'white' }}>
            {user.user.role === 'ADMIN' && (
              <Button variant={'outline-light'} onClick={() => navigate(ADMIN_ROUTE)}>Админ панель</Button>
            )}
            <Button variant={'outline-light'} className="ms-2" onClick={() => navigate(BASKET_ROUTE)}>
              Корзина
            </Button>
            <Button variant={'outline-light'} className="ms-2" onClick={logOut}>Выйти</Button>
          </Nav>
        ) : (
          <Nav className="ms-auto" style={{ color: 'white' }}>
            <Button variant={'outline-light'} onClick={() => navigate(LOGIN_ROUTE)}>Авторизация</Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
});

export default NavBar;