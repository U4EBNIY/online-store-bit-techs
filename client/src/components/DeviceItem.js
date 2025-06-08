import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from '../utils/consts';
import { Col, Card, Image } from 'react-bootstrap';

const DeviceItem = observer(({ device }) => {
    const { device: deviceStore } = useContext(Context);
    const history = useNavigate();
    
    // Находим бренд по ID из общего списка брендов
    const brand = deviceStore.brands.find(b => b.id === device.brandId);
    
    return (
        <Col md={3} className={'mt-3'} onClick={() => history(DEVICE_ROUTE + '/' + device.id)}>
            <Card style={{ width: 150, cursor: 'pointer' }} border={'light'}>
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + device.img} />
                <div className='text-black-50 mt-1 d-flex' justify-content-between>
                    {brand ? brand.name : 'Бренд не указан'}
                </div>
                <div>
                    {device.name}
                </div>
            </Card>
        </Col>
    );
});

export default DeviceItem;