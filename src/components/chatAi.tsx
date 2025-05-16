import React, { useState, useRef, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import ReactMarkdown from "react-markdown";
import "../styles/chat.css";

const GET_RESPONSE = gql`
  query askDeepSeek($input: String!) {
    askDeepSeek(character: $input)
  }
`;

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMsg] = useState("");
  const [fetchResponse] = useLazyQuery(GET_RESPONSE, {
    onCompleted: (data) => {
      setLoading(false);
      if (data.askDeepSeek) {
        setErrorMsg("")
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "ai", text: data.askDeepSeek },
        ]);
      }
    },
    onError: (error) => {
      setLoading(false);
      setErrorMsg("服务错误，请稍后重试")
      console.error("Error fetching GraphQL response:", error);
    },
  });

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setLoading(true);
      fetchResponse({ variables: { input } });
      setInput("");
    }
  };


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatgpt-container">
      <div className="chatgpt-header">AI 聊天</div>
      <div className="chatgpt-messages">
        {messages.length === 0 && !loading && !errorMessage && (
          <div className="chatgpt-message ai">
            <span>你好，你想问什么呢？</span>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatgpt-message ${msg.sender === "user" ? "user" : "ai"}`}
          >
            {msg.sender === "user" ? (
              <span>{msg.text}</span>
            ) : (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            )}
          </div>
        ))}

        {loading && (
          <div className="chatgpt-message ai loading">
            <span>AI 正在思考…</span>
          </div>
        )}

        {errorMessage && (
          <div className="chatgpt-message ai">
            <span>{errorMessage}</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="chatgpt-input-container">
        <input
          type="text"
          className="chatgpt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请输入..."
        />
        <button className="chatgpt-send-button" onClick={handleSend}>
          发送
        </button>
      </div>
    </div>
  );
}
export default Chat