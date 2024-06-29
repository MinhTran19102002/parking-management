import {
  RetweetOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import React, { useContext } from "react";
import AppContext from "~/contexts";

function LayoutSetting({}) {
  const { state, actions } = useContext(AppContext);
  const { changeLayout } = state;
  const hanldeLayout = ({ key }) => {
    if (key === "reset") {
      actions.changeByType({
        type: "changeLayout",
        payload: { count: 1 + (changeLayout.count || 0), action: "reset" },
      });
    }
    if (key === "save") {
      actions.changeByType({
        type: "changeLayout",
        payload: { count: 1 + (changeLayout.count || 0), action: "save" },
      });
    }
  };
  return (
    <Dropdown
      menu={{
        items: [
          {
            label: "Lưu bố cục",
            icon: <SaveOutlined />,
            key: "save",
          },
          {
            label: "Đặt lại bố cục",
            icon: <RetweetOutlined />,
            key: "reset",
          },
        ],
        onClick: hanldeLayout,
      }}
    >
      <Button icon={<SettingOutlined />} type="text" />
    </Dropdown>
  );
}

export default LayoutSetting;
