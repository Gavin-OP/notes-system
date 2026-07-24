import { Button, Checkbox, Form, Space, Typography, Upload } from "antd";
import {
  CloudUploadOutlined,
  FileProtectOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { Paragraph, Text, Title } = Typography;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function SourceUploadStep({ file, uploading, onFileChange, onSubmit }) {
  const [form] = Form.useForm();

  return (
    <section className="course-studio__step-panel" aria-labelledby="course-studio-upload-title">
      <div className="course-studio__step-heading">
        <span className="course-studio__step-icon"><CloudUploadOutlined /></span>
        <div>
          <Text className="course-studio__eyebrow">Source asset</Text>
          <Title level={3} id="course-studio-upload-title">Bring your notes into a private workspace</Title>
          <Paragraph>
            Upload readable notes first. The system extracts text and prepares an outline proposal before
            any course notes are generated.
          </Paragraph>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          consentProcessing: false,
          consentCommunityPublish: false,
          consentModelImprovement: false,
        }}
        onFinish={onSubmit}
      >
        <Dragger
          className="course-studio__dragger"
          accept=".pdf,.docx,.md,.markdown,.txt"
          maxCount={1}
          fileList={file ? [file] : []}
          disabled={uploading}
          beforeUpload={(nextFile) => {
            if (nextFile.size > MAX_FILE_BYTES) {
              onFileChange(null, "Files must be 10 MB or smaller.");
              return Upload.LIST_IGNORE;
            }
            onFileChange(nextFile);
            return false;
          }}
          onRemove={() => {
            onFileChange(null);
            return true;
          }}
        >
          <p className="ant-upload-drag-icon"><FileProtectOutlined /></p>
          <p className="ant-upload-text">Drop a file here or choose from your device</p>
          <p className="ant-upload-hint">PDF, DOCX, Markdown, or text · up to 10 MB</p>
        </Dragger>

        <div className="course-studio__consent-list">
          <Form.Item
            name="consentProcessing"
            valuePropName="checked"
            rules={[{
              validator: (_, checked) => (
                checked
                  ? Promise.resolve()
                  : Promise.reject(new Error("Processing permission is required for analysis."))
              ),
            }]}
          >
            <Checkbox disabled={uploading}>
              <span className="course-studio__consent-copy">
                <strong>Allow service processing</strong>
                <span>Required. Extract and analyze this file to build your private proposal.</span>
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item name="consentCommunityPublish" valuePropName="checked">
            <Checkbox disabled={uploading}>
              <span className="course-studio__consent-copy">
                <strong>Allow future community publication</strong>
                <span>Optional. This does not publish anything now; a later review is still required.</span>
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item name="consentModelImprovement" valuePropName="checked">
            <Checkbox disabled={uploading}>
              <span className="course-studio__consent-copy">
                <strong>Allow model improvement use</strong>
                <span>Optional and independent from processing or publication.</span>
              </span>
            </Checkbox>
          </Form.Item>
        </div>

        <div className="course-studio__panel-footer">
          <Space>
            <SafetyCertificateOutlined />
            <Text type="secondary">Private by default. Canonical knowledge remains admin-managed.</Text>
          </Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            icon={<CloudUploadOutlined />}
            loading={uploading}
            disabled={!file}
          >
            Upload and parse
          </Button>
        </div>
      </Form>
    </section>
  );
}

export default SourceUploadStep;
