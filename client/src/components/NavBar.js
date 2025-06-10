import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Context } from '../index';
import { useNavigate, useLocation } from 'react-router-dom';
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, BASKET_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';

const NavBar = observer(() => {
    const { user, device } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
        navigate(SHOP_ROUTE);
    };

    const handleHomeClick = () => {
        if (location.pathname === LOGIN_ROUTE || location.pathname === REGISTRATION_ROUTE) {
            return;
        }
        device.resetFilters();
        navigate(SHOP_ROUTE);
    };

    return (
        <Navbar
            bg="#f0f2f5" // Changed background color to a slightly darker light gray
            variant="light"
            expand="lg"
            className="shadow-sm py-3"
            style={{
                borderBottom: '1px solid #e5e7eb',
                position: 'sticky',
                top: 0,
                zIndex: 1020,
            }}
        >
            <Container style={{ maxWidth: 1300 }}>
                <Navbar.Brand
                    style={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '1.75rem',
                        color: '#111827', // Darker gray almost black for strong visual hierarchy
                        userSelect: 'none',
                        letterSpacing: '-0.02em',
                    }}
                    onClick={handleHomeClick}
                >
                    ТехноСфера
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav style={{ alignItems: 'center', gap: '0.75rem' }}>
                        {user.isAuth ? (
                            <>
                                {user.user.role === 'ADMIN' && (
                                    <Button
                                        variant="outline-primary"
                                        className="rounded-pill px-4 py-2"
                                        onClick={() => navigate(ADMIN_ROUTE)}
                                        style={{
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            transition: 'background-color 0.3s, color 0.3s',
                                        }}
                                    >
                                        Админ Панель
                                    </Button>
                                )}
                                <Button
                                    variant="outline-primary"
                                    className="rounded-pill px-4 py-2"
                                    onClick={() => navigate(BASKET_ROUTE)}
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        position: 'relative',
                                        transition: 'background-color 0.3s, color 0.3s',
                                    }}
                                >
                                    Корзина
                                    {/* Example badge placement if needed */}
                                    {/* <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: '0.7rem' }}
                                    >
                                        3
                                    </span> */}
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="rounded-pill px-4 py-2"
                                    onClick={logOut}
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        transition: 'background-color 0.3s, color 0.3s',
                                    }}
                                >
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                className="rounded-pill px-4 py-2"
                                onClick={() => navigate(LOGIN_ROUTE)}
                                style={{
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                    transition: 'background-color 0.3s, color 0.3s',
                                }}
                            >
                                Авторизация
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;
