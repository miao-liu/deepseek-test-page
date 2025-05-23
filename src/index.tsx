import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Chat from "./components/chatAi";
import CodeReview from "./components/codeReview";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.CHAT_API || '',
  cache: new InMemoryCache()
})

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'codeReview'>('chat');

  return (
    <ApolloProvider client={client}>
      <div className="app-container">
        <nav className="navbar">
          <button
            className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            AI 聊天
          </button>
          <button
            className={`nav-button ${activeTab === 'codeReview' ? 'active' : ''}`}
            onClick={() => setActiveTab('codeReview')}
          >
            AI 代码审查
          </button>
        </nav>
        <div className="content">
          {activeTab === 'chat' ? <Chat /> : <CodeReview />}
        </div>
      </div>
    </ApolloProvider>
  )
};

const container = document.getElementById('root');
if(container) {
  const root = createRoot(container);
  root.render(<App />)
}

export default App;