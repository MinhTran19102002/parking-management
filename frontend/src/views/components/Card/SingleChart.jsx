import React from "react";
import { SingleChartStyled } from "./style";
import { Col, Divider, Row, Space, Typography } from "antd";

function SingleChart({ title, body }) {
  return (
    <SingleChartStyled className="h-100">
      <Row className="single-card-header">
        <Typography.Title level={3} className="single-card-header-title fw-500">
          {title}
        </Typography.Title>
      </Row>
      <Row className="single-card-body">{body}</Row>
    </SingleChartStyled>
  );
}

export default SingleChart;
