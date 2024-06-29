import React, { useContext, useEffect, useMemo, useState } from "react";
import { GetDefaultLayouts, GetLayouts, LOCAL_KEY } from "./data";
import AppContext from "~/contexts";
import { ResponsiveGridLayoutStyled } from "./style";
import { useTranslation } from "react-i18next";

let didmount = false;
function InteractiveGridLayout({
  layoutKey,
  containerPadding = [0, 0],
  margin = [8, 8],
  rowHeight = 30,
  breakpoints = { xxl: 1600, xl: 1200, lg: 992, md: 768, sm: 576, xs: 0 },
  cols = { xxl: 12, xl: 12, lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 },
  children,
  className,
  ...props
}) {
  const { state } = useContext(AppContext);
  const { changeLayout } = state;
  const [layouts, setLayouts] = useState(GetLayouts(layoutKey));

  useEffect(() => {
    if (didmount) {
      if (changeLayout.action === "reset") {
        onReset();
      }
      if (changeLayout.action === "save") {
        onSaveLayouts();
      }
    }
  }, [JSON.stringify(changeLayout)]);

  const config = {
    containerPadding,
    margin,
    rowHeight,
    breakpoints,
    cols,
    ...props,
  };

  const onSaveLayouts = () => {
    const oldData = JSON.parse(localStorage.getItem(LOCAL_KEY)) || {};
    const newData = {
      ...oldData,
      [layoutKey]: layouts,
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newData));
  };

  const onWidthChange = (containerWidth) => {};

  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  const onReset = () => {
    setLayouts(GetDefaultLayouts(layoutKey));
  };

  useEffect(() => {
    didmount = true;
    return () => {
      didmount = false;
    };
  }, []);

  useEffect(() => {
    onReset();
  }, [localStorage.getItem("collapsed")]);

  return (
    <div>
      <ResponsiveGridLayoutStyled
        onLayoutChange={onLayoutChange}
        onWidthChange={onWidthChange}
        className={`layout ${className}`}
        draggableCancel=".ant-typography"
        layouts={Object.keys(layouts).reduce((acc, curr, ix) => {
          const obj = layouts[curr].map((el, index) => {
            delete el.moved;
            delete el.static;
            return {
              ...el,
              i: `card${index}`,
            };
          });

          return {
            ...acc,
            [curr]: obj,
          };
        }, {})}
        {...config}
      >
        {children}
      </ResponsiveGridLayoutStyled>
    </div>
  );
}

export default InteractiveGridLayout;
