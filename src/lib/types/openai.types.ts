/**
 * Tipos y interfaces utilizados en el módulo OpenAI
 */

/**
 * Roles disponibles para los mensajes en una conversación
 */
export enum ChatRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  FUNCTION = 'function',
}

/**
 * Mensaje de chat para la API de OpenAI
 */
export interface ChatMessage {
  role: string;
  content: string;
  name?: string;
}

/**
 * Opciones para la generación de texto
 */
export interface TextGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

/**
 * Opciones para la completación de chat
 */
export interface ChatCompletionOptions extends TextGenerationOptions {
  messages: ChatMessage[];
}

/**
 * Opciones para la generación con prompt de sistema
 */
export interface SystemPromptOptions {
  systemPrompt: string;
  userPrompt: string;
  options?: TextGenerationOptions;
}

/**
 * Opciones para continuar una conversación
 */
export interface ConversationOptions {
  conversation: ChatMessage[];
  newMessage: string;
  options?: TextGenerationOptions;
}
