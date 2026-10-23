// Main-site entry point for the assistant: the floating ask bar plus the chat
// workspace (sessions + conversation). MDA microsites keep the classic bubble.
import './ai-search.css';
import ChatWorkspace from './ChatWorkspace';
import FloatingAsk from './FloatingAsk';

export default function AskEko() {
  return (
    <>
      <FloatingAsk />
      <ChatWorkspace />
    </>
  );
}
