import { Anchor } from "antd";
import "./OutlineSider.css";

const OutlineSider = ({ outline }) => {
  return (
    <Anchor
      affix={true}
      className="outline-sider"
      items={outline.map((item) => ({
        key: item.id,
        href: `#${item.id}`,
        title: (
          <span 
            className="outline-sider__item"
            style={{ '--outline-indent': `${(item.level - 1) * 12}px` }}
          >
            {item.text}
          </span>
        ),
      }))}
    />
  );
};

export default OutlineSider;
