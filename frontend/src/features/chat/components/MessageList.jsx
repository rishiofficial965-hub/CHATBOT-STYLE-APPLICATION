import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const TypingIndicator = () => (
    <div className="flex flex-col gap-3 items-start animate-in fade-in duration-300">
        <div className="flex items-center gap-3 px-2">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <i className="ri-sparkling-2-line text-white/40 text-xs"></i>
            </div>
            <div className="flex gap-1.5 py-3">
                <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
        </div>
    </div>
);

const MarkdownContent = ({ content }) => (
    <ReactMarkdown
        components={{
            // Paragraphs
            p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
            // Bold
            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
            // Italic
            em: ({ children }) => <em className="italic text-white/80">{children}</em>,
            // Unordered lists
            ul: ({ children }) => <ul className="list-disc list-outside pl-5 mb-3 space-y-1.5">{children}</ul>,
            // Ordered lists
            ol: ({ children }) => <ol className="list-decimal list-outside pl-5 mb-3 space-y-1.5">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
            // Headings
            h1: ({ children }) => <h1 className="text-xl font-semibold text-white mb-3 mt-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-semibold text-white mb-2 mt-4">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-semibold text-white mb-2 mt-3">{children}</h3>,
            // Inline code
            code: ({ inline, children }) =>
                inline ? (
                    <code className="bg-white/10 text-white/90 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                ) : (
                    <code className="block bg-[#1a1a1a] border border-white/10 text-white/85 p-4 rounded-xl text-sm font-mono overflow-x-auto mb-3">{children}</code>
                ),
            // Code block wrapper
            pre: ({ children }) => <pre className="mb-3">{children}</pre>,
            // Blockquote
            blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-white/20 pl-4 text-white/60 italic mb-3">{children}</blockquote>
            ),
            // Horizontal rule
            hr: () => <hr className="border-white/10 my-4" />,
            // Links
            a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                    {children}
                </a>
            ),
        }}
    >
        {content}
    </ReactMarkdown>
);

const SourceCards = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-4 pl-1">
            <div className="flex items-center gap-2 mb-2.5">
                <i className="ri-global-line text-white/30 text-sm"></i>
                <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Sources</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                {sources.map((source, idx) => (
                    <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-56 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/15 rounded-xl p-3.5 transition-all duration-300 group"
                    >
                        <div className="flex items-start gap-2 mb-2">
                            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <i className="ri-link text-white/40 text-xs"></i>
                            </div>
                            <p className="text-white/80 text-xs font-medium leading-snug line-clamp-2 group-hover:text-white/95 transition-colors">
                                {source.title}
                            </p>
                        </div>
                        {source.snippet && (
                            <p className="text-white/30 text-[11px] leading-relaxed line-clamp-2 ml-7">
                                {source.snippet}
                            </p>
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
};

const MessageList = ({ messages, isSending }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSending]);

    const isAI = (role) => role === 'ai' || role === 'assistant';

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-10">
            <div className="flex flex-col gap-10">
                {messages.length === 0 && !isSending ? (
                    <div className="flex flex-col items-center justify-center mt-32 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                            <i className="ri-sparkling-2-line text-white/40 text-2xl"></i>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-semibold text-white/90 mb-4 tracking-tight">
                            What can I help with?
                        </h2>
                        <p className="text-white/30 text-lg max-w-md leading-relaxed">
                            Ask anything — technical questions, creative writing, analysis, code, and more.
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col gap-3 ${isAI(msg.role) ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                            >
                                {isAI(msg.role) && (
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                            <i className="ri-sparkling-2-line text-white/50 text-xs"></i>
                                        </div>
                                        <span className="text-white/30 text-xs font-medium">Assistant</span>
                                    </div>
                                )}

                                <div className={`max-w-[85%] ${
                                    isAI(msg.role)
                                        ? 'text-white/85 text-[16px] leading-relaxed pl-1'
                                        : 'bg-[#1A1A1A] text-white/90 border border-white/10 shadow-xl px-6 py-3.5 rounded-2xl text-[17px] leading-relaxed'
                                }`}>
                                    {isAI(msg.role) ? (
                                        <MarkdownContent content={msg.content} />
                                    ) : (
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>

                                {/* Source cards for AI messages */}
                                {isAI(msg.role) && <SourceCards sources={msg.sources} />}

                                {isAI(msg.role) && (
                                    <div className="flex items-center gap-5 mt-1 px-2 text-white/15">
                                        <button title="Copy" onClick={() => navigator.clipboard.writeText(msg.content)}
                                            className="hover:text-white/50 transition-all duration-300 transform hover:scale-110">
                                            <i className="ri-file-copy-line text-base"></i>
                                        </button>
                                        <button title="Upvote" className="hover:text-white/50 transition-all duration-300 transform hover:scale-110">
                                            <i className="ri-thumb-up-line text-base"></i>
                                        </button>
                                        <button title="Downvote" className="hover:text-white/50 transition-all duration-300 transform hover:scale-110">
                                            <i className="ri-thumb-down-line text-base"></i>
                                        </button>
                                        <button title="Regenerate" className="hover:text-white/50 transition-all duration-300 transform hover:scale-110">
                                            <i className="ri-refresh-line text-base"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isSending && <TypingIndicator />}
                    </>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default MessageList;
