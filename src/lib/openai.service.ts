import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAiOptions } from './openai.config';
import {
  ChatCompletionOptions,
  ConversationOptions,
  SystemPromptOptions,
  TextGenerationOptions,
} from './types/openai.types';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat';

@Injectable()
export class OpenAiService implements OnModuleInit {
  private readonly logger = new Logger(OpenAiService.name);
  private openai: OpenAI;
  private readonly options: OpenAiOptions;

  constructor(private readonly configService: ConfigService) {
    this.options = this.configService.getOrThrow<OpenAiOptions>('openai');
  }

  onModuleInit() {
    if (!this.options?.apiKey) {
      this.logger.warn(
        'OpenAI API key not provided. Some features may not work.',
      );
      return;
    }

    this.openai = new OpenAI({
      apiKey: this.options.apiKey,
      organization: this.options.organization,
      timeout: this.options.timeout,
      maxRetries: this.options.maxRetries,
    });

    this.logger.log('OpenAI service initialized');
  }

  /**
   * Crea una completación de chat utilizando el modelo especificado
   */
  async createChatCompletion(options: ChatCompletionOptions): Promise<string> {
    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }

      const model = options.model || this.options.defaultModel;
      const temperature =
        options.temperature ?? this.options.defaultOptions?.temperature;
      const maxTokens =
        options.maxTokens ?? this.options.defaultOptions?.maxTokens;
      const topP = options.topP ?? this.options.defaultOptions?.topP;
      const frequencyPenalty =
        options.frequencyPenalty ??
        this.options.defaultOptions?.frequencyPenalty;
      const presencePenalty =
        options.presencePenalty ?? this.options.defaultOptions?.presencePenalty;

      const response = await this.openai.chat.completions.create({
        model,
        messages: options.messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
      } as ChatCompletionCreateParamsNonStreaming);

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(
        `Error creating chat completion: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Genera una respuesta basada en un prompt simple
   */
  async generateText(
    prompt: string,
    options?: TextGenerationOptions,
  ): Promise<string> {
    return this.createChatCompletion({
      messages: [{ role: 'user', content: prompt }],
      model: options?.model,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      topP: options?.topP,
      frequencyPenalty: options?.frequencyPenalty,
      presencePenalty: options?.presencePenalty,
    });
  }

  /**
   * Genera una respuesta basada en un sistema de prompts
   */
  async generateWithSystemPrompt({
    systemPrompt,
    userPrompt,
    options,
  }: SystemPromptOptions): Promise<string> {
    return this.createChatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: options?.model,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      topP: options?.topP,
      frequencyPenalty: options?.frequencyPenalty,
      presencePenalty: options?.presencePenalty,
    });
  }

  /**
   * Continúa una conversación existente
   */
  async continueConversation({
    conversation,
    newMessage,
    options,
  }: ConversationOptions): Promise<string> {
    const messages = [...conversation, { role: 'user', content: newMessage }];

    return this.createChatCompletion({
      messages,
      model: options?.model,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      topP: options?.topP,
      frequencyPenalty: options?.frequencyPenalty,
      presencePenalty: options?.presencePenalty,
    });
  }

  /**
   * Obtiene los modelos disponibles de OpenAI
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.openai.models.list();
      return response.data.map(model => model.id);
    } catch (error) {
      this.logger.error(
        `Error getting available models: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
