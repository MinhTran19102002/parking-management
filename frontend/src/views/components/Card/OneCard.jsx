import React from "react";
import { CustomedCard } from "./style";
import { Space, Typography, Row, Col } from "antd";
import { FormatNumber } from "~/services";
import Icon from "@ant-design/icons";
import Compared from "./Compared";

function OneCard({
  title,
  number,
  unit,
  description,
  classNames = {},
  className,
  disabledFormatNumber,
  icon,
  size = 1,
  comparePercentValue,
}) {
  const MainIcon = icon;
  return (
    <CustomedCard className={`bg h-100 py-3 px-2 ${className || ""}`}>
      <Space size={1}>
        {icon && (
          <Col className="">
            <MainIcon className="circle" style={{ fontSize: 24 }} />
          </Col>
        )}
        <Space direction="vertical" className="px-2" size={size}>
          <Row className={`w-100 ${classNames.header}`}>
            <Space>
              <Typography.Title level={3} className="card-header-title fw-500">
                {title}
              </Typography.Title>
            </Space>
          </Row>
          <Row className={`${classNames.body}`} gutter={[16, 8]}>
            <Col>
              <Space align="start" direction="vertical">
                <Typography.Title className="big" level={2}>
                  <span>
                    {disabledFormatNumber ? number : FormatNumber(number)}
                  </span>{" "}
                  <span style={{ fontSize: 16 }}>{unit}</span>
                </Typography.Title>
                {description}
              </Space>
            </Col>
          </Row>
        </Space>
      </Space>
      {comparePercentValue && (
        <div style={{ position: "absolute", right: 16, bottom: 4 }}>
          <Compared value={comparePercentValue} />
        </div>
      )}
    </CustomedCard>
  );
}

export default OneCard;
