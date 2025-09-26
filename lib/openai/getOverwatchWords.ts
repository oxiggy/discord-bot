import { aiChat } from '@/lib/openai/service'

export async function getOverwatchWords(): Promise<string[]> {
  const prompt = `нужно 20 слов, связанный с овервотч - имена героев и название карт. 
  ответ в одном предложении, слова просто перечисли через пробел`;

  const { success, data, error } = await aiChat({
    messages: [{ role: "user", content: prompt }],
  });

  if (!success || !data) {
    throw new Error(error ?? 'AI returned nothing');
  }

  const raw: string = data.replace(/[.,;]+/g, ' ').replace(/\s+/g, ' ').trim();

  const words: string[] = raw
    .split(" ")
    .map(w => w.replace(/^[\s"“”'`]+|[\s"“”'`]+$/g, '').trim())
    .filter(Boolean);

  return Array.from(new Set(words));
}
