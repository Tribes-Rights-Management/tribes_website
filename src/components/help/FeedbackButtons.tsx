/**
 * Article Feedback Buttons
 * Border-top: #f5f5f5, margin-top: 48px, padding-top: 32px
 */

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackButtonsProps {
  articleSlug: string;
}

export function FeedbackButtons({ articleSlug }: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);

  const handleFeedback = (value: "yes" | "no") => {
    setFeedback(value);
    // Could send to analytics/backend here
    console.log(`Feedback for ${articleSlug}: ${value}`);
  };

  if (feedback) {
    return (
      <div className="border-t border-[#f5f5f5] mt-12 pt-8">
        <p className="text-[14px] text-[#525252]">
          Thanks for your feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-[#f5f5f5] mt-12 pt-8">
      <p className="text-[14px] font-medium text-[#525252] mb-4">
        Was this article helpful?
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handleFeedback("yes")}
          className="
            flex items-center gap-2 
            px-5 py-[10px]
            border border-[#e5e5e5] rounded-md
            bg-white
            text-[14px] font-medium text-[#525252]
            cursor-pointer
            transition-all duration-150
            hover:border-[#1a1a1a] hover:text-[#1a1a1a]
          "
        >
          <ThumbsUp size={16} />
          <span>Yes</span>
        </button>
        <button
          onClick={() => handleFeedback("no")}
          className="
            flex items-center gap-2 
            px-5 py-[10px]
            border border-[#e5e5e5] rounded-md
            bg-white
            text-[14px] font-medium text-[#525252]
            cursor-pointer
            transition-all duration-150
            hover:border-[#1a1a1a] hover:text-[#1a1a1a]
          "
        >
          <ThumbsDown size={16} />
          <span>No</span>
        </button>
      </div>
    </div>
  );
}
