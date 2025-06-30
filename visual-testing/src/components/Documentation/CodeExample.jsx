import React, { useState } from 'react';

/**
 * Code Example Component
 * 
 * Displays code examples with syntax highlighting and copy functionality
 */
function CodeExample({ title, code, language = 'javascript', copyable = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyable) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Simple syntax highlighting classes (you could integrate with a proper syntax highlighter)
  const getLanguageClass = (lang) => {
    const languageMap = {
      javascript: 'language-js',
      jsx: 'language-jsx',
      typescript: 'language-ts',
      html: 'language-html',
      css: 'language-css',
      bash: 'language-bash',
      vue: 'language-vue'
    };
    return languageMap[lang] || 'language-text';
  };

  return (
    <div className="code-example">
      <div className="code-example__header">
        <span className="code-example__title">{title}</span>
        <div className="code-example__controls">
          <span className="code-example__language">{language}</span>
          {copyable && (
            <button
              className={`code-example__copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy code"
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          )}
        </div>
      </div>
      
      <div className="code-example__content">
        <pre className={`code-example__pre ${getLanguageClass(language)}`}>
          <code className="code-example__code">{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default CodeExample;
