import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CURRENT_POLICY_VERSION } from "@/components/admin/PolicyAcknowledgmentScreen";

export function usePolicyAcknowledgment(userId: string | undefined, userRole: string | undefined) {
  const [hasAcknowledged, setHasAcknowledged] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userRole === "admin_view" || userRole === "super_admin";

  useEffect(() => {
    async function checkAcknowledgment() {
      if (!userId || !isAdmin) {
        setHasAcknowledged(true); // Non-admins don't need acknowledgment
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("policy_acknowledgments")
          .select("id")
          .eq("user_id", userId)
          .eq("policy_version", CURRENT_POLICY_VERSION)
          .maybeSingle();

        if (error) {
          console.error("Error checking policy acknowledgment:", error);
          setHasAcknowledged(false);
        } else {
          setHasAcknowledged(!!data);
        }
      } catch (err) {
        console.error("Error checking policy acknowledgment:", err);
        setHasAcknowledged(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAcknowledgment();
  }, [userId, isAdmin]);

  const acknowledgePolicy = async () => {
    if (!userId || !userRole) return false;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("policy_acknowledgments")
        .insert({
          user_id: userId,
          role: userRole,
          policy_version: CURRENT_POLICY_VERSION,
        });

      if (error) {
        console.error("Error saving policy acknowledgment:", error);
        return false;
      }

      setHasAcknowledged(true);
      return true;
    } catch (err) {
      console.error("Error saving policy acknowledgment:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    hasAcknowledged,
    isLoading,
    isSubmitting,
    acknowledgePolicy,
    requiresAcknowledgment: isAdmin && hasAcknowledged === false,
  };
}
