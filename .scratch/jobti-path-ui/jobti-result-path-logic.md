# JobTI → Result → Personalized Path Logic

This document describes the current Pilot Mode questionnaire and its explainable
Path-generation behavior. It separates personality scoring from practical Path
signals so a JobTI type never becomes a claim about career suitability.

## 1. End-to-end data flow

```mermaid
flowchart LR
  A[JobTI start] --> B[18 questions]
  B --> C[9 scored questions]
  B --> D[10 Path inputs]
  C --> E[Weighted persona scores]
  E --> F[Stable ranked result]
  F --> G[JobTI result page]
  D --> H[Path profile]
  F -. default only when no explicit answer .-> H
  H --> I[Normalize and migrate profile]
  I --> J[Generate Path nodes and DAG edges]
  G --> K[Generate my career Path]
  K --> J
  J --> L[Save in browser localStorage]
  L --> M[Learning Workspace]
  M --> N[User edits Path settings]
  N --> H
```

## 2. Questionnaire sequence

`P` means personality-only, `D` means direct Path input, and `P+D` affects both.

```mermaid
flowchart TD
  Q01[01 P · Ambitious JD reaction] --> Q02[02 D · Current stage]
  Q02 --> Q03[03 D · Student status]
  Q03 --> Q04[04 P · 2000+ applicants]
  Q04 --> Q05[05 P · Resume V17]
  Q05 --> Q06[06 D · Extra application materials]
  Q06 --> Q07[07 P+D · Career planning]
  Q07 --> Q08[08 D · Information-gathering style]
  Q08 --> Q09[09 D · Application strategy]
  Q09 --> Q10[10 P · Online assessment reaction]
  Q10 --> Q11[11 D · LeetCode relevance]
  Q11 --> Q12[12 P · Failure-story reaction]
  Q12 --> Q13[13 D · Preparation priority]
  Q13 --> Q14[14 D · Experience evidence]
  Q14 --> Q15[15 P+D · Finance certificates]
  Q15 --> Q16[16 P · No-news reaction]
  Q16 --> Q17[17 D · Interview formats]
  Q17 --> Q18[18 P · Message to yourself]
  Q18 --> RESULT[JobTI result + Path profile]
```

## 3. Practical answers and Path changes

```mermaid
flowchart LR
  subgraph STAGE[Q02 · Current stage]
    S1[Getting started] --> S1P[Keep the complete main route]
    S2[Preparing materials] --> S2P[Start at Resume and Profile]
    S3[Applying] --> S3P[Start at Applications]
    S4[Testing or interviewing] --> S4P[Start at Assessments and Interviews]
    S5[Comparing offers] --> S5P[Start at Offer decisions]
  end

  subgraph STUDENT[Q03 · Student status]
    U1[Still a student] --> U1P[Campus Recruiting → Career Fair → Alumni Networking]
    U2[Not currently a student] --> U2P[Do not add the campus route]
  end

  subgraph MATERIALS[Q06 · Extra materials · multi-select]
    M1[LinkedIn] --> MP1[LinkedIn note]
    M2[Cover Letter] --> MP2[Cover Letter note]
    M3[Portfolio] --> MP3[Portfolio note]
    M4[Personal website] --> MP4[Personal website note]
  end

  subgraph DIRECTION[Q07 · Career direction]
    D1[Clear direction] --> DP1[Focus a career track]
    DP1 --> DP2[Independent research + precision default]
    D2[Explore possibilities] --> DP3[Career exploration → varied internships → Recruitment Event]
    DP3 --> DP4[Broader information channels + batch default]
    D3[Work it out gradually / lifestyle first] --> DP5[Keep neutral default]
  end

  subgraph INFO[Q08 · Information style]
    I1[Talk to people] --> IP1[Coffee Chat / Networking → Referral]
    I1 --> IP2[Networking Event]
    I2[Research independently] --> IP3[Job Board]
    I2 --> IP4[Company Career Page]
    I2 --> IP5[Social platforms / Glassdoor]
    I2 --> IP6[AI Job Search]
    I3[Use both] --> IP1
    I3 --> IP2
    I3 --> IP3
    I3 --> IP4
    I3 --> IP5
    I3 --> IP6
    I4[No preference] --> IP7[Use career direction or JobTI default]
  end

  subgraph APPLY[Q09 · Application strategy]
    A1[Batch] --> AP1[Batch Planning → Tracker → Resume Version Management]
    A2[Precision] --> AP2[Company Research → JD Deep Dive → Tailored Materials]
    A3[Batch then precision] --> AP3[Batch route → Precision route]
    A4[Precision then batch] --> AP4[Precision route → Batch route]
  end

  subgraph SKILL[Q11 · LeetCode]
    L1[Relevant to role] --> LP1[Skill Supplement → LeetCode]
    L2[Not currently relevant] --> LP2[Do not add LeetCode]
  end

  subgraph PRIORITY[Q13 · Preparation priority]
    B1[Strong evidence already] --> BP1[Prepare for interviews earlier]
    B2[Limited / uncertain evidence] --> BP2[Position resume evidence first]
    B3[Not sure] --> BP3[Keep the base order]
  end

  subgraph EXPERIENCE[Q14 · Experience evidence]
    E1[Need more evidence] --> EP1[Experience Building]
    EP1 --> EP2[Business competitions]
    EP1 --> EP3[Kaggle competitions]
    EP1 --> EP4[Polish course projects]
    E2[Enough material] --> EP5[Keep the main route concise]
  end

  subgraph CERT[Q15 · Finance certificates]
    C1[Learn / already enrolled] --> CP1[Finance Certificates overview]
    C2[Skip / later] --> CP2[Do not add the certificate branch]
    CP1 --> CP3[User later chooses CFA / FRM / HKICPA QP in Path settings]
  end

  subgraph INTERVIEW[Q17 · Interview formats · multi-select]
    T0[Comprehensive preparation always remains] --> T1[HR Screening Call]
    T0 --> T2[HR interview]
    T0 --> T3[Technical interview]
    T0 --> T4[Group interview]
    T0 --> T5[Panel interview]
    T0 --> T6[Assessment Centre]
    T0 --> T7[Stress interview]
    T0 --> T8[Final interview]
    T0 --> T9[Difficult situations]
  end
```

## 4. Personality scoring and result

Each scored answer contributes `+2` to its primary type and `+1` to its secondary
type. The highest total wins. Ties use the stable order below, so identical answers
always produce the same result.

```mermaid
flowchart TD
  SA[Scored answer] --> P2[Primary type +2]
  SA --> P1[Secondary type +1]
  P2 --> SUM[Sum all nine scored questions]
  P1 --> SUM
  SUM --> RANK[Sort by score with stable tie order]
  RANK --> T1[林克 · Open exploration]
  RANK --> T2[LinkedIn · Analysis and matching]
  RANK --> T3[海王 · Action and execution]
  RANK --> T4[X团神券 · Expression optimization]
  RANK --> T5[复仇者 · Reflection and growth]
  RANK --> T6[GPT · State protection]
  RANK --> T7[野王 · Self-paced progress]
  RANK --> T8[卡戴珊太后 · Optimism and humor]
  T1 --> RESULT[Result copy and share image]
  T2 --> RESULT
  T3 --> RESULT
  T4 --> RESULT
  T5 --> RESULT
  T6 --> RESULT
  T7 --> RESULT
  T8 --> RESULT
  RESULT --> CTA[Generate my career Path]
```

### Scored-question matrix

| Question | A (+2 / +1) | B (+2 / +1) | C (+2 / +1) | D (+2 / +1) |
|---|---|---|---|---|
| 01 Ambitious JD | 复仇者 / LinkedIn | 海王 / 林克 | 野王 / X团神券 | 卡戴珊太后 / GPT |
| 04 2000+ applicants | 野王 / LinkedIn | 卡戴珊太后 / 海王 | 林克 / GPT | X团神券 / 复仇者 |
| 05 Resume V17 | X团神券 / 复仇者 | LinkedIn / 海王 | 卡戴珊太后 / GPT | 林克 / 野王 |
| 07 Career planning | LinkedIn / X团神券 | 卡戴珊太后 / 林克 | 海王 / 复仇者 | GPT / 野王 |
| 10 Online assessment | 复仇者 / LinkedIn | 野王 / GPT | 海王 / 卡戴珊太后 | X团神券 / 林克 |
| 12 Failure story | 复仇者 / 野王 | LinkedIn / 海王 | X团神券 / 林克 | GPT / 卡戴珊太后 |
| 15 Certificates | GPT / 野王 | 复仇者 / LinkedIn | 海王 / 卡戴珊太后 | 林克 / X团神券 |
| 16 No news | LinkedIn / 复仇者 | 林克 / 海王 | GPT / 卡戴珊太后 | 野王 / X团神券 |
| 18 Message | 野王 / LinkedIn | 林克 / 卡戴珊太后 | 复仇者 / 海王 | GPT / X团神券 |

## Rendering the diagrams

1. Open <https://mermaid.live/>.
2. Copy one complete `mermaid` code block, excluding the Markdown backticks.
3. Paste it into the editor to render, export SVG/PNG, or share a link.

Alternatively, in draw.io choose **Arrange → Insert → Advanced → Mermaid**, then
paste one block. Keeping the four diagrams separate is recommended; combining all
branches into one canvas makes the product logic difficult to review.
