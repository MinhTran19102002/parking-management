import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Layout, Flex, Radio, theme, Typography, Tag, Spin, Skeleton, Space, Button } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { DetailFloorStyled, TransformBlock } from './style';
import { MapInteractionCSS } from 'react-map-interaction';
import { useSearchParams } from 'react-router-dom';
import { SLOTS_A } from './parkingA';
import { SLOTS_B } from './parkingB';
import { SLOTS_C } from './parkingC';
import CarA from '~/assets/images/blue-car.png';
import CarB from '~/assets/images/blue-car.png';
import CarC from '~/assets/images/blue-car.png';
import MapA from '~/assets/images/mapA.svg?react';
import MapB from '~/assets/images/mapB.svg?react';
import MapC from '~/assets/images/mapC.svg?react';
import MapA1 from '~/assets/images/mapA1.svg?react';
import MapB1 from '~/assets/images/mapB1.svg?react';
import MapC1 from '~/assets/images/mapC1.svg?react';
import Moto from '~/assets/images/TealMoto.svg?react';
import dayjs from 'dayjs';
import DetailSlot from './DetailSlot';
import AppContext from '~/context';
import { ParkingApi } from '~/api';
import CameraLayer from './CameraLayer';
import { SettingOutlined } from '@ant-design/icons';
import VehicleLayer from './VehicleLayer';
import { DISABLED_MAP_INTERACTION } from './data';
import CameraSide from './CameraSide';

function Map({}) {
  const { token } = theme.useToken();
  const { colorBgContainer } = token;
  const { state, actions } = useContext(AppContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [slots, setSlots] = useState([]);
  const zone = searchParams.get('zone') || 'A';
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);
  const [settingMode, setSettingMode] = useState(false);
  const onChangeZone = (e) => {
    setSearchParams({ zone: e.target.value });
  };

  const callApi = async () => {
    try {
      setLoading(true);
      const api = await ParkingApi.getStatus({ zone });
      const newSlots = api[0].slots;
      setSlots(newSlots);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callApi();
  }, [state.parkingEvent]);

  useEffect(() => {
    callApi();
  }, [zone]);

  const hanldeMapSetting = useCallback(() => {});

  console.log(settingMode);

  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Bản đồ'} />
      <Content className="w-100 py-3">
        <Flex justify="space-between">
          <Radio.Group defaultValue={zone} buttonStyle="solid" onChange={onChangeZone}>
            <Radio.Button value="A">Khu A</Radio.Button>
            <Radio.Button value="A1">Khu A1</Radio.Button>
            <Radio.Button value="B">Khu B</Radio.Button>
            <Radio.Button value="B1">Khu B1</Radio.Button>
            <Radio.Button value="C">Khu C</Radio.Button>
            <Radio.Button value="C1">Khu C1</Radio.Button>
          </Radio.Group>
          {!settingMode ? (
            <Button icon={<SettingOutlined />} onClick={() => setSettingMode(true)}>
              Cài đặt
            </Button>
          ) : (
            <Space>
              <Button onClick={() => setSettingMode(false)}>Hủy bỏ</Button>
              <Button type="primary" onClick={hanldeMapSetting}>
                Xác nhận
              </Button>
            </Space>
          )}
        </Flex>
        <TransformBlock
          className="mt-2 overflow-hidden"
          style={{ backgroundColor: token.neutral5 }}>
          <Spin spinning={loading} wrapperClassName="h-100 w-100">
            <MapInteractionCSS
              {...DISABLED_MAP_INTERACTION(settingMode)}
              minScale={0.4}
              maxScale={2}>
              <div className="map-wrapper">
                <VehicleLayer slots={slots} zone={zone} />
                <CameraLayer zone={zone} />
                {useMemo(() => {
                  if (zone === 'A') return <MapA />;
                  else if (zone === 'B') return <MapB />;
                  else if (zone === 'C') return <MapC />;
                  else if (zone === 'A1') return <MapA1 />;
                  else if (zone === 'B1') return <MapB1 />;
                  else if (zone === 'C1') return <MapC1 />;
                }, [zone])}
              </div>
            </MapInteractionCSS>
          </Spin>
        </TransformBlock>
        <CameraSide />
      </Content>
      <Footer />
    </Layout>
  );
}

export default Map;
