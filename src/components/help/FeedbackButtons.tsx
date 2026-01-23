/**
 * Article Feedback Buttons
 * Yes/No feedback with thumbs icons
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
      <div className="pt-8 mt-8 border-t border-[#f0f0f0]">
        <p className="text-[14px] text-[#666666]">
          Thank you for your feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="pt-8 mt-8 border-t border-[#f0f0f0]">
      <p className="text-[14px] font-medium text-[#1a1a1a] mb-4">
        Was this article helpful?
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handleFeedback("yes")}
          className="
            flex items-center gap-2 px-5 py-2.5
            text-[14px] font-medium text-[#1a1a1a]
            border border-[#e5e5e5] rounded-md
            transition-all duration-150
            hover:border-[#1a1a1a]
          "
        >
          <ThumbsUp size={16} />
          Yes
        </button>
        <button
          onClick={() => handleFeedback("no")}
          className="
            flex items-center gap-2 px-5 py-2.5
            text-[14px] font-medium text-[#1a1a1a]
            border border-[#e5e5e5] rounded-md
            transition-all duration-150
            hover:border-[#1a1a1a]
          "
        >
          <ThumbsDown size={16} />
          No
        </button>
      </div>
    </div>
  );
}
