import { useState } from "react";
import { Drawer, FloatButton } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import OutlineSider from "./OutlineSider";
import "./FloatingOutlineButton.css";

const FloatingOutlineButton = ({ outline, visible }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const language = useSelector((state) => state.preference.language);
  
  const drawerTitle = language === "cn" ? "大纲" : "Outline";
  const buttonTooltip = language === "cn" ? "查看大纲" : "View Outline";
  
  return (
    <>
      {/* Floating button */}
      <FloatButton
        icon={<UnorderedListOutlined />}
        tooltip={buttonTooltip}
        onClick={() => setDrawerOpen(true)}
        className={`floating-outline-button ${visible ? '' : 'floating-outline-button--hidden'}`}
      />
      
      {/* Drawer for outline */}
      <Drawer
        title={drawerTitle}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="floating-outline-drawer"
        width="80%"
      >
        <OutlineSider 
          outline={outline}
          collapsed={false}
          onCollapse={() => setDrawerOpen(false)}
        />
      </Drawer>
    </>
  );
};

export default FloatingOutlineButton;

