
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

// --- Icons ---
const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const HistoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6" />
    <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const BrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const StopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
  </svg>
);

// --- Styles ---
const styles = `
  :root {
    --bg-color: #f8fafc;
    --card-bg: #ffffff;
    --primary: #3b82f6;
    --primary-hover: #2563eb;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --error: #ef4444;
    --success: #22c55e;
    --radius: 12px;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: var(--font-sans);
    background-color: var(--bg-color);
    color: var(--text-main);
    line-height: 1.5;
    overflow-x: hidden;
  }

  .app-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  header {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
  }
  
  .header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-main);
  }

  .subtitle {
    color: var(--text-muted);
    font-size: 1rem;
  }

  .main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    flex: 1;
  }

  @media (min-width: 1024px) {
    .main-content {
      grid-template-columns: 1fr 1fr;
    }
  }

  .card {
    background: var(--card-bg);
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 600px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .char-count {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-left: auto;
    margin-right: 12px;
    font-variant-numeric: tabular-nums;
  }

  textarea {
    width: 100%;
    flex: 1;
    min-height: 300px;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    resize: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    line-height: 1.6;
  }

  textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .controls {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .label-text {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 8px;
    display: block;
  }

  .mode-selector {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    flex-wrap: wrap;
  }

  .chip {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: transparent;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-muted);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .chip:hover {
    background: #f1f5f9;
  }

  .chip.active {
    background: #eff6ff;
    border-color: var(--primary);
    color: var(--primary);
  }

  .action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 8px;
  }

  .thinking-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: background 0.2s;
    user-select: none;
  }

  .thinking-toggle:hover {
    background: #f1f5f9;
  }

  .toggle-checkbox {
    width: 40px;
    height: 22px;
    background: #cbd5e1;
    border-radius: 11px;
    position: relative;
    transition: background 0.2s;
  }

  .toggle-checkbox.checked {
    background: var(--primary);
  }

  .toggle-thumb {
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }

  .toggle-checkbox.checked .toggle-thumb {
    transform: translateX(18px);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-size: 1rem;
    gap: 8px;
    min-width: 120px;
  }

  .btn-primary {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-stop {
    background: #ef4444;
    color: white;
  }
  
  .btn-stop:hover {
    background: #dc2626;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-muted);
    padding: 8px;
    border-radius: 8px;
  }
  
  .btn-ghost:hover {
    background: #f1f5f9;
    color: var(--text-main);
  }

  .output-area {
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid var(--border);
    padding: 24px;
    flex: 1;
    overflow-y: auto;
    font-size: 1rem;
    line-height: 1.7;
  }
  
  /* Enhanced Markdown Styling */
  .output-content h1, .output-content h2, .output-content h3 {
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    color: var(--text-main);
    font-weight: 700;
    line-height: 1.3;
  }
  
  .output-content h1 { font-size: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
  .output-content h2 { font-size: 1.25rem; }
  
  .output-content h1:first-child, .output-content h2:first-child {
    margin-top: 0;
  }
  
  .output-content code {
    background: #e2e8f0;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
    color: #0f172a;
  }
  
  .output-content pre {
    background: #1e293b;
    color: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
  }
  
  .output-content pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    font-size: 0.9rem;
  }

  .output-content ul, .output-content ol {
    padding-left: 24px;
    margin: 16px 0;
  }
  
  .output-content li {
    margin-bottom: 8px;
  }

  .output-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 0.9rem;
    overflow-x: auto;
    display: block;
  }
  
  .output-content th, .output-content td {
    border: 1px solid var(--border);
    padding: 10px 14px;
    text-align: left;
  }
  
  .output-content th {
    background: #f1f5f9;
    font-weight: 600;
    color: var(--text-main);
  }
  
  .output-content tr:nth-child(even) {
    background-color: #fcfcfc;
  }

  .output-content blockquote {
    border-left: 4px solid var(--primary);
    margin: 16px 0;
    padding-left: 16px;
    color: var(--text-muted);
    font-style: italic;
  }

  .placeholder {
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    gap: 16px;
    opacity: 0.6;
  }

  .error-message {
    margin-top: 12px;
    padding: 12px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    border-radius: 8px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .custom-input-container {
    margin-top: 12px;
  }
  
  .custom-input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .custom-input:focus {
    border-color: var(--primary);
    outline: none;
  }

  .custom-input.error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  /* History Sidebar */
  .history-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    z-index: 50;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    backdrop-filter: blur(2px);
  }
  
  .history-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .history-sidebar {
    position: fixed;
    top: 0;
    right: -400px;
    width: 100%;
    max-width: 400px;
    height: 100vh;
    background: var(--card-bg);
    box-shadow: -4px 0 20px rgba(0,0,0,0.1);
    z-index: 100;
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
  }

  .history-sidebar.open {
    right: 0;
  }

  .history-header {
    padding: 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
  }

  .history-title {
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--text-main);
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .history-item {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
    position: relative;
  }

  .history-item:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }

  .history-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .history-badge {
    background: #eff6ff;
    color: var(--primary);
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
  }

  .history-preview {
    font-size: 0.9rem;
    color: var(--text-main);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
  }

  .history-delete {
    position: absolute;
    top: 12px;
    right: 12px;
    opacity: 0;
    transition: opacity 0.2s;
    background: white;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px;
    cursor: pointer;
    color: var(--text-muted);
  }
  
  .history-delete:hover {
    color: var(--error);
    border-color: #fecaca;
    background: #fef2f2;
  }

  .history-item:hover .history-delete {
    opacity: 1;
  }
  
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: var(--primary);
    margin-right: auto;
  }
  
  .pulse-dot {
    width: 8px;
    height: 8px;
    background: var(--primary);
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
    70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }
`;

// --- Configuration ---
const MODES = [
  { id: 'summary', label: 'Резюме', prompt: 'Summarize the following text in Ukrainian. Structure it with clear headings and bullet points. Highlight key insights.' },
  { id: 'action_items', label: 'Завдання', prompt: 'Extract a list of actionable items and tasks from the following text. Format as a checklist in Ukrainian. If there are deadlines or assignees, include them.' },
  { id: 'table', label: 'Таблиця', prompt: 'Convert the data or structured information in the following text into a Markdown table. If it is financial data, ensure columns are aligned. Respond in Ukrainian.' },
  { id: 'json', label: 'JSON', prompt: 'Convert the key information from the text into a valid JSON object. Use meaningful keys. Do not wrap in code blocks.' },
  { id: 'cleanup', label: 'Виправлення', prompt: 'Fix grammar, punctuation, and improve the flow of the following Ukrainian text. Keep the tone professional.' },
  { id: 'custom', label: 'Власний запит', prompt: '' }
];

interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  mode: string;
}

// --- Component ---
const App = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("summary");
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [useThinking, setUseThinking] = useState(false);
  const [customPromptError, setCustomPromptError] = useState(false);
  
  // Abort controller for streaming
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("structure_app_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveHistory = (newItem: HistoryItem) => {
    const updated = [newItem, ...history].slice(0, 50); // Limit to 50
    setHistory(updated);
    localStorage.setItem("structure_app_history", JSON.stringify(updated));
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem("structure_app_history", JSON.stringify(updated));
  };

  const restoreHistory = (item: HistoryItem) => {
    setInput(item.input);
    setOutput(item.output);
    setSelectedMode(item.mode);
    setHistoryOpen(false);
  };

  const handleStructure = async () => {
    if (!input.trim()) {
      setError("Будь ласка, введіть текст для обробки.");
      return;
    }

    setIsLoading(true);
    setError("");
    setOutput(""); // Clear output for streaming
    
    abortControllerRef.current = new AbortController();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let systemPrompt = "";
      const modeConfig = MODES.find(m => m.id === selectedMode);
      
      if (selectedMode === 'custom') {
        if (!customPrompt.trim()) {
            setCustomPromptError(true);
            setIsLoading(false);
            return;
        }
        setCustomPromptError(false);
        systemPrompt = customPrompt;
      } else {
        systemPrompt = modeConfig?.prompt || "";
      }

      // Configure thinking if enabled
      const config: any = {};
      if (useThinking) {
        // Budget for deep reasoning on complex docs
        config.thinkingConfig = { thinkingBudget: 2048 }; 
      }

      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `Instruction: ${systemPrompt}\n\nInput Text:\n${input}` }] }
        ],
        config: config
      }, {
        signal: abortControllerRef.current.signal
      });

      let fullText = "";
      for await (const chunk of stream) {
        const text = chunk.text();
        if (text) {
          fullText += text;
          setOutput(prev => prev + text);
        }
      }

      // Save to history only after completion
      saveHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        input,
        output: fullText,
        mode: selectedMode
      });

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(err);
        let msg = "Виникла помилка. Перевірте з'єднання.";
        const errStr = err.toString().toLowerCase();
        
        if (errStr.includes("429")) {
            msg = "Перевищено ліміт запитів. Будь ласка, зачекайте хвилинку.";
        } else if (errStr.includes("401") || errStr.includes("api key")) {
            msg = "Помилка авторизації API. Перевірте ключ.";
        } else if (errStr.includes("network")) {
            msg = "Помилка мережі. Перевірте підключення до інтернету.";
        }
        setError(msg);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container">
      <style>{styles}</style>
      
      <header>
        <div className="header-left">
          <h1>
            <SparklesIcon />
            Структуризація
          </h1>
          <span className="subtitle">AI-помічник для роботи з текстом</span>
        </div>
        <button className="btn btn-ghost" onClick={() => setHistoryOpen(true)}>
          <HistoryIcon />
          <span>Історія</span>
        </button>
      </header>

      <main className="main-content">
        {/* Input Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Вхідний текст</span>
            <span className="char-count">{input.length} символів</span>
            {input && (
                <button className="btn btn-ghost" onClick={() => setInput("")} title="Очистити" style={{marginLeft: '4px'}}>
                    <TrashIcon />
                </button>
            )}
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Вставте сюди неструктурований текст, звіт, статтю або нотатки..."
          />

          <div className="controls">
            <span className="label-text">Режим обробки:</span>
            <div className="mode-selector">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  className={`chip ${selectedMode === mode.id ? 'active' : ''}`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {selectedMode === 'custom' && (
              <div className="custom-input-container">
                <span className="label-text">Ваша інструкція:</span>
                <input 
                    type="text" 
                    className={`custom-input ${customPromptError ? 'error' : ''}`}
                    value={customPrompt}
                    onChange={(e) => {
                        setCustomPrompt(e.target.value);
                        if (customPromptError) setCustomPromptError(false);
                    }}
                    placeholder="Наприклад: Переклади англійською та виділи головні тези..."
                />
              </div>
            )}

            <div className="action-bar">
               <div 
                 className="thinking-toggle" 
                 onClick={() => setUseThinking(!useThinking)}
                 title="Використовувати модель мислення для складних завдань"
               >
                 <div className={`toggle-checkbox ${useThinking ? 'checked' : ''}`}>
                   <div className="toggle-thumb" />
                 </div>
                 <span style={{fontSize: '0.9rem', color: useThinking ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 500}}>
                    Глибокий аналіз
                 </span>
                 {useThinking && <BrainIcon />}
               </div>

               {isLoading ? (
                 <button className="btn btn-stop" onClick={stopGeneration}>
                   <StopIcon />
                   Зупинити
                 </button>
               ) : (
                 <button className="btn btn-primary" onClick={handleStructure} disabled={!input.trim()}>
                   <SparklesIcon />
                   Обробити
                 </button>
               )}
            </div>
          </div>
          
          {error && (
            <div className="error-message">
              <XIcon /> {error}
            </div>
          )}
        </div>

        {/* Output Card */}
        <div className="card">
          <div className="card-header">
            <div style={{display:'flex', alignItems:'center', gap: '12px'}}>
                <span className="card-title">Результат</span>
                {isLoading && (
                    <div className="status-indicator">
                        <div className="pulse-dot"></div>
                        {useThinking ? "Аналізую..." : "Генерую..."}
                    </div>
                )}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-ghost" 
                onClick={copyToClipboard}
                disabled={!output}
                title="Копіювати"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>

          <div className="output-area">
            {output ? (
              <div 
                className="output-content"
                dangerouslySetInnerHTML={{ __html: marked.parse(output) }}
              />
            ) : (
              <div className="placeholder">
                <SparklesIcon />
                <p>Результат обробки з'явиться тут</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* History Sidebar */}
      <div 
        className={`history-overlay ${historyOpen ? 'open' : ''}`} 
        onClick={() => setHistoryOpen(false)}
      />
      <div className={`history-sidebar ${historyOpen ? 'open' : ''}`}>
        <div className="history-header">
          <span className="history-title">Історія</span>
          <button className="btn btn-ghost" onClick={() => setHistoryOpen(false)}>
            <XIcon />
          </button>
        </div>
        <div className="history-list">
          {history.length === 0 ? (
            <div className="placeholder">
              <HistoryIcon />
              <p>Історія порожня</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="history-item"
                onClick={() => restoreHistory(item)}
              >
                <button 
                  className="history-delete"
                  onClick={(e) => deleteHistoryItem(e, item.id)}
                >
                  <TrashIcon />
                </button>
                <div className="history-meta">
                  <span className="history-badge">
                    {MODES.find(m => m.id === item.mode)?.label || item.mode}
                  </span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="history-preview">
                  {/* Truncate input for preview to improve readability */}
                  {item.input.substring(0, 120)}{item.input.length > 120 ? '...' : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
    