import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, message, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowsAltOutlined,
  CloseOutlined,
  ShrinkOutlined,
  MinusOutlined,
  RobotOutlined,
} from "@ant-design/icons";

import { decideAssistantAction, requestProductAssistant } from "../api/assistant";
import { translateContent } from "../../../shared/api/translations";
import useTranslation from "../../../i18n/useTranslation";
import AssistantWorkspace from "./AssistantWorkspace";
import useCurrentUserSummary from "../../profile/hooks/useCurrentUserSummary";
import { GlobalAssistantContext } from "./GlobalAssistantContext";
import { GLOBAL_ASSISTANT_ENABLED, PILOT_BACKEND_ENABLED } from "../../../config/productMode";
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

const LAUNCHER_WIDTH = 56;
const LAUNCHER_HEIGHT = 56;

function getDefaultPosition() {
  if (typeof window === "undefined") return { left: 24, top: 24 };
  return clampPosition(
    {
      left: window.innerWidth - LAUNCHER_WIDTH - 24,
      top: window.innerHeight - LAUNCHER_HEIGHT - 24,
    },
    false,
    false,
  );
}

function getAssistantSize(isOpen, isExpanded) {
  if (!isOpen) return { width: LAUNCHER_WIDTH, height: LAUNCHER_HEIGHT };
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

function alignPositionForState(
  position,
  { isOpen, isExpanded, previousOpen, previousExpanded },
) {
  if (isOpen === previousOpen && isExpanded === previousExpanded) {
    return clampPosition(position, isOpen, isExpanded);
  }

  if (isOpen && !previousOpen) {
    const launcher = getAssistantSize(false, false);
    const panel = getAssistantSize(true, isExpanded);
    return clampPosition(
      {
        left: position.left + launcher.width - panel.width,
        top: position.top + launcher.height - panel.height,
      },
      true,
      isExpanded,
    );
  }

  if (!isOpen && previousOpen) {
    const panel = getAssistantSize(true, previousExpanded);
    const launcher = getAssistantSize(false, false);
    return clampPosition(
      {
        left: position.left + panel.width - launcher.width,
        top: position.top + panel.height - launcher.height,
      },
      false,
      false,
    );
  }

  if (isOpen && previousOpen && isExpanded !== previousExpanded) {
    const previousPanel = getAssistantSize(true, previousExpanded);
    const nextPanel = getAssistantSize(true, isExpanded);
    return clampPosition(
      {
        left: position.left + previousPanel.width - nextPanel.width,
        top: position.top + previousPanel.height - nextPanel.height,
      },
      true,
      isExpanded,
    );
  }

  return clampPosition(position, isOpen, isExpanded);
}

export default function GlobalAssistantProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useTranslation();
  const currentUser = useCurrentUserSummary({ disabled: !PILOT_BACKEND_ENABLED });
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
  const [conversationId, setConversationId] = useState("");
  const [actionProposals, setActionProposals] = useState([]);
  const [proposalPendingId, setProposalPendingId] = useState("");
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
    if (!GLOBAL_ASSISTANT_ENABLED) return;
    if (!currentUser.isAuthenticated) {
      navigate("/user/login", {
        state: { from: `${location.pathname}${location.search}${location.hash}` },
      });
      return;
    }
    setPosition((prev) =>
      alignPositionForState(prev, {
        isOpen: true,
        isExpanded: assistantExpanded,
        previousOpen: false,
        previousExpanded: false,
      }),
    );
    setAssistantOpen(true);
    if (prompt) setQaInput(prompt);
  }, [assistantExpanded, currentUser.isAuthenticated, location.hash, location.pathname, location.search, navigate]);

  const closeAssistant = useCallback(() => {
    setPosition((prev) =>
      alignPositionForState(prev, {
        isOpen: false,
        isExpanded: false,
        previousOpen: true,
        previousExpanded: assistantExpanded,
      }),
    );
    setAssistantOpen(false);
  }, [assistantExpanded]);

  const toggleAssistantExpanded = useCallback(() => {
    setAssistantExpanded((previousExpanded) => {
      const nextExpanded = !previousExpanded;
      setPosition((prev) =>
        alignPositionForState(prev, {
          isOpen: true,
          isExpanded: nextExpanded,
          previousOpen: true,
          previousExpanded,
        }),
      );
      return nextExpanded;
    });
  }, []);

  const removeSelectedFile = (list, fileName) => list.filter((file) => file.name !== fileName);

  const localizeAssistantMessages = async (messages) => {
    const targetLanguage = String(language || "en").toLowerCase();
    if (targetLanguage === "en") return messages;
    return Promise.all(
      messages.map(async (item) => {
        if (item.role !== "assistant" || !String(item.text || "").trim()) return item;
        try {
          const translated = await translateContent({
            source_type: "assistant_response",
            source_id: `global-assistant:${item.id}`,
            source_language: "en",
            target_language: targetLanguage,
            content: item.text,
          });
          return {
            ...item,
            text: translated?.translated_content || item.text,
          };
        } catch {
          return item;
        }
      }),
    );
  };

  const handleSendQa = async () => {
    if (!currentUser.isAuthenticated) {
      navigate("/user/login", {
        state: { from: `${location.pathname}${location.search}${location.hash}` },
      });
      return;
    }
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
        conversation_id: conversationId || undefined,
        ...assistantContextPayload,
      };
      const response = await requestProductAssistant(payload, {
        images: qaImageFiles,
        attachments: qaAttachmentFiles,
      });
      if (response?.conversation_id) setConversationId(response.conversation_id);
      const nextProposals = Array.isArray(response?.action_proposals)
        ? response.action_proposals.filter((proposal) => proposal?.status === "proposed").slice(-3)
        : [];
      setActionProposals(nextProposals);
      const rawResponseMessages = Array.isArray(response?.messages)
        ? response.messages.map((item) => ({
            id: item.message_id || `global-qa-${Date.now()}-${Math.random()}`,
            role: item.role || "assistant",
            text: item.text || "",
          }))
        : [
            ...nextMessages,
            {
              id: `global-qa-assistant-${Date.now()}`,
              role: "assistant",
              text: resolveQaAnswerText(response) || "No response content.",
            },
          ];
      const responseMessages = await localizeAssistantMessages(rawResponseMessages);
      setQaMessages(responseMessages);
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

  const handleProposalDecision = async (proposal, decision) => {
    if (!proposal?.proposal_id || proposalPendingId) return;
    setProposalPendingId(proposal.proposal_id);
    try {
      await decideAssistantAction(proposal.proposal_id, { decision });
      setActionProposals((prev) =>
        prev.filter((item) => item.proposal_id !== proposal.proposal_id),
      );
      if (decision === "apply") {
        window.dispatchEvent(new CustomEvent("learning-path-updated"));
        message.success("Learning path updated.");
      } else if (decision === "accept") {
        message.success("Action accepted for review.");
      } else {
        message.info("Action rejected.");
      }
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Action update failed.";
      message.error(errorText);
    } finally {
      setProposalPendingId("");
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

  const contextValue = useMemo(() => ({ openAssistant }), [openAssistant]);

  return (
    <GlobalAssistantContext.Provider value={contextValue}>
      {children}
      {GLOBAL_ASSISTANT_ENABLED && assistantOpen ? (
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
                onClick={toggleAssistantExpanded}
                aria-label={assistantExpanded ? "Restore assistant" : "Expand assistant"}
              />
              <Button
                type="text"
                size="small"
                icon={<MinusOutlined />}
                onClick={closeAssistant}
                aria-label="Minimize assistant"
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => {
                  closeAssistant();
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
            {actionProposals.length > 0 ? (
              <div className="global-assistant__proposals" aria-label="Assistant action proposals">
                {actionProposals.map((proposal) => (
                  <article className="global-assistant__proposal" key={proposal.proposal_id}>
                    <div className="global-assistant__proposal-copy">
                      <Text strong>{proposal.title || proposal.action_type}</Text>
                      {proposal.description ? (
                        <Text type="secondary">{proposal.description}</Text>
                      ) : null}
                    </div>
                    <div className="global-assistant__proposal-actions">
                      <Button
                        size="small"
                        onClick={() => handleProposalDecision(proposal, "reject")}
                        loading={proposalPendingId === proposal.proposal_id}
                      >
                        Reject
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleProposalDecision(proposal, "accept")}
                        loading={proposalPendingId === proposal.proposal_id}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => handleProposalDecision(proposal, "apply")}
                        loading={proposalPendingId === proposal.proposal_id}
                      >
                        Apply
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : GLOBAL_ASSISTANT_ENABLED ? (
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
            openAssistant();
          }}
          aria-label="Open learning assistant"
          title="Open learning assistant"
        >
          <RobotOutlined aria-hidden="true" />
        </button>
      ) : null}
    </GlobalAssistantContext.Provider>
  );
}
