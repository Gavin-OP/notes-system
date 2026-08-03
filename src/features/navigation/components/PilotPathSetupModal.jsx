import { useState } from "react";
import { Checkbox, Modal, Select } from "antd";

import {
  PILOT_REGION_OPTIONS,
  PILOT_STAGE_OPTIONS,
  PROFILE_BRANCH_OPTIONS,
  SEARCH_BRANCH_OPTIONS,
  SKILL_BRANCH_OPTIONS,
} from "../lib/pilotPath";

import "./PilotPathSetupModal.css";

const EMPTY_PROFILE = {
  region: "香港",
  stage: "getting_started",
  work_authorization: "",
  profile_branches: [],
  search_branches: [],
  skill_branches: [],
  learn_cantonese: false,
};

function normalizeInitialProfile(initialProfile = {}) {
  return {
    region: initialProfile.region || EMPTY_PROFILE.region,
    stage: initialProfile.stage === "targeting" ? "getting_started" : initialProfile.stage || "getting_started",
    work_authorization: initialProfile.work_authorization || "",
    profile_branches: Array.isArray(initialProfile.profile_branches) ? initialProfile.profile_branches : [],
    search_branches: Array.isArray(initialProfile.search_branches) ? initialProfile.search_branches : [],
    skill_branches: Array.isArray(initialProfile.skill_branches) ? initialProfile.skill_branches : [],
    learn_cantonese: Boolean(initialProfile.learn_cantonese),
  };
}

function OptionGroup({ legend, hint, options, value, onChange }) {
  return (
    <fieldset className="pilot-path-setup__options">
      <legend>{legend}</legend>
      {hint ? <p>{hint}</p> : null}
      <Checkbox.Group options={options} value={value} onChange={onChange} />
    </fieldset>
  );
}

function PilotPathSetupDialog({ initialProfile, pending = false, onCancel, onSubmit }) {
  const [profile, setProfile] = useState(() => normalizeInitialProfile(initialProfile));
  const [regionError, setRegionError] = useState("");

  const update = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
    if (key === "region") setRegionError("");
  };

  const submit = () => {
    if (!profile.region) {
      setRegionError("请选择目标地区");
      return;
    }
    onSubmit?.({ ...profile, setup_complete: true });
  };

  return (
    <Modal
      open
      title="调整你的秋招 Path"
      okText={pending ? "正在生成…" : "生成 Path"}
      cancelText="取消"
      okButtonProps={{ disabled: pending }}
      cancelButtonProps={{ disabled: pending }}
      onCancel={onCancel}
      onOk={submit}
      width={560}
      destroyOnHidden
    >
      <p className="pilot-path-setup__intro">只选择会直接改变 Path 的信息，之后可以随时调整。</p>

      <div className="pilot-path-setup__grid">
        <label className="pilot-path-setup__field">
          <span>目标地区</span>
          <Select
            value={profile.region}
            options={PILOT_REGION_OPTIONS.map((value) => ({ value, label: value }))}
            onChange={(value) => update("region", value)}
            status={regionError ? "error" : ""}
          />
          {regionError ? <small role="alert">{regionError}</small> : null}
        </label>

        <label className="pilot-path-setup__field">
          <span>当前阶段</span>
          <Select
            value={profile.stage}
            options={PILOT_STAGE_OPTIONS}
            onChange={(value) => update("stage", value)}
          />
        </label>

        <label className="pilot-path-setup__field pilot-path-setup__field--wide">
          <span>目标地区的工作资格</span>
          <Select
            allowClear
            value={profile.work_authorization || undefined}
            placeholder="可以稍后确认"
            options={[
              { value: "已具备", label: "已具备" },
              { value: "需要签证或雇主支持", label: "需要签证或雇主支持" },
              { value: "尚不确定", label: "尚不确定" },
            ]}
            onChange={(value) => update("work_authorization", value || "")}
          />
          <em>请以目标地区官方信息和招聘方的最新要求为准。</em>
        </label>

        <OptionGroup
          legend="简历与 Profile 中，我还需要"
          hint="“简历”会默认保留；只勾选额外需要的分支。"
          options={PROFILE_BRANCH_OPTIONS}
          value={profile.profile_branches}
          onChange={(value) => update("profile_branches", value)}
        />

        <OptionGroup
          legend="寻找岗位时，我想加入"
          options={SEARCH_BRANCH_OPTIONS}
          value={profile.search_branches}
          onChange={(value) => update("search_branches", value)}
        />

        <OptionGroup
          legend="目前明确需要补的技能"
          hint="不确定可以先不选，之后根据 JD 或面试反馈再加入。"
          options={SKILL_BRANCH_OPTIONS}
          value={profile.skill_branches}
          onChange={(value) => update("skill_branches", value)}
        />

        {profile.region === "香港" ? (
          <fieldset className="pilot-path-setup__options">
            <legend>求职地区所需、但我还需要学习</legend>
            <Checkbox
              checked={profile.learn_cantonese}
              onChange={(event) => update("learn_cantonese", event.target.checked)}
            >
              粤语（香港）
            </Checkbox>
            <p>只有勾选后，粤语准备才会加入 Path。</p>
          </fieldset>
        ) : null}
      </div>
    </Modal>
  );
}

function PilotPathSetupModal(props) {
  if (!props.open) return null;
  return <PilotPathSetupDialog {...props} />;
}

export default PilotPathSetupModal;
