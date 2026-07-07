import { Button, Card, Space, Typography } from "antd";
import { HomeOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "./NotFoundPage.css";

const { Paragraph, Title } = Typography;

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <Card className="not-found-page__card">
        <Space direction="vertical" size={16} className="not-found-page__content">
          <div>
            <span className="not-found-page__eyebrow">404</span>
            <Title level={2}>This page is not on the map yet.</Title>
            <Paragraph type="secondary">
              The link may be old, or the note may have moved. Use search or the subject database to find the right path.
            </Paragraph>
          </div>
          <Space wrap>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => navigate("/search")}>
              Search notes
            </Button>
            <Button icon={<UnorderedListOutlined />} onClick={() => navigate("/subjects")}>
              Browse subjects
            </Button>
            <Button icon={<HomeOutlined />} onClick={() => navigate("/")}>
              Go home
            </Button>
          </Space>
        </Space>
      </Card>
    </main>
  );
}

export default NotFoundPage;
