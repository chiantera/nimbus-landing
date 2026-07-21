// Provider-agnostic chat handler. Works with any OpenAI-compatible
// /chat/completions endpoint (DeepSeek, Mistral, GLM/Zhipu, OpenAI, ...).
// Configuration comes entirely from environment variables so the API key
// never touches the client bundle.

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatConfig {
  baseUrl: string
  apiKey: string
  model: string
}

const SYSTEM_PROMPT = `You are Nimbus Assistant, the friendly in-app guide for Nimbus — an all-in-one workspace that helps teams automate busywork and focus on what matters. Be concise, warm, and genuinely helpful. Answer questions about Nimbus's features, pricing, and how to get started. If a question is unrelated to Nimbus, answer briefly, then steer back to how Nimbus could help. Never invent pricing beyond: Starter $0, Pro $19/mo, Enterprise custom.`

/** Reads provider config from an env bag; returns null if not fully configured. */
export function getConfigFromEnv(env: Record<string, string | undefined>): ChatConfig | null {
  const baseUrl = env.AI_BASE_URL?.trim()
  const apiKey = env.AI_API_KEY?.trim()
  const model = env.AI_MODEL?.trim()
  if (!baseUrl || !apiKey || !model) return null
  return { baseUrl: baseUrl.replace(/\/+$/, ''), apiKey, model }
}

/** Calls the provider and returns the assistant's reply text. */
export async function runChat(config: ChatConfig, messages: ChatMessage[]): Promise<string> {
  const trimmed = messages
    .filter((m) => m && typeof m.content === 'string' && m.role !== 'system')
    .slice(-12) // keep the last few turns to bound token usage

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
      temperature: 0.7,
      max_tokens: 600,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Provider responded ${res.status}. ${detail.slice(0, 300)}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  return data.choices?.[0]?.message?.content?.trim() || "Sorry — I didn't catch that. Try again?"
}
