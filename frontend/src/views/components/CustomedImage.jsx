import React from 'react';
import { Image } from 'antd';
function CustomedImage({ src, ...props }) {
  return <Image {...props} src={src} />;
}

export default CustomedImage;
