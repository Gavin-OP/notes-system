import { Anchor } from "antd";

const OutlineSider = ({ outline }) => (
  <Anchor
    affix={true}
    style={{ overflow: "auto" }}
    items={outline.map((item) => ({
      key: item.id,
      href: `#${item.id}`,
      title: (
        <span style={{ marginLeft: (item.level - 1) * 12 }}>{item.text}</span>
      ),
    }))}
  />
);

export default OutlineSider;
