import React, { useEffect, useRef } from 'react';
import ReactHlsPlayer from 'react-hls-player';

function VideoBlock({ src }) {
  return <ReactHlsPlayer src={src} autoPlay={true} controls={true} width={'100%'} />;
}

export default VideoBlock;
