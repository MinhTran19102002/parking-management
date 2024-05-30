import React, { useEffect, useRef } from 'react';

function VideoBlock({}) {
  const hlsUrl = 'http://localhost:8000/output.m3u8';

  return (
    <ReactHlsPlayer
      hlsConfig={{
        fetchSetup: function (context, initParams) {
          // Always send cookies, even for cross-origin calls.
          initParams.credentials = 'include';
          return new Request(context.url, initParams);
        }
      }}
      src={hlsUrl}
      autoPlay={true}
      controls={true}
      width={320}
      height={500}
    />
  );
}

export default VideoBlock;
