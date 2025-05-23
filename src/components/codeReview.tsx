import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/chat.css";

import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "https://mastra-cr-agent.1324282944.workers.dev",
});

const agent = client.getAgent('CodeReviewAgent')
const CodeReview: React.FC = () => {
  const [code, setCode] = useState("");
  const [review, setReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const reviewEndRef = useRef<HTMLDivElement>(null);

  const handleReview = async () => {
    if (loading) {
      alert("请稍后，正在评审中");
      return;
    }
    if (!code.trim()) {
      alert("请输入需要评审的代码");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setReview(null);
    try {
      const response = await agent.generate({
        messages: [{ role: "user", content: code }],
      })
      setReview(response.text || "未获取到评审结果");
    } catch (e) {
      setErrorMsg("服务错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reviewEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [review, errorMsg, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") handleReview();
  };

  return (
    <div className="chatgpt-container">
      <div className="chatgpt-header">AI 代码评审</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 0 16px 0", gap: 16, overflowY: "auto" }}>
        <textarea
          className="chatgpt-input"
          style={{ minHeight: 120, fontFamily: "monospace", resize: "vertical" }}
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请粘贴你的代码（Ctrl+Enter 发送）"
        />
        <button className="chatgpt-send-button" onClick={handleReview} style={{ alignSelf: "flex-end", marginTop: 8 }}>
          评审
        </button>
        {loading && (
          <div className="chatgpt-message ai loading">
            <span>AI 正在评审…</span>
          </div>
        )}
        {errorMsg && (
          <div className="chatgpt-message ai">
            <span>{errorMsg}</span>
          </div>
        )}
        {review && (
          <div className="chatgpt-message ai" style={{ whiteSpace: "pre-wrap" }}>
            <ReactMarkdown>{review}</ReactMarkdown>
          </div>
        )}
        <div ref={reviewEndRef} />
      </div>
    </div>
  );
};

export default CodeReview;
