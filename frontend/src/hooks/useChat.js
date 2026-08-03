import { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api.js";
import { STATIC_CONFIG_URLS } from "../constants.js";
import { findRegistrationLink } from "../services/registrationLinks.js";

let idCounter = 0;
const nextId = () => `m${Date.now()}_${idCounter++}`;

const WELCOME_MESSAGE = {
  id: nextId(),
  role: "bot",
  type: "text",
  content:
    "Hi 👋 I'm the **ICFAI University Dehradun AI Assistant**. I'm here to help you explore Programs, Admissions, Campus Life, Placements and Scholarships.",
};

const QUICK_ACTIONS = [
  { key: "about_ifhe", label: "About ICFAI University Dehradun" },
  { key: "programs", label: "Programs Offered" },
  { key: "campus_life", label: "Campus Life" },
  { key: "placements", label: "Placements" },
  { key: "admissions.calendar", label: "Admission Calendar" },
  { key: "apply_now", label: "Apply Now" },
  { key: "ask", label: "Ask Anything" },
];

function getProgramGroupLabel(program) {
  const name = program.name;
  if (name.startsWith("B.Tech")) return "B.Tech";
  if (name.startsWith("BBA - LLB")) return "BBA LLB";
  if (name.startsWith("BAJ - LLB")) return "BAJ LLB";
  if (name.startsWith("BA - LLB")) return "BA LLB";
  if (name.startsWith("BBA")) return "BBA";
  if (name.startsWith("BCA")) return "BCA";
  if (name.startsWith("B.Sc")) return "B.Sc";
  if (name.startsWith("B.Arch")) return "B.Arch";
  if (name.startsWith("BA (")) return "BA";
  if (name.startsWith("B.Com")) return "B.Com";
  if (name.startsWith("MBA")) return "MBA";
  if (name.startsWith("Executive MBA")) return "Executive MBA";
  if (name.startsWith("M.Tech")) return "M.Tech";
  if (name.startsWith("M.Sc")) return "M.Sc";
  if (name.includes("LLM")) return "LLM";
  if (name.startsWith("Ph.D")) return "Ph.D";
  if (name.startsWith("Online")) return "Online Programs";
  if (name.startsWith("Distance")) return "Distance Programs";
  if (name.startsWith("Certificate Program in Law")) return "Law Certificates";
  if (name.startsWith("Certificate Program")) return "Certificate Programs";
  return name.split(" ")[0];
}

function buildProgramGroups(programs) {
  const groups = new Map();
  programs.forEach((program) => {
    const label = getProgramGroupLabel(program);
    if (!groups.has(label)) {
      groups.set(label, { label, programs: [] });
    }
    groups.get(label).programs.push(program);
  });
  return Array.from(groups.values());
}

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [stage, setStage] = useState("ask_name"); // ask_name | home | form
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [interactionCount, setInteractionCount] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState(null);
  const currentProgramContext = useRef(null); // { level, program } for "Ask AI about this course"

  const pushMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: nextId(), ...msg }]);
  }, []);

  const removeQuickActions = useCallback(() => {
    setMessages((prev) => prev.filter((msg) => msg.type !== "quickActions"));
  }, []);

  const removeBackActions = useCallback(() => {
    setMessages((prev) => prev.filter((msg) => msg.type !== "backActions"));
  }, []);

  const pushHomeMenu = useCallback(() => {
    pushMessage({
      role: "bot",
      type: "quickActions",
      content: "How can I help you today?",
      actions: QUICK_ACTIONS,
    });
  }, [pushMessage]);

  const bumpInteraction = useCallback(() => {
    setInteractionCount((prev) => prev + 1);
  }, []);

  const pushKnowMorePrompt = useCallback(
    (count) => {
      const currentCount = count ?? interactionCount;
      if (currentCount >= 3 && !user && stage !== "ask_name") {
        setMessages((prev) => prev.filter((msg) => msg.type !== "knowMorePrompt"));
        pushMessage({ role: "bot", type: "knowMorePrompt" });
      }
    },
    [interactionCount, user, stage, pushMessage]
  );

  const showUserDetailsForm = useCallback((redirectUrl = null) => {
    setPendingRedirectUrl(redirectUrl);
    setStage("form");
    pushMessage({ role: "bot", type: "form" });
  }, [pushMessage]);

  const applyNowForProgram = useCallback(
    (program) => {
      const programUrl =
        program?.registration_url ||
        program?.apply_now_url ||
        findRegistrationLink(program)?.registration_url ||
        `${STATIC_CONFIG_URLS.applyNow}?program=${encodeURIComponent(program?.id || "")}`;
      showUserDetailsForm(programUrl);
    },
    [showUserDetailsForm]
  );

  const goHome = useCallback(() => {
    setStage("home");
    removeQuickActions();
    removeBackActions();
    pushHomeMenu(user?.name?.split(" ")[0]);
  }, [pushHomeMenu, removeBackActions, removeQuickActions, user]);

  const submitName = useCallback(
    (name) => {
      const cleanedName = name.trim();
      if (!cleanedName) return;
      setUserName(cleanedName);
      pushMessage({ role: "user", type: "text", content: cleanedName });
      pushMessage({ role: "bot", type: "text", content: `Nice to meet you, ${cleanedName}! What would you like to know about ICFAI University Dehradun today?` });
      pushHomeMenu();
      setStage("home");
    },
    [pushHomeMenu, pushMessage]
  );

  // ---------------- User details form ----------------
  const submitUserForm = useCallback(
    async (formData) => {
      const cleanedFormData = {
        ...formData,
        name: formData.name.trim() || userName,
      };
      pushMessage({ role: "user", type: "text", content: `${cleanedFormData.name} • ${cleanedFormData.email} • ${cleanedFormData.city}, ${cleanedFormData.state}` });
      setIsTyping(true);

      // IMPORTANT: do NOT pass "noopener"/"noreferrer" as window features here.
      // Browsers return `null` from window.open() when the "noopener" feature is
      // set, which meant `redirectWindow` was always null, which meant the code
      // always fell through to opening a new window *after* the `await` below —
      // outside the synchronous user-gesture window, where popup blockers either
      // block it or leave it stuck on about:blank.
      let redirectWindow = null;
      if (pendingRedirectUrl) {
        redirectWindow = window.open("about:blank", "_blank");
      }

      try {
        const savedUser = await api.saveUser(cleanedFormData);
        setUser(savedUser);
        removeQuickActions();
        removeBackActions();
        if (pendingRedirectUrl) {
          // Apply flow: redirect to the application page in the same tab
          const redirectUrl = pendingRedirectUrl;
          setPendingRedirectUrl(null);
          // provide a friendly message before redirecting
          setStage("completed");
          pushMessage({
            role: "bot",
            type: "text",
            content: `Thank you, ${savedUser.name.split(" ")[0]}. Redirecting you to the application page now...`,
          });
          // If we pre-opened a blank window (to satisfy popup blockers),
          // navigate that window to the redirect URL so the original tab
          // stays where it is. Fallback to same-tab navigation if the
          // pre-opened window was blocked or closed.
          if (redirectWindow && !redirectWindow.closed) {
            try {
              redirectWindow.opener = null;
            } catch {
              /* some browsers disallow this; ignore */
            }
            try {
              redirectWindow.location.href = redirectUrl;
            } catch {
              // If navigating the new window fails, fallback to same-tab.
              window.location.href = redirectUrl;
            }
          } else {
            // Fallback: navigate in same tab
            window.location.href = redirectUrl;
          }
          return;
        }

        // Know-more flow: stop and disable the chatbot UI after saving
        setStage("completed");
        setDisabled(true);
        pushMessage({
          role: "bot",
          type: "text",
          content: `Thank you, ${savedUser.name.split(" ")[0]}. Your details are saved. The assistant is now disabled.`,
        });
      } catch (err) {
        if (redirectWindow && !redirectWindow.closed) {
          redirectWindow.close();
        }
        pushMessage({
          role: "bot",
          type: "text",
          content: `Sorry, I couldn't save your details (${err.message}). Please try again.`,
        });
      } finally {
        setIsTyping(false);
      }
    },
    [pushMessage, removeBackActions, removeQuickActions, userName, pendingRedirectUrl]
  );

  // ---------------- Free text chat (RAG / static / conversation) ----------------
  const sendFreeText = useCallback(
    async (text, { silent } = {}) => {
      if (stage === "ask_name" && !userName) {
        submitName(text);
        return;
      }
      const nextInteraction = !user ? interactionCount + 1 : interactionCount;
      if (!silent) pushMessage({ role: "user", type: "text", content: text });
      if (!user) {
        bumpInteraction();
      }
      setIsTyping(true);
      try {
        const res = await api.sendMessage({
          message: text,
          session_id: sessionId,
          user_id: user?.id,
        });
        setSessionId(res.session_id);
        pushMessage({
          role: "bot",
          type: "text",
          content: res.reply,
          suggestions: res.suggestions,
          intent: res.intent,
          messageId: res.message_id,
        });
        if (res.lead_prompt) {
          pushMessage({ role: "bot", type: "leadPrompt" });
        }
        pushKnowMorePrompt(nextInteraction);
      } catch (err) {
        pushMessage({
          role: "bot",
          type: "text",
          content: `Sorry, something went wrong reaching the assistant (${err.message}).`,
        });
      } finally {
        setIsTyping(false);
      }
    },
    [pushMessage, sessionId, user, stage, userName, submitName, bumpInteraction, pushKnowMorePrompt]
  );

  // ---------------- Guided navigation (menu clicks -> raw JSON, no RAG) ----------------
  const navigateTo = useCallback(
    async (key, label) => {
      const nextInteraction = !user && userName ? interactionCount + 1 : interactionCount;
      pushMessage({ role: "user", type: "text", content: label });
      if (!user && userName) {
        bumpInteraction();
      }

      removeQuickActions();
      removeBackActions();

      if (key === "apply_now") {
        showUserDetailsForm(STATIC_CONFIG_URLS.applyNow);
        pushKnowMorePrompt(nextInteraction);
        return;
      }

      if (key === "ask") {
        pushMessage({ role: "bot", type: "text", content: "Sure — ask me anything about ICFAI University Dehradun! For example: *\"Tell me about MBA eligibility\"* or *\"What are the placement stats?\"*" });
        pushKnowMorePrompt(nextInteraction);
        return;
      }

      if (key === "programs") {
        pushMessage({
          role: "bot",
          type: "programTypes",
          content: "Which program level are you interested in?",
        });
        return;
      }

      setIsTyping(true);
      try {
        const data = await api.navigate(key);
        pushMessage({ role: "bot", type: "navData", navKey: key, data });
        pushKnowMorePrompt(nextInteraction);
      } catch (err) {
        pushMessage({ role: "bot", type: "text", content: `Couldn't load that section (${err.message}).` });
      } finally {
        setIsTyping(false);
      }
    },
    [pushMessage, interactionCount, user, userName, bumpInteraction, pushKnowMorePrompt, removeBackActions, removeQuickActions]
  );

  const selectProgramLevel = useCallback(
    async (level, levelLabel) => {
      const nextInteraction = !user && userName ? interactionCount + 1 : interactionCount;
      pushMessage({ role: "user", type: "text", content: levelLabel });
      if (!user && userName) {
        bumpInteraction();
      }
      removeQuickActions();
      removeBackActions();
      setIsTyping(true);
      try {
        const data = await api.navigate(`programs.${level}`);
        const groups = buildProgramGroups(data.programs || []);
        pushMessage({
          role: "bot",
          type: "programGroups",
          level,
          content: `Choose a ${levelLabel} program type:`,
          groups,
        });
        pushKnowMorePrompt(nextInteraction);
      } catch (err) {
        pushMessage({ role: "bot", type: "text", content: `Couldn't load programs (${err.message}).` });
      } finally {
        setIsTyping(false);
      }
    },
    [pushMessage, removeBackActions, removeQuickActions, interactionCount, user, userName, bumpInteraction, pushKnowMorePrompt]
  );

  const selectProgramGroup = useCallback(
    (level, group) => {
      pushMessage({ role: "user", type: "text", content: group.label });
      removeBackActions();
      pushMessage({ role: "bot", type: "courseList", level, programs: group.programs });
    },
    [pushMessage, removeBackActions]
  );

  const selectCourse = useCallback(
    async (level, program) => {
      pushMessage({ role: "user", type: "text", content: `Tell me more about ${program.name}` });
      currentProgramContext.current = { level, program };
      pushMessage({ role: "bot", type: "courseDetail", level, program });
    },
    [pushMessage]
  );

  const askAiAboutCourse = useCallback(
    (program, apply = false) => {
      if (apply) {
        applyNowForProgram(program);
        return;
      }
      const q = `Tell me about the ${program.name} program at ICFAI University Dehradun`;
      sendFreeText(q);
    },
    [applyNowForProgram, sendFreeText]
  );

  // ---------------- Lead capture ----------------
  const respondToLeadPrompt = useCallback(
    async (choice) => {
      const labelMap = { yes: "Yes, please call me", email: "Email me instead", not_now: "Not now" };
      pushMessage({ role: "user", type: "text", content: labelMap[choice] });

      if (choice === "not_now") {
        pushMessage({ role: "bot", type: "text", content: "No problem! I'm here whenever you're ready. 😊" });
        return;
      }
      try {
        await api.submitLead({
          user_id: user?.id,
          session_id: sessionId,
          interest_topic: currentProgramContext.current?.program?.name || null,
          contact_method: choice === "yes" ? "call" : "email",
        });
        pushMessage({
          role: "bot",
          type: "text",
          content:
            choice === "yes"
              ? "Great! An ICFAI University Dehradun Admission Counsellor will call you shortly. 📞"
              : "Great! An ICFAI University Dehradun Admission Counsellor will email you shortly. ✉️",
        });
      } catch (err) {
        pushMessage({ role: "bot", type: "text", content: `Couldn't submit that (${err.message}). Please try again.` });
      }
    },
    [pushMessage, sessionId, user]
  );

  // ---------------- Chat controls ----------------
  const newChat = useCallback(() => {
    setSessionId(null);
    currentProgramContext.current = null;
    setInteractionCount(0);
    setMessages(user ? [{ id: nextId(), role: "bot", type: "text", content: "Starting a new chat! 👋" }] : [WELCOME_MESSAGE]);
    if (user) pushHomeMenu(user.name.split(" ")[0]);
    else setStage("ask_name");
  }, [user, pushHomeMenu]);

  const sendFeedback = useCallback(async (messageId, rating) => {
    if (!messageId) return;
    try {
      await api.submitFeedback({ session_id: sessionId, message_id: messageId, rating });
    } catch {
      /* best-effort, no UI disruption on failure */
    }
  }, [sessionId]);

  return {
    messages,
    stage,
    disabled,
    user,
    isTyping,
    submitUserForm,
    sendFreeText,
    navigateTo,
    selectProgramLevel,
    selectProgramGroup,
    selectCourse,
    askAiAboutCourse,
    respondToLeadPrompt,
    newChat,
    sendFeedback,
    showUserDetailsForm,
    goHome,
    canGoBack: stage !== "ask_name" && stage !== "completed",
    quickActionLabels: QUICK_ACTIONS.map((action) => action.label),
  };
}