-- Add public SELECT policy for support_knowledge_base
-- Allows anonymous users to read active articles for self-service support

CREATE POLICY "Public can read active knowledge base articles"
ON public.support_knowledge_base
FOR SELECT
TO anon, authenticated
USING (is_active = true);