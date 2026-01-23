/**
 * Article Content Renderer
 * Renders markdown content with proper styling
 */

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface ArticleContentProps {
  content: string;
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="text-[18px] font-semibold text-[#1a1a1a] mt-8 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[15px] font-semibold text-[#1a1a1a] mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[15px] leading-[1.7] text-[#525252] mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-4 space-y-1.5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-4 space-y-1.5">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-[15px] leading-[1.7] text-[#525252]">
      {children}
    </li>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <pre className="bg-[#f5f5f5] p-4 rounded-md overflow-x-auto mb-4">
          <code className="text-[13px] font-mono text-[#1a1a1a]">
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code className="bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[13px] font-mono text-[#1a1a1a]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children }) => (
    <a 
      href={href} 
      className="text-[#1a1a1a] underline hover:no-underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#e5e5e5] pl-4 my-4 text-[#525252] italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-t border-[#f5f5f5] my-8" />,
};

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-content">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
