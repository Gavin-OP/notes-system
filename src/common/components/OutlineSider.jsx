import { Anchor } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import "./OutlineSider.css";

/** Build nested Anchor items from flat outline (preserves h3/h4 under h2, etc.) */
function buildAnchorItems(outline) {
  if (!outline?.length) return [];
  const stack = [{ level: 0, children: [] }];
  for (const item of outline) {
    const anchorItem = {
      key: item.id || `outline-${item.level}-${item.text}`,
      href: item.id ? `#${item.id}` : undefined,
      title: (
        <span className="outline-sider__item" data-level={item.level}>
          {item.text}
        </span>
      ),
      children: [],
    };
    while (stack.length > 1 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(anchorItem);
    stack.push({ level: item.level, children: anchorItem.children });
  }
  function dropEmptyChildren(arr) {
    return arr.map(({ children, ...rest }) =>
      children?.length ? { ...rest, children: dropEmptyChildren(children) } : rest
    );
  }
  return dropEmptyChildren(stack[0].children);
}

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
      
      {/* Outline content - use nested structure so all heading levels (incl. h3) display */}
      <Anchor
        affix={true}
        className="outline-sider__anchor"
        items={buildAnchorItems(outline)}
      />
    </div>
  );
};

export default OutlineSider;
