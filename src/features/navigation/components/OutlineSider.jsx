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
      children?.length ? { ...rest, children: dropEmptyChildren(children) } : rest,
    );
  }
  return dropEmptyChildren(stack[0].children);
}

const OutlineSider = ({ outline, collapsed, onCollapse, hideHeader = false }) => {
  const language = useSelector((state) => state.preference.language);

  const outlineTitle = language === "cn" ? "大纲" : "Outline";
  const collapseTitle = language === "cn" ? "收起大纲" : "Collapse outline";
  const expandTitle = language === "cn" ? "展开大纲" : "Expand outline";
  const emptyLabel =
    language === "cn" ? "此页暂无标题大纲。" : "No headings on this page yet.";

  if (collapsed) {
    return (
      <div className="outline-sider-wrapper outline-sider-wrapper--collapsed">
        <button
          type="button"
          className="outline-sider__trigger"
          onClick={onCollapse}
          aria-label={expandTitle}
          title={expandTitle}
        >
          <LeftOutlined className="outline-sider__trigger-icon" aria-hidden="true" />
          <span className="outline-sider__trigger-text">{outlineTitle}</span>
        </button>
      </div>
    );
  }

  const anchorItems = buildAnchorItems(outline);

  return (
    <div className={`outline-sider-wrapper ${hideHeader ? "outline-sider-wrapper--no-header" : ""}`}>
      {!hideHeader && (
        <div className="outline-sider__header">
          <span className="outline-sider__title">{outlineTitle}</span>
          <button
            type="button"
            className="outline-sider__collapse-btn"
            onClick={onCollapse}
            aria-label={collapseTitle}
            title={collapseTitle}
          >
            <RightOutlined aria-hidden="true" />
          </button>
        </div>
      )}

      {anchorItems.length === 0 ? (
        <p className="outline-sider__empty">{emptyLabel}</p>
      ) : (
        <Anchor
          affix={true}
          className="outline-sider__anchor"
          items={anchorItems}
        />
      )}
    </div>
  );
};

export default OutlineSider;
