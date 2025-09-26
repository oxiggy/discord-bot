import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import { openai, OPENAI_MODEL } from './client';

export type AIResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export async function aiChat(
  { messages }: { messages: ChatCompletionMessageParam[] }
): Promise<AIResponse<string>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const resp = await openai.chat.completions.create(
      { model: OPENAI_MODEL, messages, temperature: 0.2 },
      { signal: controller.signal }
    );

    const content = (resp.choices[0]?.message?.content ?? '').trim();
    if (!content) {
      return { success: false, data: null, error: 'Empty response from model' };
    }
    return { success: true, data: content, error: null };

  } catch (e: unknown) {
    return { success: false, data: null, error: toErrorMessage(e) };

  } finally {
    clearTimeout(timeout);
  }
}

function toErrorMessage(e: unknown): string {
  // OpenAI SDK
  if (e instanceof OpenAI.APIError) {
    const status = e.status;
    type MaybeCode = { code?: string };
    type MaybeNested = { error?: { code?: string } };
    const code = (e as MaybeCode).code ?? (e as MaybeNested).error?.code;

    if (status === 429 && (code === 'insufficient_quota' || /insufficient_quota/i.test(e.message))) {
      return 'OpenAI quota exhausted';
    }
    if (status === 429) return 'OpenAI rate limited';
    if (typeof status === 'number' && status >= 500) return 'OpenAI server error';
    return e.message || 'OpenAI error';
  }

  // abort
  if (e instanceof DOMException && e.name === 'AbortError') {
    return 'Request timed out';
  }
  if (typeof e === 'object' && e !== null && 'name' in e && String((e as { name?: string }).name) === 'AbortError') {
    return 'Request timed out';
  }

  // generic
  return e instanceof Error ? e.message : 'AI call failed';
}
