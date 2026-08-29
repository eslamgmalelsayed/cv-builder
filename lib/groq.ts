// Central Groq configuration. Model IDs live here (and can be overridden via
// env) so a Groq model decommission is a one-line change — not a hunt through
// every route. Groq periodically retires models; when a route starts returning
// 404 "model_not_found", update GROQ_MODEL / GROQ_MODEL_FAST below or set the
// matching env var.
//
// Check the current catalog with:
//   curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY"

export const GROQ_CHAT_URL =
  "https://api.groq.com/openai/v1/chat/completions";

/** Primary model for analysis / structured generation (ATS, suggestions). */
export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

/** Faster model for short, latency-sensitive calls (autocomplete, chat). */
export const GROQ_MODEL_FAST =
  process.env.GROQ_MODEL_FAST || process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export function hasGroqKey(): boolean {
  return !!process.env.GROQ_API_KEY;
}
