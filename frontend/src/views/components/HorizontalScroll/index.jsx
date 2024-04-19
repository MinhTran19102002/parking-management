import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { Button } from "antd";
import { CaretRightOutlined, CaretLeftOutlined } from "@ant-design/icons";
import usePreventBodyScroll from "./usePreventBodyScroll";
import Styler from "stylefire";
import { useMediaQuery } from "react-responsive";

function HorizontalScroll({ children, id }) {
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const [customAnimation, setCustomAnimation] = React.useState(false);
  const [duration, setDuration] = React.useState(80);
  const [ease, setEase] = React.useState("noEasing");
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  return (
    <div id={id} onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
      <ScrollMenu
        LeftArrow={!isMobile && LeftArrow}
        RightArrow={!isMobile && RightArrow}
        onWheel={onWheel}
        transitionDuration={duration} // NOTE: for transitions
        transitionEase={easingFunctions[ease]}
        transitionBehavior={customAnimation ? scrollBehavior : undefined}
      >
        {children}
      </ScrollMenu>
    </div>
  );
}

export default HorizontalScroll;

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <Arrow
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      icon={<CaretLeftOutlined style={{ fontSize: 32, opacity: 0.6 }} />}
    ></Arrow>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <Arrow
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      icon={<CaretRightOutlined style={{ fontSize: 32, opacity: 0.6 }} />}
    ></Arrow>
  );
}

function Arrow({ children, disabled, onClick, className, icon }) {
  const disabledStyle = disabled && {
    opacity: 0.4,
    pointerEvents: "none",
  };
  return (
    <div className="arrow-container h-100 py-2 px-2" style={{ height: "100%" }}>
      <Button
        onClick={onClick}
        className={`arrow-horizontal-scroll-btn arrow-${className} h-100 m-auto no-focus-visible`}
        icon={icon}
        size="large"
        style={{ ...disabledStyle }}
      />
    </div>
  );
}

function onWheel(apiObj, ev) {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

const scrollBehavior = (instructions) => {
  const [{ el, left }] = instructions;
  const styler = Styler(el);

  animate({
    from: el.scrollLeft,
    to: left,
    type: "spring",
    onUpdate: (left) => styler.set("scrollLeft", left),
  });
};

const easingFunctions = {
  noEasing: undefined,
  // no easing, no acceleration
  linear: (t) => t,
  // accelerating from zero velocity
  easeInQuad: (t) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // accelerating from zero velocity
  easeInQuint: (t) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  // Source https://gist.github.com/gre/1650294#file-easing-js
};
