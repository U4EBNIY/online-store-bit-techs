import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password, role) => {
    const {data} = await $host.post('api/user/registration', {email, password, role});
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);  // возвращаем декодированный токен с ролью и прочим
}


export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password});
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth');
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
}