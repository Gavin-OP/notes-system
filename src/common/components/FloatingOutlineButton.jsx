import { useState } from "react";
import { useSelector } from "react-redux";

import { Drawer, FloatButton } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";

import OutlineSider from "./OutlineSider";
import "./FloatingOutlineButton.css";

const FloatingOutlineButton = ({ outline, visible }) => {
  const language = useSelector((state) => state.preference.language);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerTitle = language === "cn" ? "大纲" : "Outline";

  return (
    <>
      {/* Floating button */}
      <FloatButton
        icon={<UnorderedListOutlined />}
        onClick={() => setDrawerOpen(true)}
        className={`floating-outline-button ${visible ? "" : "floating-outline-button--hidden"}`}
      />

      {/* Drawer for outline */}
      <Drawer
        title={drawerTitle}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="floating-outline-drawer"
        destroyOnClose={true}
      >
        <OutlineSider
          outline={outline}
          collapsed={false}
          onCollapse={() => setDrawerOpen(false)}
          hideHeader={true}
        />
      </Drawer>
    </>
  );
};

export default FloatingOutlineButton;
