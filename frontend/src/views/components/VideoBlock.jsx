import React from 'react';

function VideoBlock({}) {
  return (
    <video width="320" height="240" controls>
      <source src='rtmp://103.130.211.150:10050/stream' type="video/mp4" />
    </video>
  );
}

export default VideoBlock;
