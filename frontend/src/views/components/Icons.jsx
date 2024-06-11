import Icon from '@ant-design/icons';
import React from 'react';
import SunOutlinedSVG from '~/assets/icons/SunOutlined.svg?react';
import MoonOutlinedSVG from '~/assets/icons/MoonOutlined.svg?react';

export const SunOutlined = (props) => <Icon component={SunOutlinedSVG} {...props} />;
export const MoonOutlined = (props) => <Icon component={MoonOutlinedSVG} {...props} />;
