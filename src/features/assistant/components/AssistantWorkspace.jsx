import { useEffect, useMemo, useRef, useState } from "react";
import {
  BoldOutlined,
  FileImageOutlined,
  ItalicOutlined,
  LinkOutlined,
  NumberOutlined,
  OrderedListOutlined,
  PaperClipOutlined,
  SendOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Alert, Button, Input, Radio, Space, Tag, Typography } from "antd";

import useTranslation from "../../../i18n/useTranslation";
import "./AssistantWorkspace.css";

const { Text, Paragraph } = Typography;

function focusEditorAtNoteCursorAnchor(editor) {
  if (!editor) return;
  editor.focus();
  const anchor = editor.querySelector("[data-note-cursor-anchor]");
  if (!anchor) return;

  anchor.removeAttribute("data-note-cursor-anchor");
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(anchor);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function AssistantWorkspace({
  activeTool = "qa",
  onToolChange,
  qaInput,
  onQaInputChange,
  qaMessages = [],
  onSendQa,
  onOpenReferencePicker,
  onPickImages,
  onPickAttachments,
  qaReferenceCount = 0,
  qaImageCount = 0,
  qaAttachmentCount = 0,
  qaImageNames = [],
  qaAttachmentNames = [],
  qaReferenceNames = [],
  onRemoveQaReference,
  onRemoveQaImage,
  onRemoveQaAttachment,
  qaPending = false,
  qaError = "",
  scratchText,
  onScratchHtmlChange,
  onScratchSave,
  scratchSavedHint,
  quizPrompt,
  onQuizPromptChange,
  quizGoal,
  quizLevel,
  quizQuestionTypes = [],
  quizQuestions = [],
  quizAnswers = {},
  quizEvaluations = {},
  quizEvaluationPendingMap = {},
  onQuizLevelChange,
  onQuizAnswerChange,
  onQuizGenerate,
  onQuizEvaluateQuestion,
  quizPending = false,
  quizError = "",
  hideToolTabs = false,
}) {
  const { t } = useTranslation();
  const imageInputRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const editorRef = useRef(null);
  const [noteTitle, setNoteTitle] = useState("");

  const toolLabels = useMemo(
    () => ({
      qa: "Q&A",
      notes: t("learningSupport.tabs.notes"),
      quiz: "Mock interview",
    }),
    [t],
  );

  useEffect(() => {
    if (activeTool !== "notes" || !editorRef.current) return;
    const shouldFocus = String(scratchText || "").includes('data-note-cursor-anchor="true"');
    if (editorRef.current.innerHTML !== scratchText) {
      editorRef.current.innerHTML = scratchText || "";
      if (shouldFocus) {
        window.requestAnimationFrame(() => {
          focusEditorAtNoteCursorAnchor(editorRef.current);
        });
      }
    }
  }, [activeTool, scratchText]);

  const triggerEditorCommand = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    onScratchHtmlChange?.(editorRef.current.innerHTML);
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    onScratchHtmlChange?.(editorRef.current.innerHTML);
  };

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files || []);
    onPickImages?.(files);
    event.target.value = "";
  };

  const handleAttachmentSelection = (event) => {
    const files = Array.from(event.target.files || []);
    onPickAttachments?.(files);
    event.target.value = "";
  };

  const handleQaPressEnter = (event) => {
    if (event.shiftKey) return;
    event.preventDefault();
    onSendQa?.();
  };

  return (
    <div className="assistant-workspace">
      {!hideToolTabs ? (
        <div className="assistant-workspace__tool-tabs">
          <Button
            size="small"
            type={activeTool === "qa" ? "primary" : "default"}
            onClick={() => onToolChange?.("qa")}
          >
            {toolLabels.qa}
          </Button>
          <Button
            size="small"
            type={activeTool === "notes" ? "primary" : "default"}
            onClick={() => onToolChange?.("notes")}
          >
            {toolLabels.notes}
          </Button>
          <Button
            size="small"
            type={activeTool === "quiz" ? "primary" : "default"}
            onClick={() => onToolChange?.("quiz")}
          >
            {toolLabels.quiz}
          </Button>
        </div>
      ) : null}

      {activeTool === "qa" && (
        <div className="assistant-workspace__body">
          {qaError ? <Alert type="error" showIcon message={qaError} /> : null}
          <div className="assistant-workspace__chat-log">
            {qaMessages.map((msg) => (
              <div
                key={msg.id}
                className={`assistant-workspace__chat-msg assistant-workspace__chat-msg--${msg.role}`}
              >
                <Text strong>{msg.role === "user" ? "You" : "Assistant"}</Text>
                {msg.role === "assistant" ? (
                  <div className="assistant-workspace__chat-markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <Paragraph className="assistant-workspace__chat-text">{msg.text}</Paragraph>
                )}
              </div>
            ))}
          </div>
          <div className="assistant-workspace__qa-tools">
            {onOpenReferencePicker ? (
              <Button size="small" icon={<LinkOutlined />} onClick={onOpenReferencePicker}>
                Reference notes {qaReferenceCount > 0 ? `(${qaReferenceCount})` : ""}
              </Button>
            ) : null}
            <Button
              size="small"
              icon={<FileImageOutlined />}
              onClick={() => imageInputRef.current?.click()}
            >
              Add images {qaImageCount > 0 ? `(${qaImageCount})` : ""}
            </Button>
            <Button
              size="small"
              icon={<PaperClipOutlined />}
              onClick={() => attachmentInputRef.current?.click()}
            >
              Add files {qaAttachmentCount > 0 ? `(${qaAttachmentCount})` : ""}
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleImageSelection}
            />
            <input
              ref={attachmentInputRef}
              type="file"
              multiple
              hidden
              onChange={handleAttachmentSelection}
            />
          </div>
          {qaReferenceNames.length > 0 || qaImageNames.length > 0 || qaAttachmentNames.length > 0 ? (
            <div className="assistant-workspace__asset-tags">
              {qaReferenceNames.map((name) => (
                <Tag
                  key={`ref-${name}`}
                  closable
                  onClose={(event) => {
                    event.preventDefault();
                    onRemoveQaReference?.(name);
                  }}
                >
                  Ref: {name}
                </Tag>
              ))}
              {qaImageNames.map((name) => (
                <Tag
                  key={`img-${name}`}
                  closable
                  onClose={(event) => {
                    event.preventDefault();
                    onRemoveQaImage?.(name);
                  }}
                >
                  Img: {name}
                </Tag>
              ))}
              {qaAttachmentNames.map((name) => (
                <Tag
                  key={`att-${name}`}
                  closable
                  onClose={(event) => {
                    event.preventDefault();
                    onRemoveQaAttachment?.(name);
                  }}
                >
                  File: {name}
                </Tag>
              ))}
            </div>
          ) : null}
          <div className="assistant-workspace__qa-compose">
            <Input.TextArea
              value={qaInput}
              onChange={(event) => onQaInputChange?.(event.target.value)}
              placeholder="Message..."
              onPressEnter={handleQaPressEnter}
              autoSize={false}
              rows={2}
              className="assistant-workspace__qa-input"
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              loading={qaPending}
              onClick={onSendQa}
              className="assistant-workspace__qa-send-btn"
              aria-label="Send"
            />
          </div>
        </div>
      )}

      {activeTool === "notes" && (
        <div className="assistant-workspace__body assistant-workspace__body--notes">
          <Text type="secondary">Quick notes with standard rich-text controls. No AI call.</Text>
          <Input
            value={noteTitle}
            onChange={(event) => setNoteTitle(event.target.value)}
            placeholder="Note title"
            className="assistant-workspace__note-title"
          />
          <div className="assistant-workspace__editor-toolbar">
            <Button size="small" icon={<BoldOutlined />} onClick={() => triggerEditorCommand("bold")}>
              Bold
            </Button>
            <Button
              size="small"
              icon={<ItalicOutlined />}
              onClick={() => triggerEditorCommand("italic")}
            >
              Italic
            </Button>
            <Button
              size="small"
              icon={<UnderlineOutlined />}
              onClick={() => triggerEditorCommand("underline")}
            >
              Underline
            </Button>
            <Button
              size="small"
              icon={<OrderedListOutlined />}
              onClick={() => triggerEditorCommand("insertUnorderedList")}
            >
              Bullet
            </Button>
            <Button
              size="small"
              icon={<NumberOutlined />}
              onClick={() => triggerEditorCommand("insertOrderedList")}
            >
              Numbered
            </Button>
          </div>
          <div className="assistant-workspace__editor-shell">
            <div
              ref={editorRef}
              className="assistant-workspace__editor"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              data-placeholder="Write your notes here..."
            />
          </div>
          <Space>
            <Button type="primary" onClick={onScratchSave}>
              Save
            </Button>
            {scratchSavedHint ? <Text type="secondary">{scratchSavedHint}</Text> : null}
          </Space>
        </div>
      )}

      {activeTool === "quiz" && (
        <div className="assistant-workspace__body">
          <Text type="secondary">
            Practice interview questions grounded in the current topic, then get structured feedback on your answer.
          </Text>
          {quizError ? <Alert type="error" showIcon message={quizError} /> : null}
          <Input
            value={quizPrompt}
            onChange={(event) => onQuizPromptChange?.(event.target.value)}
            placeholder="Optional: target role, company, or interview focus"
            aria-label="Mock interview focus"
          />
          <div className="assistant-workspace__quiz-block">
            <Text strong>Interview depth</Text>
            <Radio.Group
              className="assistant-workspace__quiz-options"
              value={quizLevel}
              onChange={(event) => onQuizLevelChange?.(event.target.value)}
            >
              <Radio.Button value="easy">Warm-up</Radio.Button>
              <Radio.Button value="medium">Standard</Radio.Button>
              <Radio.Button value="hard">Deep dive</Radio.Button>
            </Radio.Group>
          </div>
          <Space>
            <Button
              type="primary"
              disabled={!quizGoal || !quizLevel || quizQuestionTypes.length === 0}
              loading={quizPending}
              onClick={() => onQuizGenerate?.()}
            >
              Start mock interview
            </Button>
            <Button
              disabled={!quizGoal || !quizLevel || quizQuestionTypes.length === 0}
              loading={quizPending}
              onClick={() => onQuizGenerate?.()}
            >
              New questions
            </Button>
          </Space>
          <div className="assistant-workspace__quiz-list">
            {quizQuestions.map((question, idx) => (
              <div key={question.id || idx} className="assistant-workspace__quiz-card">
                <Text strong>{`Q${idx + 1}. ${question.text}`}</Text>
                {question.type === "mcq" ? (
                  <div className="assistant-workspace__quiz-answer-block">
                    <Radio.Group
                      value={quizAnswers[question.id]}
                      onChange={(event) => onQuizAnswerChange?.(question.id, event.target.value)}
                    >
                      <Space direction="vertical">
                        {(question.options || []).map((option, optionIdx) => {
                          const optionText =
                            typeof option === "string"
                              ? option
                              : option?.text || option?.label || option?.content || String(option);
                          const optionValue =
                            typeof option === "string"
                              ? option
                              : option?.value || option?.id || optionText;
                          return (
                            <Radio key={`${question.id}-opt-${optionIdx}`} value={optionValue}>
                              {String.fromCharCode(65 + optionIdx)}. {optionText}
                            </Radio>
                          );
                        })}
                      </Space>
                    </Radio.Group>
                    <Button
                      size="small"
                      type="primary"
                      loading={Boolean(quizEvaluationPendingMap[question.id])}
                      onClick={() => onQuizEvaluateQuestion?.(question)}
                    >
                      Get feedback
                    </Button>
                  </div>
                ) : (
                  <div className="assistant-workspace__quiz-answer-block">
                    <Input.TextArea
                      rows={3}
                      value={quizAnswers[question.id] || ""}
                      placeholder="Answer as if you were speaking to an interviewer..."
                      onChange={(event) => onQuizAnswerChange?.(question.id, event.target.value)}
                    />
                    <Button
                      size="small"
                      type="primary"
                      loading={Boolean(quizEvaluationPendingMap[question.id])}
                      onClick={() => onQuizEvaluateQuestion?.(question)}
                    >
                      Get feedback
                    </Button>
                  </div>
                )}
                {quizEvaluations[question.id] ? (
                  <div className="assistant-workspace__quiz-eval">
                    <Text strong>
                      {(quizEvaluations[question.id].score ?? 0) >= 0.7 ? "Interview-ready response" : "Keep refining"}
                    </Text>
                    <Text>Readiness score: {quizEvaluations[question.id].score ?? "-"}</Text>
                    {quizEvaluations[question.id].feedback ? (
                      <Text>Feedback: {quizEvaluations[question.id].feedback}</Text>
                    ) : null}
                    {quizEvaluations[question.id].suggested_answer ? (
                      <Text>Stronger answer: {quizEvaluations[question.id].suggested_answer}</Text>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AssistantWorkspace;
