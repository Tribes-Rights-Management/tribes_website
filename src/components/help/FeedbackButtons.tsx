/**
 * Article Feedback Buttons
 * Was this article helpful? Yes / No
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
    // TODO: Send feedback to analytics/database
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
            flex items-center gap-2 px-5 py-2.5
            text-[14px] font-medium text-[#525252]
            border border-[#e5e5e5] rounded-md
            hover:border-[#1a1a1a] hover:text-[#1a1a1a]
            transition-colors duration-150
          "
        >
          <ThumbsUp size={16} />
          Yes
        </button>
        <button
          onClick={() => handleFeedback("no")}
          className="
            flex items-center gap-2 px-5 py-2.5
            text-[14px] font-medium text-[#525252]
            border border-[#e5e5e5] rounded-md
            hover:border-[#1a1a1a] hover:text-[#1a1a1a]
            transition-colors duration-150
          "
        >
          <ThumbsDown size={16} />
          No
        </button>
      </div>
    </div>
  );
}
