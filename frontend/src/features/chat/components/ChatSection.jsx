import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatSection = ({ messages, onSendMessage, isSending }) => {
    return (
        <section className="flex flex-col h-full w-full bg-[#090909] overflow-hidden">
            {/* Top fade */}
            <div className="pointer-events-none absolute top-16 left-0 right-0 h-12 bg-gradient-to-b from-[#090909] to-transparent z-10" />

            {/* Scrollable messages — min-h-0 is critical so flex-1 doesn't overflow */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <MessageList messages={messages} isSending={isSending} />
            </div>

            {/* Input pinned at bottom — flex-shrink-0 prevents it from being compressed */}
            <div className="flex-shrink-0 w-full flex justify-center">
                <ChatInput onSendMessage={onSendMessage} isSending={isSending} />
            </div>
        </section>
    );
};

export default ChatSection;
