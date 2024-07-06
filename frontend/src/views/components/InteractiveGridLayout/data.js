export const LOCAL_KEY = 'EmsLayouts';

const DefaultLayout = {
  Dashboard: {
    xxl: [
      { w: 4, h: 4, x: 0, y: 0, i: 'card0' },
      { w: 4, h: 4, x: 4, y: 0, i: 'card1' },
      { w: 4, h: 4, x: 8, y: 0, i: 'card2' },
      { w: 12, h: 4, x: 0, y: 4, i: 'card3' },
      { w: 12, h: 5, x: 0, y: 8, i: 'card4' }
    ],
    xl: [
      { w: 4, h: 3, x: 0, y: 0, i: 'card0' },
      { w: 4, h: 3, x: 4, y: 0, i: 'card1' },
      { w: 4, h: 3, x: 8, y: 0, i: 'card2' },
      { w: 12, h: 3, x: 0, y: 3, i: 'card3' },
      { w: 12, h: 4, x: 0, y: 6, i: 'card4' }
    ],
    lg: [
      { w: 4, h: 3, x: 0, y: 0, i: 'card0' },
      { w: 4, h: 3, x: 4, y: 0, i: 'card1' },
      { w: 4, h: 3, x: 8, y: 0, i: 'card2' },
      { w: 12, h: 3, x: 0, y: 3, i: 'card3' },
      { w: 12, h: 3, x: 0, y: 6, i: 'card4' }
    ],
    md: [
      { w: 4, h: 3, x: 0, y: 0, i: 'card0' },
      { w: 4, h: 3, x: 4, y: 0, i: 'card1' },
      { w: 4, h: 3, x: 8, y: 0, i: 'card2' },
      { w: 12, h: 3, x: 0, y: 6, i: 'card3' },
      { w: 12, h: 3, x: 0, y: 3, i: 'card4' }
    ],
    sm: [
      { w: 3, h: 3, x: 0, y: 0, i: 'card0' },
      { w: 3, h: 3, x: 3, y: 0, i: 'card1' },
      { w: 6, h: 3, x: 0, y: 3, i: 'card2' },
      { w: 6, h: 3, x: 0, y: 6, i: 'card3' },
      { w: 6, h: 3, x: 0, y: 9, i: 'card4' }
    ],
    xs: [
      { w: 4, h: 2, x: 0, y: 0, i: 'card0' },
      { w: 4, h: 3, x: 0, y: 2, i: 'card1' },
      { w: 4, h: 3, x: 0, y: 5, i: 'card2' },
      { w: 4, h: 3, x: 0, y: 8, i: 'card3' },
      { w: 4, h: 4, x: 0, y: 11, i: 'card4' }
    ]
  },
  Report: {
    xxl: [
      { w: 7, h: 4, x: 0, y: 0, i: 'card0' },
      { w: 3, h: 4, x: 7, y: 0, i: 'card1' },
      { w: 7, h: 3, x: 3, y: 4, i: 'card2' },
      { w: 3, h: 3, x: 0, y: 4, i: 'card3' },
      { w: 2, h: 7, x: 10, y: 0, i: 'card4' },
      { w: 12, h: 4, x: 0, y: 7, i: 'card5' }
    ],
    xl: [
      { w: 8, h: 4, x: 0, y: 0, i: 'card0' },
      { w: 4, h: 4, x: 8, y: 0, i: 'card1' },
      { w: 5, h: 3, x: 4, y: 4, i: 'card2' },
      { w: 4, h: 3, x: 0, y: 4, i: 'card3' },
      { w: 3, h: 6, x: 9, y: 4, i: 'card4' },
      { w: 9, h: 3, x: 0, y: 7, i: 'card5' }
    ],
    lg: [
      { w: 12, h: 4, x: 0, y: 0, i: 'card0' },
      { w: 4, h: 3, x: 5, y: 4, i: 'card1' },
      { w: 9, h: 3, x: 0, y: 7, i: 'card2' },
      { w: 5, h: 3, x: 0, y: 4, i: 'card3' },
      { w: 3, h: 6, x: 9, y: 4, i: 'card4' },
      { w: 12, h: 3, x: 0, y: 10, i: 'card5' }
    ],
    md: [
      { w: 12, h: 4, x: 0, y: 0, i: 'card0' },
      { w: 12, h: 3, x: 0, y: 4, i: 'card1' },
      { w: 12, h: 3, x: 0, y: 7, i: 'card2' },
      { w: 12, h: 3, x: 0, y: 13, i: 'card3' },
      { w: 12, h: 3, x: 0, y: 10, i: 'card4' },
      { w: 12, h: 3, x: 0, y: 16, i: 'card5' }
    ],
    sm: [
      { w: 3, h: 3, x: 0, y: 0, i: 'card0' },
      { w: 3, h: 3, x: 3, y: 0, i: 'card1' },
      { w: 6, h: 3, x: 0, y: 3, i: 'card2' },
      { w: 6, h: 3, x: 0, y: 6, i: 'card3' },
      { w: 6, h: 3, x: 0, y: 9, i: 'card4' },
      { w: 1, h: 1, x: 0, y: 12, i: 'card5' }
    ],
    xs: [
      { w: 4, h: 2, x: 0, y: 0, i: 'card0' },
      { w: 4, h: 3, x: 0, y: 2, i: 'card1' },
      { w: 4, h: 3, x: 0, y: 5, i: 'card2' },
      { w: 4, h: 3, x: 0, y: 8, i: 'card3' },
      { w: 4, h: 4, x: 0, y: 11, i: 'card4' }
    ]
  }
};

const Layouts = (
  Dl = {},
  breakpoints = { xxl: 1600, xl: 1200, lg: 992, md: 768, sm: 576, xs: 0 }
) => {
  const rs = Object.keys(breakpoints).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: Dl[curr] || []
    };
  }, {});
  return rs;
};

export const GetDefaultLayouts = (layoutKey) => {
  return Layouts(DefaultLayout[layoutKey]);
};

export const GetLayouts = (layoutKey) => {
  // Get from localStorage
  const localLayouts = JSON.parse(localStorage.getItem(LOCAL_KEY)) || {};
  const defaultByKey = DefaultLayout[layoutKey];
  const layoutByKey = localLayouts[layoutKey];
  const rs = {
    ...defaultByKey,
    ...layoutByKey
  };
  if (layoutByKey && typeof layoutByKey === 'object') return Layouts(rs);
  return GetDefaultLayouts(layoutKey);
};
