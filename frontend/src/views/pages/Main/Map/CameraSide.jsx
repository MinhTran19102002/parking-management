import React, { useState } from 'react';
import { CameraSidebarStyled } from './style';
import { Button, Flex, Space } from 'antd';
import { CameraOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

function CameraSide({ defaultExpand = true }) {
  const [expand, setExpand] = useState(defaultExpand);
  
  return (
    <CameraSidebarStyled>
      <Button icon={<CameraOtlined />} onClick={() => setExpand((prev) => !prev)}>
        <Space>
          Danh sách camera{' '}
          {expand ? (
            <CaretDownOutlined style={{ margin: 'auto' }} />
          ) : (
            <CaretUpOutlined style={{ margin: 'auto' }} />
          )}
        </Space>
      </Button>
      <div className="fixed-block-content mt-2" style={{display: expand ? 'block' : 'none'}}>
        <img src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn//News/1502427//camera-giam-sat-11-800x450.jpg"></img>
      </div>
    </CameraSidebarStyled>
  );
}F

export default CameraSide;
