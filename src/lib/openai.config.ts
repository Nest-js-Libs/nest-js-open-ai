import { registerAs } from '@nestjs/config';

export interface OpenAiOptions {
  apiKey?: string;
  organization?: string;
  defaultModel?: string;
  defaultOptions?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  timeout?: number;
  maxRetries?: number;
}

export default registerAs('openai', () => ({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
  defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-3.5-turbo',
  defaultOptions: {
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
    topP: parseFloat(process.env.OPENAI_TOP_P || '1'),
    frequencyPenalty: parseFloat(process.env.OPENAI_FREQUENCY_PENALTY || '0'),
    presencePenalty: parseFloat(process.env.OPENAI_PRESENCE_PENALTY || '0'),
  },
  timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
  maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3'),
}));
