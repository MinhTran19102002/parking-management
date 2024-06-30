import { SmoothChart } from "~/shared/common";
import React from "react";
import { Gauge } from "@ant-design/plots";
import { useRef } from "react";
import { BlockHalfChart, FooterStyled } from "./style";
import { FormatNumber } from "~/services";

export default ({ percent, footer }) => {
  const parent = useRef();

  if (percent == 100) {
    percent = Number.parseInt(percent);
  }

  return (
    <SmoothChart>
      <BlockHalfChart ref={parent}></BlockHalfChart>
    </SmoothChart>
  );
};
