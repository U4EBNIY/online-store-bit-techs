import React, { useContext } from 'react';
import { authRoutes, publicRoutes } from '../routes';
import { LOGIN_ROUTE, SHOP_ROUTE } from '../utils/consts';

import {Routes, Route, Navigate} from 'react-router-dom';
import {Context} from "../index";
import { observer } from 'mobx-react-lite';

const AppRouter = observer(() => {
    const {user} = useContext(Context);
    return (
        <Routes>
           {user.isAuth && authRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component/>} exact />
           ))}
           {publicRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component/>} exact />
           ))}
           <Route path="*" element={<Navigate to={user.isAuth ? SHOP_ROUTE : LOGIN_ROUTE} />}/>
        </Routes>
     );
});

export default AppRouter;
