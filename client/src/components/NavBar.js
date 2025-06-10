import React, { useContext, useState } from 'react';
import { Navbar, Nav, Button, Container, Form, FormControl, InputGroup } from 'react-bootstrap';
import { Context } from '../index';
import { useNavigate, useLocation } from 'react-router-dom';
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, BASKET_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';

const NavBar = observer(() => {
    const { user, device } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        device.setSearchTerm(value);  // Assume device store has setSearchTerm to filter devices by name
    };

    return (
        <Navbar
            style={{
                backgroundColor: '#f3f4f6', // Soft light gray background
                borderBottom: '1px solid #e5e7eb',
                position: 'sticky',
                top: 0,
                zIndex: 1020,
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
            }}
            expand="lg"
        >
            <Container style={{ maxWidth: 1300, display: 'flex', alignItems: 'center' }}>
                <Navbar.Brand
                    style={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '1.75rem',
                        color: '#111827',
                        userSelect: 'none',
                        letterSpacing: '-0.02em',
                        marginRight: '1.5rem',
                    }}
                    onClick={handleHomeClick}
                >
                    ТехноСфера
                </Navbar.Brand>

                {/* Search bar centered and flex-grow to fill space */}
                <Form className="d-none d-lg-flex flex-grow-1 mx-3" onSubmit={e => e.preventDefault()}>
                    <InputGroup>
                        <FormControl
                            placeholder="Поиск устройств по названию..."
                            aria-label="Поиск устройств"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                padding: '0.75rem 1rem',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                border: '1px solid #d1d5db',
                                transition: 'border-color 0.3s ease',
                            }}
                            onFocus={e => e.target.style.borderColor = '#3b82f6'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </InputGroup>
                </Form>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end mt-3 mt-lg-0">
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
                                    }}
                                >
                                    Корзина
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="rounded-pill px-4 py-2"
                                    onClick={logOut}
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '1rem',
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
