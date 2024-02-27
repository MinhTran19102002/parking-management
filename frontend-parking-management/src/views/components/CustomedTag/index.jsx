import { Tag, theme } from 'antd';
import React from 'react';

function CustomedTag({ children, entity, entityType, size = 'normal', ...restProps }) {
  const { token } = theme.useToken();
  let color, backgroundColor;

  let fontSize = 20;
  switch (size) {
    case 'small':
      fontSize = 18;
      break;
    case 'large':
      fontSize = 22;
      break;
  }

  const borderRadius = entityType === 'zone' ? false : 50;
  let padding;

  if (entityType === 'zone') {
    switch (entity) {
      case 'A':
        color = token['purple'];
        backgroundColor = token['purple2'];
        break;
      case 'B':
        color = token['magenta'];
        backgroundColor = token['magenta2'];
        break;
      case 'C':
        color = token['orange7'];
        backgroundColor = token['orange2'];
        break;
    }

    padding = '1px 8px';
  } else {
    color = token['colorBgBase'];
    switch (entity) {
      case 'in':
        backgroundColor = token.event.entry[0];
        break;
      case 'out':
        backgroundColor = token.event.exit[0];
        break;
      default:
        backgroundColor = token.event[entity][0];
    }

    fontSize = 14;
    padding = '1px 12px';
  }

  return (
    <Tag {...restProps} style={{ borderRadius, color, backgroundColor, fontSize, padding }}>
      {children}
    </Tag>
  );
}

export default CustomedTag;
