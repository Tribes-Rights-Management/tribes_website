/**
 * Help Center Redirect Page
 * Redirects /hc to /hc/publishers
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HelpRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/hc/publishers", { replace: true });
  }, [navigate]);

  return null;
}
