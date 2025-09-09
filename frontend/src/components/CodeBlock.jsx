// File: src/components/CodeBlock.jsx
"use client";

import React from "react";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

const CodeBlock = ({ code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Code copied to clipboard! ✅");
      })
      .catch((err) => {
        toast.error("Failed to copy code. ❌");
        console.error("Copy error:", err);
      });
  };

  return (
    <div className="relative p-4 bg-neutral-800 rounded-lg border border-neutral-700 font-mono text-sm overflow-x-auto">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 rounded-full text-neutral-400 hover:bg-neutral-600 transition-colors"
        aria-label="Copy code to clipboard"
      >
        <Copy size={16} />
      </button>
      <pre className="whitespace-pre-wrap break-words">{code}</pre>
    </div>
  );
};

export default CodeBlock;