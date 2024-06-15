import React from 'react';
import { Liquid } from '@ant-design/plots';

export default () => {
    const config = {
        percent: 0.25,
        outline: {
            border: 4,
            distance: 8,
        },
        wave: {
            length: 128,
        },
    };
    return <Liquid {...config} />;
};