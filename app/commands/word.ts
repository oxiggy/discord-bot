import { createClient } from '@/lib/supabase/server'
import { ButtonStyle, ComponentType, InteractionResponseType, MessageFlags } from 'discord-api-types/v10'
import type { APIModalSubmitInteraction } from 'discord-api-types/v10'
import { normalizeString, shuffleString } from '@/lib/utils/string'

const WORD_BTN_PREFIX = 'word:btn:'
const WORD_MODAL_PREFIX = 'word:modal:'
const WORD_INPUT_PREFIX = 'word:input:'

export async function handleWordCommand() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("words").select("id, content");

  if (error || !data || data.length === 0) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "⚠️ Не удалось получить слово.",
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  const { id: wordId, content: randomWord } = data[Math.floor(Math.random() * data.length)] || { id: "", content: "" };
  const shuffledWord = shuffleString(randomWord).toUpperCase();

  const buttonId = `${WORD_BTN_PREFIX}${wordId}`
  const content = `Собери слово из букв: ${shuffledWord}`;

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: content,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Secondary,
              label: 'Ответить',
              emoji: { id: '410065050020347905' },
              custom_id: buttonId,
            },
          ]
        }
      ],
      flags: MessageFlags.Ephemeral,
    },
  };
}

/** Клик по кнопке Ответить. Открытие модального окна.  */
export const isWordButton = (customId: string | undefined): boolean => typeof customId === 'string' && customId.startsWith(WORD_BTN_PREFIX)

export function handleWordButton(customId: string) {
  const baseId = customId.replace(WORD_BTN_PREFIX, '')
  const modalId = `${WORD_MODAL_PREFIX}${baseId}`
  const inputId = `${WORD_INPUT_PREFIX}${baseId}`

  return {
    type: InteractionResponseType.Modal,
    data: {
      custom_id: modalId,
      title: "WORD",
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: 1,
              label: "Ответ",
              custom_id: inputId,
              required: true,
              min_length: 1,
              max_length: 64,
              placeholder: "...",
            },
          ]
        },
      ],
    },
  };
}


/** Работа с модальным окном. */
 export function isWordModalSubmit(json: APIModalSubmitInteraction): boolean {
   const cid = json?.data?.custom_id as string | undefined
   return typeof cid === 'string' && cid.startsWith(WORD_MODAL_PREFIX)
 }

export async function handleWordModalSubmit(json: APIModalSubmitInteraction) {
   // Ищем нужный импут по custom_id
  const rows = json?.data?.components as | { type: number; components: {type: number; custom_id: string; value?: string}[] }[] | undefined
  const input = rows?.flatMap(r => r?.components ?? [])
      .find(c => c?.type === ComponentType.TextInput && typeof c?.custom_id === 'string' && c.custom_id.startsWith(WORD_INPUT_PREFIX))

  if (!input) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'Не нашли поле ввода — потеряли адресат 🤖',
        flags: MessageFlags.Ephemeral,
      },
    }
  }

  // Достаём из инпута id слова и ответ игрока
  const fullInputId = input.custom_id
  const id = fullInputId.slice(WORD_INPUT_PREFIX.length)
  const answer = input.value ?? ''

  // Получаем из базы слово по id
  const supabase = await createClient();
  const { data, error } = await supabase.from("words").select("content").eq('id', id).single();

  if (error || !data?.content) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `Не получилось получить слово по id=${id} 😿`,
        flags: MessageFlags.Ephemeral,
      },
    }
  }

  // Сравниваем ответ игрока с оригиналом
  const original = data.content
  const isCorrect = normalizeString(answer) === normalizeString(original)

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: [
        isCorrect ? '✅ Верно!' : '❌ Неверно.',
        `Ваш ответ: **${answer || '—'}**`,
        `Загаданное слово: **${original}**`,
      ].join('\n'),
      flags: MessageFlags.Ephemeral,
    },
  }
}
