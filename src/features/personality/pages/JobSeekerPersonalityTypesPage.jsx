import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PersonalityMark, TYPES } from "./JobSeekerPersonalityPage";
import "./JobSeekerPersonalityPage.css";

export default function JobSeekerPersonalityTypesPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const active = params.get("result") || "";
  return <main className="personality-types-page">
    <button type="button" className="personality-back-button" onClick={() => navigate(-1)}><ArrowLeftOutlined /> 返回结果</button>
    <header><span className="personality-brand">JobTI</span><h1>八种求职者人格</h1><p>每一种都是应对求职不确定性的不同方式。这里没有更好的类型，也不需要集齐。</p></header>
    <section className="personality-types-grid" aria-label="全部 JobTI 人格">
      {Object.entries(TYPES).map(([key, type]) => <article key={key} className={`personality-type-card personality-type-card-${type.color} ${active === key ? "is-active" : ""}`}>
        <PersonalityMark type={key} /><div><span>{type.eyebrow}</span><h2>{type.name}</h2><p>{type.summary}</p><strong>{type.buff}</strong></div>
      </article>)}
    </section>
  </main>;
}
