import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, message, Typography } from "antd";
import {
  ArrowsAltOutlined,
  CloseOutlined,
  ShrinkOutlined,
  MinusOutlined,
  RobotOutlined,
} from "@ant-design/icons";

import { requestAssistantQa } from "../../api/assistant";
import AssistantWorkspace from "./AssistantWorkspace";
import { GlobalAssistantContext } from "./GlobalAssistantContext";
import "./GlobalAssistantProvider.css";

const { Text } = Typography;

function resolveQaAnswerText(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  return (
    payload.answer ||
    payload.response ||
    payload.message ||
    payload.data?.answer ||
    payload.data?.response ||
    ""
  );
}

function getDefaultPosition() {
  if (typeof window === "undefined") return { left: 24, top: 24 };
  return {
    left: Math.max(16, window.innerWidth - 80),
    top: Math.max(16, window.innerHeight - 80),
  };
}

function getAssistantSize(isOpen, isExpanded) {
  if (!isOpen) return { width: 64, height: 64 };
  return isExpanded ? { width: 560, height: 680 } : { width: 380, height: 560 };
}

function clampPosition(nextPosition, isOpen, isExpanded = false) {
  if (typeof window === "undefined") return nextPosition;
  const { width, height } = getAssistantSize(isOpen, isExpanded);
  return {
    left: Math.min(Math.max(12, nextPosition.left), Math.max(12, window.innerWidth - width - 12)),
    top: Math.min(Math.max(12, nextPosition.top), Math.max(12, window.innerHeight - height - 12)),
  };
}

export default function GlobalAssistantProvider({ children }) {
  const currentMeta = useSelector((state) => state.currentNote.meta);
  const currentNoteContent = useSelector((state) => state.currentNote.content);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantExpanded, setAssistantExpanded] = useState(false);
  const [qaInput, setQaInput] = useState("");
  const [qaMessages, setQaMessages] = useState([]);
  const [qaImageFiles, setQaImageFiles] = useState([]);
  const [qaAttachmentFiles, setQaAttachmentFiles] = useState([]);
  const [qaPending, setQaPending] = useState(false);
  const [qaError, setQaError] = useState("");
  const [position, setPosition] = useState(getDefaultPosition);
  const dragStateRef = useRef(null);
  const dragMovedRef = useRef(false);

  const noteName = currentMeta?.title || currentMeta?.name || "this workspace";

  const assistantContextPayload = useMemo(
    () => ({
      currentNote: {
        title: noteName,
        url: currentMeta?.url || (typeof window !== "undefined" ? window.location.pathname : ""),
        content: currentNoteContent || "",
      },
      references: [],
    }),
    [currentMeta?.url, currentNoteContent, noteName],
  );

  const openAssistant = useCallback(({ prompt = "" } = {}) => {
    setPosition((prev) => clampPosition(prev, true, assistantExpanded));
    setAssistantOpen(true);
    if (prompt) setQaInput(prompt);
  }, [assistantExpanded]);

  const removeSelectedFile = (list, fileName) => list.filter((file) => file.name !== fileName);

  const handleSendQa = async () => {
    const trimmedQuestion = qaInput.trim();
    if (!trimmedQuestion || qaPending) return;

    setQaError("");
    const userMessage = {
      id: `global-qa-user-${Date.now()}`,
      role: "user",
      text: trimmedQuestion,
    };
    const nextMessages = [...qaMessages, userMessage];
    setQaMessages(nextMessages);
    setQaInput("");
    setQaPending(true);

    try {
      const payload = {
        question: trimmedQuestion,
        history: nextMessages.slice(-12).map((item) => ({ role: item.role, content: item.text })),
        ...assistantContextPayload,
      };
      const response = await requestAssistantQa(payload, {
        images: qaImageFiles,
        attachments: qaAttachmentFiles,
      });
      setQaMessages((prev) => [
        ...prev,
        {
          id: `global-qa-assistant-${Date.now()}`,
          role: "assistant",
          text: resolveQaAnswerText(response) || "No response content.",
        },
      ]);
      setQaImageFiles([]);
      setQaAttachmentFiles([]);
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Assistant request failed.";
      setQaError(errorText);
      message.error(errorText);
    } finally {
      setQaPending(false);
    }
  };

  const startDrag = (event) => {
    if (event.button !== 0) return;
    const pointerTarget = event.target;
    if (
      pointerTarget?.closest?.("textarea, input, a") ||
      (pointerTarget?.closest?.("button") && !pointerTarget.closest(".global-assistant__launcher"))
    ) {
      return;
    }
    event.preventDefault();
    dragMovedRef.current = false;
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startLeft: position.left,
      startTop: position.top,
      isOpen: assistantOpen,
      isExpanded: assistantExpanded,
    };
  };

  useEffect(() => {
    const onMouseMove = (event) => {
      if (!dragStateRef.current) return;
      const nextPosition = clampPosition(
        {
          left: dragStateRef.current.startLeft + event.clientX - dragStateRef.current.startX,
          top: dragStateRef.current.startTop + event.clientY - dragStateRef.current.startY,
        },
        dragStateRef.current.isOpen,
        dragStateRef.current.isExpanded,
      );
      if (
        Math.abs(event.clientX - dragStateRef.current.startX) > 3 ||
        Math.abs(event.clientY - dragStateRef.current.startY) > 3
      ) {
        dragMovedRef.current = true;
      }
      setPosition(nextPosition);
    };
    const onMouseUp = () => {
      dragStateRef.current = null;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const onResize = () => setPosition((prev) => clampPosition(prev, assistantOpen, assistantExpanded));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [assistantOpen, assistantExpanded]);

  useEffect(() => {
    setPosition((prev) => clampPosition(prev, assistantOpen, assistantExpanded));
  }, [assistantExpanded, assistantOpen]);

  const contextValue = useMemo(() => ({ openAssistant }), [openAssistant]);

  return (
    <GlobalAssistantContext.Provider value={contextValue}>
      {children}
      {assistantOpen ? (
        <section
          className={`global-assistant global-assistant--open ${
            assistantExpanded ? "global-assistant--expanded" : ""
          }`}
          style={{ left: `${position.left}px`, top: `${position.top}px` }}
          aria-label="Global AI assistant"
        >
          <header className="global-assistant__header" onMouseDown={startDrag}>
            <div className="global-assistant__title">
              <span className="global-assistant__avatar" aria-hidden="true">
                <RobotOutlined />
              </span>
              <div>
                <Text strong>Learning Assistant</Text>
                <Text type="secondary">Ask about notes, careers, or your learning path.</Text>
              </div>
            </div>
            <div className="global-assistant__window-actions">
              <Button
                type="text"
                size="small"
                icon={assistantExpanded ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                onClick={() => setAssistantExpanded((value) => !value)}
                aria-label={assistantExpanded ? "Restore assistant" : "Expand assistant"}
              />
              <Button
                type="text"
                size="small"
                icon={<MinusOutlined />}
                onClick={() => setAssistantOpen(false)}
                aria-label="Minimize assistant"
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => {
                  setAssistantOpen(false);
                  setQaInput("");
                }}
                aria-label="Close assistant"
              />
            </div>
          </header>
          <div className="global-assistant__body">
            <AssistantWorkspace
              noteName={noteName}
              activeTool="qa"
              qaInput={qaInput}
              onQaInputChange={setQaInput}
              qaMessages={qaMessages}
              onSendQa={handleSendQa}
              onPickImages={(files) => setQaImageFiles((prev) => [...prev, ...files])}
              onPickAttachments={(files) => setQaAttachmentFiles((prev) => [...prev, ...files])}
              qaImageCount={qaImageFiles.length}
              qaAttachmentCount={qaAttachmentFiles.length}
              qaImageNames={qaImageFiles.map((file) => file.name)}
              qaAttachmentNames={qaAttachmentFiles.map((file) => file.name)}
              onRemoveQaImage={(name) => setQaImageFiles((prev) => removeSelectedFile(prev, name))}
              onRemoveQaAttachment={(name) =>
                setQaAttachmentFiles((prev) => removeSelectedFile(prev, name))
              }
              qaPending={qaPending}
              qaError={qaError}
              hideToolTabs
            />
          </div>
        </section>
      ) : (
        <button
          type="button"
          className="global-assistant global-assistant__launcher"
          style={{ left: `${position.left}px`, top: `${position.top}px` }}
          onMouseDown={startDrag}
          onClick={() => {
            if (dragMovedRef.current) {
              dragMovedRef.current = false;
              return;
            }
            setPosition((prev) => clampPosition(prev, true, assistantExpanded));
            setAssistantOpen(true);
          }}
          aria-label="Open learning assistant"
          title="Open learning assistant"
        >
          <RobotOutlined aria-hidden="true" />
        </button>
      )}
    </GlobalAssistantContext.Provider>
  );
}
