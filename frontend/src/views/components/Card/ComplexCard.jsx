import React from "react";
import { Col, Divider, Row, Space, Typography } from "antd";
import { FormatNumber } from "~/services";
import { InnerCard, CustomedCard } from "./style";
import Icon from "@ant-design/icons";
// body: {icon, label, value, unit}

function ComplexCard({
  title,
  bodys = [],
  width = 230,
  value,
  classNames = {},
  size = 1,
  numberSize = 18,
  className = "",
  styles = { header: {}, body: {} },
  numberStyle,
  labelStyle,
}) {
  return (
    <CustomedCard className={`h-100 bg ${className}`}>
      <Row
        className={`card-header border-bottom ${classNames.header || ""} ${
          !title ? "d-none" : ""
        }`}
        style={styles.header}
      >
        <Typography.Title level={3} className="card-header-title fw-500">
          {title}
        </Typography.Title>
      </Row>
      <Row
        className={`card-body py-2 ${classNames.body || ""}`}
        style={styles.body}
      >
        <Space className="w-100" size={8 * size} direction="vertical">
          {bodys.map((innerItem, ix) => {
            const RowIcon = innerItem.icon;
            return (
              <InnerCard key={"complex-inner" + ix}>
                <Row className="card-inner-header">
                  <Space>
                    <Icon
                      component={RowIcon}
                      className="circle"
                      style={{ fontSize: 20 }}
                    />
                    <Typography.Title
                      level={4}
                      type="primary"
                      className="card-header-title"
                    >
                      {innerItem.title}
                    </Typography.Title>
                  </Space>
                </Row>

                <Space
                  className="card-inner-body py-2 px-2 w-100"
                  direction="vertical"
                  size={size}
                  split={<Divider />}
                >
                  {innerItem.body.map((item, ix) => {
                    return (
                      <div
                        className="card-inner-body-item"
                        style={{
                          padding: `${size * 4}px ${size * 8}px`,
                          height: "100%",
                        }}
                      >
                        <Space
                          className="c w-100"
                          direction="vertical"
                          size={size}
                        >
                          <Typography.Title level={5} type="secondary">
                            {item.label}
                          </Typography.Title>
                          <Typography.Title
                            style={{ fontSize: numberSize }}
                            level={2}
                          >
                            <span style={numberStyle}>
                              {item.disabledFormatNumber
                                ? item.value
                                : FormatNumber(item.value)}
                            </span>{" "}
                            <span style={{ fontSize: numberSize * 0.8 }}>
                              {item.unit}
                            </span>
                          </Typography.Title>
                        </Space>
                      </div>
                    );
                  })}
                </Space>
              </InnerCard>
            );
          })}
        </Space>
      </Row>
    </CustomedCard>
  );
}

export default ComplexCard;
