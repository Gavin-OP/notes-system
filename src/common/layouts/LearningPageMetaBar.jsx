import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";

import AppFeatureTour from "../components/guide/AppFeatureTour";
import SearchModal from "../components/SearchModal";
import useTranslation from "../../i18n/useTranslation";
import AppMetaTopBar from "./AppMetaTopBar";

function LearningPageMetaBar({
  startSlot = null,
  searchOptions = [],
  notesGuideSteps = [],
  notesTourStartToken = 0,
  onNotesTourStepChange,
  topBarRef = null,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);
  const [searchOpen, setSearchOpen] = useState(false);

  const toolSlot = (
    <>
      <Tooltip title={t("note.toolbar.searchNotes")}>
        <Button
          shape="circle"
          className="app-page-shell__tool-btn"
          icon={<SearchOutlined />}
          onClick={() => setSearchOpen(true)}
          aria-label={t("note.toolbar.searchNotes")}
        />
      </Tooltip>
      <Tooltip title={t("common.backToHome", "Back to Home")}>
        <Button
          shape="circle"
          className="app-page-shell__tool-btn"
          icon={<HomeOutlined />}
          onClick={() => navigate("/")}
          aria-label={t("common.backToHome", "Back to Home")}
        />
      </Tooltip>
      {Array.isArray(notesGuideSteps) && notesGuideSteps.length > 0 ? (
        <AppFeatureTour
          guideKey="notes_page"
          steps={notesGuideSteps}
          iconOnly
          buttonAriaLabel={t("note.toolbar.learningGuide")}
          triggerClassName="app-meta-topbar__guide-trigger"
          startToken={notesTourStartToken}
          onBeforeStepChange={onNotesTourStepChange}
        />
      ) : null}
    </>
  );

  return (
    <>
      <AppMetaTopBar
        t={t}
        theme={theme}
        language={language}
        dispatch={dispatch}
        navigate={navigate}
        startSlot={startSlot}
        toolSlot={toolSlot}
        topBarRef={topBarRef}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} localOptions={searchOptions} />
    </>
  );
}

export default LearningPageMetaBar;
