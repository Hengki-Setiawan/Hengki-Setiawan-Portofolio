import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const N8nChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();

    // Hide on admin pages
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    // Use proxy in development to avoid CORS issues, use env var in production
    const N8N_WEBHOOK_URL = import.meta.env.DEV
        ? '/api/n8n-chat'
        : (import.meta.env.VITE_N8N_CHAT_URL || 'https://gwu0a4k-n8n.bocindonesia.com/webhook/983f0dda-9bfe-4d09-99b1-e2e55f1f83f4/chat');
    const INITIAL_MESSAGE = "Halo guys aku bot untuk website portofolionya hengki, Ada yang bisa di bantu ?";

    // Utility function to strip markdown formatting
    const stripMarkdown = (text: string): string => {
        return text
            // Remove bold (**text** or __text__)
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/__(.+?)__/g, '$1')
            // Remove italic (*text* or _text_)
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/_(.+?)_/g, '$1')
            // Remove strikethrough (~~text~~)
            .replace(/~~(.+?)~~/g, '$1')
            // Remove inline code (`code`)
            .replace(/`(.+?)`/g, '$1')
            // Remove headers (# ## ### etc)
            .replace(/^#{1,6}\s+/gm, '')
            // Clean up any remaining asterisks or underscores (edge cases)
            .replace(/[\*_]/g, '');
    };

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Show initial bot message when chat opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 'initial',
                    text: INITIAL_MESSAGE,
                    sender: 'bot',
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isOpen]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: `user_${Date.now()}`,
            text: text.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // We will create the bot message only when we receive the first chunk of data
        // This ensures the typing indicator stays visible while waiting
        let botMessageId: string | null = null;
        let accumulatedText = '';

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'sendMessage',
                    sessionId: sessionId,
                    chatInput: text.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('Response body is empty');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.trim()) continue;

                    try {
                        const data = JSON.parse(line);
                        let newTextPart = '';

                        if (data.content) {
                            newTextPart = data.content;
                        } else if (data.output || data.response || data.message) {
                            newTextPart = data.output || data.response || data.message;
                        }

                        if (newTextPart) {
                            accumulatedText += newTextPart;
                            // Clean markdown from the accumulated text
                            const cleanText = stripMarkdown(accumulatedText);

                            // If this is the first chunk, create the bot message
                            if (!botMessageId) {
                                setIsLoading(false); // Stop typing indicator
                                botMessageId = `bot_${Date.now()}`;
                                const newBotMessage: Message = {
                                    id: botMessageId,
                                    text: cleanText,
                                    sender: 'bot',
                                    timestamp: new Date(),
                                };
                                setMessages((prev) => [...prev, newBotMessage]);
                            } else {
                                // Update existing message
                                setMessages((prev) =>
                                    prev.map((msg) =>
                                        msg.id === botMessageId
                                            ? { ...msg, text: cleanText }
                                            : msg
                                    )
                                );
                            }
                        }
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
            }

            // Fallback if no text received
            if (!botMessageId && !accumulatedText) {
                setIsLoading(false);
                const fallbackMessage: Message = {
                    id: `bot_${Date.now()}`,
                    text: 'Maaf, tidak ada respons dari AI.',
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, fallbackMessage]);
            }

        } catch (error) {
            console.error('[N8n Chat] Error:', error);
            setIsLoading(false);

            const errorMessage: Message = {
                id: `error_${Date.now()}`,
                text: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.',
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] flex flex-col glass-card rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-white">Eng</h3>
                                <p className="text-xs text-white/80">Online</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-darker/50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                                        : 'glass text-textMain rounded-bl-sm'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                                    <p className="text-xs mt-1 opacity-60">
                                        {message.timestamp.toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-4 bg-surface/80 backdrop-blur-md border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ketik pesan..."
                                className="flex-1 bg-dark/50 text-textMain placeholder-textMuted px-4 py-2 rounded-xl border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-transform"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${isOpen
                    ? 'bg-gradient-to-r from-accent to-secondary scale-95'
                    : 'bg-gradient-to-r from-primary to-secondary hover:scale-110 shadow-primary/30'
                    }`}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {!isOpen && (
                    <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30"></span>
                        <MessageCircle className="w-7 h-7 text-white" />

                        {/* Tooltip */}
                        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                            Chat dengan AI
                            <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-white rotate-45"></span>
                        </span>
                    </>
                )}
                {isOpen && <X className="w-7 h-7 text-white" />}
            </button>
        </div>
    );
};

export default N8nChatWidget;
