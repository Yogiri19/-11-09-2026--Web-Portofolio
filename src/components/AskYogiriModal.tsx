import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  RotateCcw,
  User
} from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../services/geminiService';
import { Language, translations } from '../data/translations';

interface AskYogiriModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

// Helper to render basic markdown (bold, lists, code, links)
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed text-white/90">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <div
                className="flex-1"
                dangerouslySetInnerHTML={{
                  __html: formatInlineMarkdown(itemText),
                }}
              />
            </div>
          );
        }

        // Numbered lists
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-1">
              <span className="text-xs font-mono text-emerald-400 mt-0.5 flex-shrink-0">
                {numberedMatch[1]}.
              </span>
              <div
                className="flex-1"
                dangerouslySetInnerHTML={{
                  __html: formatInlineMarkdown(numberedMatch[2]),
                }}
              />
            </div>
          );
        }

        // Standard paragraph
        return (
          <p
            key={idx}
            dangerouslySetInnerHTML={{
              __html: formatInlineMarkdown(line),
            }}
          />
        );
      })}
    </div>
  );
};

// Inline parser for bold, inline code, links
function formatInlineMarkdown(text: string): string {
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  // Inline code: `code`
  escaped = escaped.replace(
    /`([^`]+)`/g,
    '<code class="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs">$1</code>'
  );

  // Markdown links: [text](url)
  escaped = escaped.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-400 underline hover:text-emerald-300 inline-flex items-center gap-0.5">$1</a>'
  );

  return escaped;
}

export const AskYogiriModal: React.FC<AskYogiriModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language].askYogiri;

  const getInitialMessage = (lang: Language): ChatMessage => ({
    id: `init-${lang}`,
    role: 'assistant',
    content: translations[lang].askYogiri.initialMessage,
    timestamp: Date.now(),
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage(language)]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Update initial message when language toggles if user hasn't started chatting yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [getInitialMessage(language)];
      }
      return prev;
    });
  }, [language]);

  // Auto-scroll to bottom on messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when modal opens & handle Escape key
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend !== undefined ? textToSend : input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(newMessages, language);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `${t.errorPrefix} ${err?.message || 'Please try again later.'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([getInitialMessage(language)]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Window */}
      <div className="relative w-full max-w-2xl liquid-glass rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[650px] max-h-[90vh] z-10 border border-white/10 bg-[#070709]/90">
        
        {/* Modal Top Bar / Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center relative group">
              <Sparkles size={20} className="text-emerald-400" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-base tracking-tight">
                  {t.title}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  {t.onlineStatus}
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleReset}
              title={t.resetTitle}
              className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              onClick={onClose}
              title={t.closeTitle}
              className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'user'
                    ? 'bg-white text-black'
                    : 'liquid-glass text-emerald-400 border border-emerald-400/30'
                }`}
              >
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm ${
                  msg.role === 'user'
                    ? 'bg-white text-black font-medium shadow-md'
                    : 'liquid-glass text-white/90 border border-white/5'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <FormattedMessage content={msg.content} />
                )}
              </div>
            </div>
          ))}

          {/* Thinking animation indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl liquid-glass flex items-center justify-center text-emerald-400 border border-emerald-400/30 flex-shrink-0 mt-0.5">
                <Bot size={14} />
              </div>
              <div className="liquid-glass rounded-2xl px-4 py-3 border border-white/5 text-xs text-white/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-mono">{t.thinkingText}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length <= 2 && (
          <div className="pb-3 pt-1 border-t border-white/5">
            <p className="text-[11px] font-mono text-white/40 mb-2 flex items-center gap-1.5">
              <Sparkles size={11} className="text-emerald-400" />
              <span>{t.suggestedPromptsLabel}</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {t.suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="text-left text-xs font-mono px-3 py-1.5 rounded-full liquid-glass text-white/70 hover:text-white hover:border-emerald-400/40 transition-all border border-white/5 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-2 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 relative"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={isLoading}
              className="w-full liquid-glass rounded-full px-5 py-3 pr-24 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all border border-white/10"
            />
            
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-white text-black rounded-full px-4 py-2 text-xs font-semibold hover:bg-emerald-400 hover:text-black transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
              >
                <span>{t.sendButton}</span>
                <Send size={12} />
              </button>
            </div>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-white/40 px-2">
            <span>{t.shortcutHint}</span>
            <span>{t.disclaimer}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
