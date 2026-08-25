/**
 * Throwaway Learning Workspace design study.
 * Three variants live on one dev-only route and are switched with ?variant=A|B|C.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./LearningWorkspacePrototype.css";

const VARIANTS = [
  { id: "A", name: "Calm Workspace" },
  { id: "B", name: "Editorial Canvas" },
  { id: "C", name: "Focus Island" },
];

const FULL_PATH_STAGES = [
  {
    id: "start",
    title: "刚开始准备求职",
    state: "done",
    branches: ["如何开启第一段实习", "如何在转专业 / 转行后开启第一段实习"],
  },
  {
    id: "market",
    title: "理解岗位与市场",
    state: "current",
    branches: ["技能补充", "CFA 是否适合我", "FRM 是否适合我", "HKICPA QP 是否适合我"],
  },
  {
    id: "profile",
    title: "准备简历与 Profile",
    state: "next",
    branches: ["简历", "LinkedIn", "Cover Letter", "项目集", "个人主页"],
  },
  {
    id: "search",
    title: "寻找和筛选岗位",
    state: "idle",
    branches: [
      "Coffee Chat / Networking → Referral",
      "Job Board",
      "Company Career Page",
      "社媒平台",
      "用 AI 辅助找岗位",
      "Campus Recruiting → Career Fair → Alumni Networking",
    ],
  },
  {
    id: "applications",
    title: "投递与流程管理",
    state: "idle",
    branches: [
      "Batch Planning → Tracker → Resume Version Management",
      "Company Research → JD Deep Dive → Tailored Materials",
    ],
  },
  { id: "assessment", title: "在线测试", state: "idle", branches: [] },
  {
    id: "interviews",
    title: "综合面试准备",
    state: "idle",
    branches: [
      "HR Screening Call", "HR 面", "Technical Interview", "群面", "Panel Interview",
      "Assessment Centre", "压力面", "终面", "面试特殊情况应对",
    ],
  },
  { id: "review", title: "面试复盘", state: "idle", branches: [] },
  { id: "offer", title: "Offer 判断", state: "idle", branches: [] },
];

const DASHBOARD_ITEMS = [
  {
    key: "object",
    number: "01",
    title: "工作对象",
    short: "你每天主要在和什么打交道？",
    detail: "人、数据、产品、流程、资金或风险，往往比职位名称更能说明一份工作的真实质感。",
  },
  {
    key: "activity",
    number: "02",
    title: "主要活动",
    short: "一天里的时间花在了哪里？",
    detail: "分析、创造、沟通、销售、管理、研究或执行。留意 JD 中反复出现的动词。",
  },
  {
    key: "output",
    number: "03",
    title: "输出结果",
    short: "最后留下了怎样的成果？",
    detail: "报告、产品、决策、交易、客户关系或运营改进，决定了你的价值如何被看见。",
  },
  {
    key: "environment",
    number: "04",
    title: "工作环境",
    short: "哪一种节奏让你更舒服？",
    detail: "独立或协作、稳定或变化、深度专精或跨领域推进，都值得放进选择条件里。",
  },
];

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 15.2A8 8 0 0 1 8.8 5a8 8 0 1 0 10.2 10.2Z" />
    </svg>
  );
}

function PathIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5" cy="6" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="7" cy="19" r="2" />
      <path d="M7 6h3a3 3 0 0 1 3 3v0a3 3 0 0 0 3 3M16.5 13.3 8.8 18" />
    </svg>
  );
}

function ExpandIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <path d="m8 4 4 4 4-4M12 8V3M8 20l4-4 4 4M12 16v5" />
      ) : (
        <path d="m4 8 4 4-4 4M8 12H3m17-4-4 4 4 4M16 12h5" />
      )}
    </svg>
  );
}

function UtilityBar({ label = "Lighthouse" }) {
  return (
    <header className="lw-utility-bar">
      <div className="lw-wordmark"><span />{label}</div>
      <div className="lw-utility-actions">
        <button type="button" aria-label="查看学习路径"><PathIcon /></button>
        <button type="button" aria-label="切换夜间模式"><MoonIcon /></button>
        <button type="button" className="lw-language">简</button>
      </div>
    </header>
  );
}

function ArticleCopy({ dashboard, variant }) {
  return (
    <article className={`lw-article lw-article-${variant.toLowerCase()}`}>
      <div className="lw-breadcrumb">求职准备 <span>/</span> 当前节点</div>
      <h1>理解岗位与市场</h1>
      <p>
        刚开始看职位时，岗位名称各种各样，很容易让人感到迷茫。先建立一张宏观地图，会更容易理解：行业怎样运转、公司处在什么位置、市场里有哪些岗位，以及这些岗位之间有什么关系。
      </p>
      <p>可以按照“行业 → 公司 → 岗位市场 → 岗位本质 → 职业路径”逐层缩小范围，再进入具体的岗位搜索和申请。</p>

      <section className="lw-copy-section" id="industry">
        <p className="lw-section-kicker">01 · INDUSTRY</p>
        <h2>先理解行业怎样创造价值</h2>
        <p>同一个专业可以进入很多行业，同一个行业也需要完全不同的职能。研究一个行业时，可以先看：</p>
        <ul>
          <li>它为谁解决什么问题，收入从哪里来；</li>
          <li>上游、下游、客户、合作伙伴和监管方分别是谁；</li>
          <li>技术、政策、消费习惯或经济周期正在怎样改变它；</li>
          <li>哪些环节正在扩张，哪些能力的需求正在增加。</li>
        </ul>
        <p>试试用自己的话解释这个行业怎样运转，已经足以帮助我们理解其中的公司为什么存在，以及为什么需要某些岗位。</p>
      </section>

      <section className="lw-copy-section" id="company">
        <p className="lw-section-kicker">02 · COMPANY</p>
        <h2>再看公司处在行业的什么位置</h2>
        <p>理解行业以后，可以进一步观察具体公司在这条价值链中负责哪一部分。</p>
        <p>如果时间、精力充足，可以留意行业头部公司或是重点目标公司的主要产品、客户、地区、竞争方式、近期重点和组织结构。财报、官网、产品页面、招聘信息与公开访谈能提供不同角度；社交媒体上的经验帖也能用来补充实际感受。</p>
        <p>公司规模、发展阶段和业务模式也会改变同一个职位的日常。大公司、成熟企业组织的分工可能更清晰，培训与流程也更完整；较小团队的职责边界可能更灵活，个人会接触更多环节。</p>
        <p>因此，即使职位名称相同，在不同公司里也可能意味着不同的工作内容和学习机会。</p>
      </section>

      <section className="lw-copy-section" id="roles">
        <p className="lw-section-kicker">03 · ROLE LANDSCAPE</p>
        <h2>看清市场里到底有哪些岗位</h2>
        <p>理解了行业和公司以后，下一步是看看这些组织需要哪些人来完成工作。</p>
        <p>只认识一个热门岗位，很容易把全部准备压在一条狭窄的路上。先看清行业里的岗位族群、团队分工和相互关系，更容易发现适合自己的入口。</p>
        <p>量化就是一个典型例子。“想做 Quant”背后可能包含 Quantitative Research、Quantitative Trading、Quantitative Development、风险建模、模型验证，以及与数据和策略相关的岗位。不同公司的名称和分工并不完全一致，对数学、编程、市场知识和沟通能力的侧重也会变化。</p>
      </section>

      <section className="lw-copy-section" id="anatomy">
        <p className="lw-section-kicker">04 · ROLE ANATOMY</p>
        <h2>理解工作的本质，而非职位名称</h2>
        <p>一些看起来不同的 Title，实际上可能在做相似的事情。比如 Data Analyst、Business Intelligence Analyst 和部分 Business Analyst 可能共享数据提取、指标分析和沟通展示；产品、运营与项目岗位也可能在需求分析、协作和推进上存在大量重叠。</p>
        <p>可以把一个岗位进一步拆成四个视角。点开每一项，看看它如何帮助你越过职位名称，靠近真实的工作。</p>
        {dashboard}
        <p>这样比较岗位时，关注点就会逐渐从“职位名称像不像”，转向“每天实际在做什么”。</p>
      </section>

      <section className="lw-copy-section lw-closing-section" id="career">
        <p className="lw-section-kicker">05 · CAREER PATH</p>
        <h2>最后看职业路径和可迁移能力</h2>
        <p>理解一个岗位的工作内容以后，再往前看一步：如果进入这个岗位，它会把自己带向哪里？</p>
        <ul>
          <li>能学到哪些行业知识、工具和判断方式；</li>
          <li>下一步常见的晋升职称和发展方向是什么；</li>
          <li>如果未来改变公司或行业，哪些能力仍然可以使用；</li>
          <li>新人能否获得反馈、培训和承担完整任务的机会。</li>
        </ul>
        <p>一份工作的价值不仅来自职位名称，也来自它能够积累什么样的能力资本。</p>
        <p>职业路径很少是一条完全笔直的线。理解可迁移能力以后，选择会多一些空间，也能减少“第一份工作决定一生”的压力。</p>
      </section>
    </article>
  );
}

function BentoDashboard({ active, onChange }) {
  const selected = DASHBOARD_ITEMS.find((item) => item.key === active) || DASHBOARD_ITEMS[0];
  return (
    <div className="lw-bento-dashboard">
      <div className="lw-bento-grid">
        {DASHBOARD_ITEMS.map((item) => (
          <button
            type="button"
            key={item.key}
            className={active === item.key ? "is-active" : ""}
            onClick={() => onChange(item.key)}
          >
            <span>{item.number}</span>
            <strong>{item.title}</strong>
            <small>{item.short}</small>
          </button>
        ))}
      </div>
      <div className="lw-bento-detail" key={selected.key}>
        <span>{selected.number}</span>
        <p>{selected.detail}</p>
      </div>
    </div>
  );
}

function RibbonDashboard({ active, onChange }) {
  const selected = DASHBOARD_ITEMS.find((item) => item.key === active) || DASHBOARD_ITEMS[0];
  return (
    <div className="lw-ribbon-dashboard">
      <div className="lw-ribbon-tabs" role="tablist" aria-label="岗位观察视角">
        {DASHBOARD_ITEMS.map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={active === item.key}
            key={item.key}
            onClick={() => onChange(item.key)}
          >
            <span>{item.number}</span>{item.title}
          </button>
        ))}
      </div>
      <div className="lw-ribbon-answer" key={selected.key}>
        <p>{selected.detail}</p>
        <div><span /><span /><span /><span /></div>
      </div>
    </div>
  );
}

function LabDashboard({ active, onChange }) {
  const selectedIndex = Math.max(0, DASHBOARD_ITEMS.findIndex((item) => item.key === active));
  const selected = DASHBOARD_ITEMS[selectedIndex];
  return (
    <div className="lw-lab-dashboard">
      <div className="lw-lab-orbit" aria-hidden="true">
        <div className="lw-lab-core">{selected.number}</div>
        {DASHBOARD_ITEMS.map((item, index) => (
          <button
            type="button"
            key={item.key}
            className={active === item.key ? "is-active" : ""}
            style={{ "--orbit-index": index }}
            aria-label={item.title}
            onClick={() => onChange(item.key)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="lw-lab-copy" key={selected.key}>
        <span>ACTIVE LENS · {selected.number}</span>
        <h3>{selected.title}</h3>
        <p>{selected.detail}</p>
      </div>
    </div>
  );
}

function HorizontalPath({ compact = false, className = "" }) {
  if (compact) {
    return (
      <div className={`lw-focus-path ${className}`}>
        <div className="lw-focus-line" />
        <button type="button" className="lw-focus-node">
          <span>02</span>
          <strong>理解岗位与市场</strong>
          <small>正在这里</small>
        </button>
      </div>
    );
  }
  return (
    <div className={`lw-horizontal-path ${className}`}>
      <div className="lw-main-track" />
      {FULL_PATH_STAGES.map((node, index) => (
        <div className={`lw-path-stage lw-path-stage-${node.id}`} key={node.id}>
          <button type="button" className={`lw-path-node is-${node.state}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{node.title}</strong>
            <small>{node.state === "done" ? "已完成" : node.state === "current" ? "正在这里" : ""}</small>
          </button>
          {node.branches.length > 0 ? (
            <div className="lw-path-tree">
              {node.branches.map((branch) => <button type="button" key={branch}>{branch}</button>)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function VariantA({ pathOpen, setPathOpen, active, setActive }) {
  return (
    <div className={`lw-scene lw-scene-a ${pathOpen ? "is-path-open" : "is-path-focused"}`}>
      <UtilityBar />
      <main className="lw-a-workspace">
        {pathOpen ? (
          <aside className="lw-a-path-panel">
            <div className="lw-panel-heading">
              <div><span>YOUR PATH</span><h2>求职路线</h2></div>
              <div className="lw-a-route-progress" aria-label="路线进度 18%">
                <div><strong>18%</strong></div>
                <span>路线进度<br /><b>2 / 11</b></span>
              </div>
              <button type="button" onClick={() => setPathOpen(false)} aria-label="收起路径">
                <ExpandIcon open />
              </button>
            </div>
            <div className="lw-a-path-scroll"><HorizontalPath className="lw-a-expanded-path" /></div>
            <div className="lw-a-path-note">
              <p>拖动画布查看完整路线。每一步都可以按你的真实情况重新安排。</p>
            </div>
          </aside>
        ) : (
          <button
            type="button"
            className="lw-a-floating-current"
            onClick={() => setPathOpen(true)}
            aria-label="展开求职路线，当前节点：理解岗位与市场"
          >
            <span>02</span>
            <strong>理解岗位<br />与市场</strong>
            <small>展开路线</small>
          </button>
        )}
        <section className="lw-a-reading-panel">
          <ArticleCopy
            variant="A"
            dashboard={<BentoDashboard active={active} onChange={setActive} />}
          />
        </section>
      </main>
    </div>
  );
}

function VariantB({ pathOpen, setPathOpen, active, setActive }) {
  return (
    <div className={`lw-scene lw-scene-b ${pathOpen ? "is-path-open" : "is-path-focused"}`}>
      <UtilityBar label="Lighthouse Journal" />
      <section className="lw-b-path-story">
        <div className="lw-b-story-heading">
          <div><p>YOUR CAREER STORY</p><h2>从当前位置，看见下一步。</h2></div>
          <button type="button" onClick={() => setPathOpen(!pathOpen)}>
            {pathOpen ? "聚焦阅读" : "展开路线"}<ExpandIcon open={pathOpen} />
          </button>
        </div>
        {pathOpen ? (
          <div className="lw-b-path-scroll"><HorizontalPath className="lw-b-expanded-path" /></div>
        ) : <HorizontalPath compact className="lw-b-focus" />}
      </section>
      <main className="lw-b-paper-wrap">
        <ArticleCopy
          variant="B"
          dashboard={<RibbonDashboard active={active} onChange={setActive} />}
        />
      </main>
    </div>
  );
}

function VariantC({ pathOpen, setPathOpen, active, setActive }) {
  return (
    <div className={`lw-scene lw-scene-c ${pathOpen ? "is-path-open" : "is-path-focused"}`}>
      <UtilityBar label="Lighthouse Focus" />
      <main className="lw-c-workspace">
        <aside className="lw-c-chapters" aria-label="笔记章节">
          <span>IN THIS NOTE</span>
          <a href="#industry" className="is-active">行业</a>
          <a href="#company">公司</a>
          <a href="#roles">岗位市场</a>
          <a href="#anatomy">岗位本质</a>
          <a href="#career">职业路径</a>
        </aside>
        <section className="lw-c-paper">
          <ArticleCopy
            variant="C"
            dashboard={<LabDashboard active={active} onChange={setActive} />}
          />
        </section>
      </main>
      <button type="button" className="lw-c-island" onClick={() => setPathOpen(true)}>
        <span>02</span>
        <div><small>正在学习</small><strong>理解岗位与市场</strong></div>
        <i>展开路线</i>
      </button>
      {pathOpen ? (
        <div className="lw-c-route-sheet">
          <div className="lw-c-sheet-bar">
            <div><small>YOUR LEARNING ATLAS</small><h2>从全局看见下一步</h2></div>
            <button type="button" onClick={() => setPathOpen(false)}>回到笔记</button>
          </div>
          <div className="lw-c-path-scroll"><HorizontalPath className="lw-c-expanded-path" /></div>
          <p className="lw-c-sheet-hint">横向滚动探索完整路线 · 当前节点会一直为你保留位置</p>
        </div>
      ) : null}
    </div>
  );
}

function PrototypeSwitcher({ variant, onChange }) {
  if (!import.meta.env.DEV) return null;
  return (
    <nav className="lw-prototype-switcher" aria-label="原型选择器">
      <span>PROTOTYPE</span>
      {VARIANTS.map((item) => (
        <button
          type="button"
          key={item.id}
          className={variant === item.id ? "is-active" : ""}
          onClick={() => onChange(item.id)}
        >
          <b>{item.id}</b>{item.name}
        </button>
      ))}
      <small>← →</small>
    </nav>
  );
}

export default function LearningWorkspacePrototype() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedVariant = searchParams.get("variant")?.toUpperCase();
  const variant = useMemo(
    () => (VARIANTS.some((item) => item.id === requestedVariant) ? requestedVariant : "A"),
    [requestedVariant],
  );
  const [pathOpen, setPathOpen] = useState(true);
  const [activeDashboard, setActiveDashboard] = useState("object");

  const changeVariant = useCallback((nextVariant) => {
    setSearchParams({ variant: nextVariant }, { replace: true });
    setPathOpen(true);
    setActiveDashboard("object");
  }, [setSearchParams]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
      }
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const currentIndex = VARIANTS.findIndex((item) => item.id === variant);
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + delta + VARIANTS.length) % VARIANTS.length;
      changeVariant(VARIANTS[nextIndex].id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeVariant, variant]);

  const sharedProps = {
    pathOpen,
    setPathOpen,
    active: activeDashboard,
    setActive: setActiveDashboard,
  };

  return (
    <div className="lw-prototype">
      {variant === "A" ? <VariantA {...sharedProps} /> : null}
      {variant === "B" ? <VariantB {...sharedProps} /> : null}
      {variant === "C" ? <VariantC {...sharedProps} /> : null}
      <PrototypeSwitcher variant={variant} onChange={changeVariant} />
    </div>
  );
}
