import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <button className="copy-button" onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter 
        language="jsx" 
        style={tomorrow}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 4px 4px',
          fontSize: '14px',
          padding: '20px',
        }}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
