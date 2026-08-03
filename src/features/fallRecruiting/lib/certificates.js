const OFFICIAL_LINKS = {
  cfa: "https://www.cfainstitute.org/programs/cfa-program/exam",
  frm: "https://www.garp.org/frm/exam-logistics",
  hkicpa: "https://www.hkicpa.org.hk/en/Become-a-Hong-Kong-CPA/Qualification-Programme/Timetable",
};

export const FALL_RECRUITING_CERTIFICATES = [
  {
    id: "cfa",
    shortName: "CFA",
    name: "Chartered Financial Analyst",
    fit: "投资研究、资产管理、财富管理等方向",
    value: "系统建立投资分析与资产定价知识框架",
    limitation: "不能替代实习、市场判断、建模与清晰表达",
    preparation: "Level I 通常需要数月持续准备；完整项目包含三个级别",
    officialUrl: OFFICIAL_LINKS.cfa,
  },
  {
    id: "frm",
    shortName: "FRM",
    name: "Financial Risk Manager",
    fit: "市场风险、信用风险、风险管理与相关咨询方向",
    value: "集中覆盖金融风险识别、计量与管理",
    limitation: "对非风险岗位的直接帮助有限，也不能替代业务经验",
    preparation: "分 Part I、II；单级通常需要数月持续准备",
    officialUrl: OFFICIAL_LINKS.frm,
  },
  {
    id: "hkicpa",
    shortName: "HKICPA QP",
    name: "Hong Kong CPA Qualification Programme",
    fit: "香港审计、会计、财务报告及专业服务方向",
    value: "通往香港 CPA 资格的专业课程与考核路径",
    limitation: "适用性与学历、课程认证和实践经验要求紧密相关",
    preparation: "按模块及 Capstone 推进，需先确认入读与豁免资格",
    officialUrl: OFFICIAL_LINKS.hkicpa,
  },
];

const KNOWN_WINDOWS = {
  cfa: [
    {
      start: "2026-11-01",
      end: "2026-11-30",
      registrationEnd: "2026-08-11",
      label: "2026 年 11 月考试窗口",
      detail: "标准报名预计截至 8 月 11 日",
    },
    {
      start: "2027-02-01",
      end: "2027-02-28",
      registrationEnd: "2026-11-05",
      label: "2027 年 2 月考试窗口",
      detail: "标准报名预计截至 11 月 5 日",
    },
  ],
  frm: [
    {
      start: "2026-11-14",
      end: "2026-11-25",
      registrationEnd: "2026-09-30",
      label: "2026 年 11 月 14–25 日",
      detail: "Part I 与 Part II 日期不同；标准报名截至 9 月 30 日",
    },
  ],
  hkicpa: [
    {
      start: "2026-11-23",
      end: "2026-12-28",
      registrationStart: "2026-08-26",
      registrationEnd: "2026-09-07",
      label: "2026 年 12 月 Session",
      detail: "不同模块考试日期不同；报名期为 8 月 26 日至 9 月 7 日",
    },
    {
      start: "2027-06-01",
      end: "2027-06-30",
      label: "2027 年 6 月 Session",
      detail: "具体考试与报名日期待官方时间表更新",
    },
  ],
};

function parseLocalDate(value, endOfDay = false) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0);
}

function getCadenceFallback(certificateId, now) {
  const cadence = certificateId === "cfa" ? [2, 5, 8, 11] : certificateId === "frm" ? [5, 8, 11] : [6, 12];
  const currentMonth = now.getMonth() + 1;
  const nextMonth = cadence.find((month) => month >= currentMonth);
  const year = nextMonth ? now.getFullYear() : now.getFullYear() + 1;
  const month = nextMonth || cadence[0];
  return {
    label: `${year} 年 ${month} 月常规考试窗口`,
    detail: "未来日期尚未写入本地时间表，请前往官网确认报名和考试日期",
    isFallback: true,
  };
}

export function getNextCertificateWindow(certificateId, now = new Date()) {
  const windows = KNOWN_WINDOWS[certificateId] || [];
  const nextWindow = windows.find((window) => {
    const decisionDeadline = window.registrationEnd || window.end;
    return parseLocalDate(decisionDeadline, true) >= now;
  });
  return nextWindow || getCadenceFallback(certificateId, now);
}

export function getCertificateById(certificateId) {
  return FALL_RECRUITING_CERTIFICATES.find((certificate) => certificate.id === certificateId) || null;
}
