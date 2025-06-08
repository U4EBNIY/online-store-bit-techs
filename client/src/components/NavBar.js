import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import {Context} from '../index';
import { NavLink } from 'react-router-dom';
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from '../utils/consts';
import {observer} from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

const NavBar = observer(() => {
    const {user}  = useContext(Context);
    const history = useNavigate();

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <NavLink style={{color: 'white'}} to={SHOP_ROUTE}>Интернет-магазин "Бытовая техника"</NavLink>
                {user.isAuth ?
                <Nav className="ms-auto" style={{color: 'white'}}>
                    <Button variant={'outline-light'} onClick={() => history(ADMIN_ROUTE)}>Админ панель</Button>
                    <Button variant={'outline-light'} onClick={() => logOut()} className="ms-2">Выйти</Button>
                </Nav>
                :
                <Nav className="ms-auto" style={{color: 'white'}}>
                    <Button variant={'outline-light'} onClick={() => history(LOGIN_ROUTE)}>Авторизация</Button>
                </Nav>
                }   
            </Container>
        </Navbar>
  );
});

export default NavBar;