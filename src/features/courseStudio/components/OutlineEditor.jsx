import { useState } from "react";
import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const ARCHETYPES = [
  { value: "conceptual", label: "Conceptual" },
  { value: "practice_based", label: "Practice-based" },
  { value: "creative", label: "Creative" },
];

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneOutline(outline) {
  return JSON.parse(JSON.stringify(outline || { schema_version: "course-outline-proposal/v1", modules: [] }));
}

function moveItem(items, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function OutlineEditor({
  open,
  proposal,
  saving,
  onCancel,
  onSave,
}) {
  const { modal } = App.useApp();
  const [form] = Form.useForm();
  const [outline, setOutline] = useState(() => cloneOutline(proposal?.outline));
  const [dirty, setDirty] = useState(false);

  const updateModule = (moduleIndex, updater) => {
    setOutline((current) => ({
      ...current,
      modules: current.modules.map((module, index) => (
        index === moduleIndex ? updater(module) : module
      )),
    }));
    setDirty(true);
  };

  const addModule = () => {
    const moduleId = makeId("module");
    setOutline((current) => ({
      ...current,
      modules: [
        ...current.modules,
        {
          id: moduleId,
          title: "New module",
          lessons: [{
            id: makeId(`${moduleId}-lesson`),
            title: "New outline item",
            summary: "",
            source_excerpt: "",
          }],
        },
      ],
    }));
    setDirty(true);
  };

  const requestClose = () => {
    if (!dirty) {
      onCancel();
      return;
    }
    modal.confirm({
      title: "Discard unsaved outline changes?",
      content: "Your saved proposal will not be affected.",
      okText: "Discard changes",
      okButtonProps: { danger: true },
      onOk: onCancel,
    });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    await onSave({
      ...values,
      secondary_archetypes: (values.secondary_archetypes || [])
        .filter((item) => item !== values.primary_archetype),
      outline,
    });
  };

  return (
    <Modal
      open={open}
      title="Edit outline proposal"
      width={960}
      onCancel={requestClose}
      maskClosable={!dirty}
      footer={[
        <Button key="cancel" onClick={requestClose} disabled={saving}>Cancel</Button>,
        <Button key="save" type="primary" loading={saving} onClick={handleSave}>
          Save and remap concepts
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          proposed_title: proposal?.proposed_title || "",
          primary_archetype: proposal?.primary_archetype || "conceptual",
          secondary_archetypes: proposal?.secondary_archetypes || [],
        }}
        onValuesChange={() => setDirty(true)}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Course title"
              name="proposed_title"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input maxLength={255} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Primary archetype" name="primary_archetype" rules={[{ required: true }]}>
              <Select options={ARCHETYPES} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Secondary" name="secondary_archetypes">
              <Select mode="multiple" maxCount={2} options={ARCHETYPES} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className="course-studio__outline-editor" aria-live="polite">
        {outline.modules.map((module, moduleIndex) => (
          <Card
            key={module.id}
            size="small"
            title={`Module ${moduleIndex + 1}`}
            extra={(
              <Space>
                <Button
                  type="text"
                  icon={<ArrowUpOutlined />}
                  aria-label={`Move module ${moduleIndex + 1} up`}
                  disabled={moduleIndex === 0}
                  onClick={() => {
                    setOutline((current) => ({
                      ...current,
                      modules: moveItem(current.modules, moduleIndex, -1),
                    }));
                    setDirty(true);
                  }}
                />
                <Button
                  type="text"
                  icon={<ArrowDownOutlined />}
                  aria-label={`Move module ${moduleIndex + 1} down`}
                  disabled={moduleIndex === outline.modules.length - 1}
                  onClick={() => {
                    setOutline((current) => ({
                      ...current,
                      modules: moveItem(current.modules, moduleIndex, 1),
                    }));
                    setDirty(true);
                  }}
                />
                <Popconfirm
                  title="Remove this module?"
                  disabled={outline.modules.length === 1}
                  onConfirm={() => {
                    setOutline((current) => ({
                      ...current,
                      modules: current.modules.filter((_, index) => index !== moduleIndex),
                    }));
                    setDirty(true);
                  }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    aria-label={`Remove module ${moduleIndex + 1}`}
                    disabled={outline.modules.length === 1}
                  />
                </Popconfirm>
              </Space>
            )}
          >
            <label className="course-studio__editor-field">
              <Text strong>Module title</Text>
              <Input
                value={module.title}
                maxLength={180}
                onChange={(event) => updateModule(moduleIndex, (current) => ({
                  ...current,
                  title: event.target.value,
                }))}
              />
            </label>

            <div className="course-studio__editor-lessons">
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="course-studio__editor-lesson">
                  <div className="course-studio__editor-lesson-head">
                    <Text type="secondary">Outline item {lessonIndex + 1}</Text>
                    <Space>
                      <Button
                        type="text"
                        icon={<ArrowUpOutlined />}
                        aria-label={`Move outline item ${lessonIndex + 1} up`}
                        disabled={lessonIndex === 0}
                        onClick={() => updateModule(moduleIndex, (current) => ({
                          ...current,
                          lessons: moveItem(current.lessons, lessonIndex, -1),
                        }))}
                      />
                      <Button
                        type="text"
                        icon={<ArrowDownOutlined />}
                        aria-label={`Move outline item ${lessonIndex + 1} down`}
                        disabled={lessonIndex === module.lessons.length - 1}
                        onClick={() => updateModule(moduleIndex, (current) => ({
                          ...current,
                          lessons: moveItem(current.lessons, lessonIndex, 1),
                        }))}
                      />
                      <Popconfirm
                        title="Remove this outline item?"
                        disabled={module.lessons.length === 1}
                        onConfirm={() => updateModule(moduleIndex, (current) => ({
                          ...current,
                          lessons: current.lessons.filter((_, index) => index !== lessonIndex),
                        }))}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          aria-label={`Remove outline item ${lessonIndex + 1}`}
                          disabled={module.lessons.length === 1}
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                  <Input
                    aria-label={`Outline item ${lessonIndex + 1} title`}
                    value={lesson.title}
                    maxLength={180}
                    onChange={(event) => updateModule(moduleIndex, (current) => ({
                      ...current,
                      lessons: current.lessons.map((item, index) => (
                        index === lessonIndex ? { ...item, title: event.target.value } : item
                      )),
                    }))}
                  />
                  <Input.TextArea
                    aria-label={`Outline item ${lessonIndex + 1} summary`}
                    value={lesson.summary}
                    rows={2}
                    maxLength={2_000}
                    placeholder="What should this item help the learner understand or do?"
                    onChange={(event) => updateModule(moduleIndex, (current) => ({
                      ...current,
                      lessons: current.lessons.map((item, index) => (
                        index === lessonIndex ? { ...item, summary: event.target.value } : item
                      )),
                    }))}
                  />
                </div>
              ))}
              <Button
                icon={<PlusOutlined />}
                onClick={() => updateModule(moduleIndex, (current) => ({
                  ...current,
                  lessons: [
                    ...current.lessons,
                    {
                      id: makeId(`${current.id}-lesson`),
                      title: "New outline item",
                      summary: "",
                      source_excerpt: "",
                    },
                  ],
                }))}
              >
                Add outline item
              </Button>
            </div>
          </Card>
        ))}
        <Button type="dashed" icon={<PlusOutlined />} onClick={addModule}>
          Add module
        </Button>
      </div>
    </Modal>
  );
}

export default OutlineEditor;
