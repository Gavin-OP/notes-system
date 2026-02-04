import { Anchor } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import "./OutlineSider.css";

const OutlineSider = ({ outline, collapsed, onCollapse, hideHeader = false }) => {
  const language = useSelector((state) => state.preference.language);
  
  const outlineTitle = language === "cn" ? "大纲" : "Outline";
  const collapseTitle = language === "cn" ? "收起大纲" : "Collapse Outline";
  const expandTitle = language === "cn" ? "展开大纲" : "Expand Outline";
  
  // Show compact trigger button when collapsed
  if (collapsed) {
    return (
      <div className="outline-sider-wrapper outline-sider-wrapper--collapsed">
        <div className="outline-sider__trigger">
          <LeftOutlined 
            className="outline-sider__trigger-icon"
            onClick={onCollapse}
            title={expandTitle}
          />
          <span className="outline-sider__trigger-text">{outlineTitle}</span>
        </div>
      </div>
    );
  }
  
  // Show full outline when expanded
  return (
    <div className={`outline-sider-wrapper ${hideHeader ? 'outline-sider-wrapper--no-header' : ''}`}>
      {/* Header with collapse button - hide in drawer mode */}
      {!hideHeader && (
        <div className="outline-sider__header">
          <span className="outline-sider__title">{outlineTitle}</span>
          <RightOutlined 
            className="outline-sider__collapse-icon"
            onClick={onCollapse}
            title={collapseTitle}
          />
        </div>
      )}
      
      {/* Outline content */}
      <Anchor
        affix={true}
        className="outline-sider__anchor"
        items={outline.map((item) => ({
          key: item.id,
          href: `#${item.id}`,
          title: (
            <span 
              className="outline-sider__item"
              data-level={item.level}
            >
              {item.text}
            </span>
          ),
        }))}
      />
    </div>
  );
};

export default OutlineSider;
