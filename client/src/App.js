import React, { useContext, useState, useEffect } from 'react';
import AppRouter from "./components/AppRouter";
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import { check } from './http/userAPI'; 
import { Spinner } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = observer(() => {
  const {user} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    check().then(data =>  {
      user.setUser(data); // <-- сюда должен приходить id, email, role
      user.setIsAuth(true);
    }).finally(() => setLoading(false))
}, [])

  if (loading) {
    return <Spinner animation={'grow'} />
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;