# Módulo OpenAI para NestJS

### @nest-js/open-ai

[![npm version](https://img.shields.io/npm/v/@nest-js/open-ai.svg)](https://www.npmjs.com/package/@nest-js/open-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este módulo proporciona una integración completa con la API de OpenAI para aplicaciones NestJS, permitiendo utilizar fácilmente ChatGPT y otros modelos de OpenAI.

## Características

- Integración con la API de OpenAI
- Soporte para diferentes modelos (GPT-3.5-turbo, GPT-4, etc.)
- Manejo de prompts y conversaciones
- Configuración flexible
- Manejo de errores y reintentos
- Limitación de tasa (rate limiting)

## Configuración

Agrega las siguientes variables de entorno a tu archivo `.env`:

```env
OPENAI_API_KEY=tu_api_key_de_openai
OPENAI_ORGANIZATION=tu_id_de_organizacion_opcional
OPENAI_DEFAULT_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7
```

Importa el módulo en tu `app.module.ts`:

```typescript
import { OpenAiModule } from './openai/openai.module';

@Module({
  imports: [
    // otros módulos...
    OpenAiModule.forRoot({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION,
      defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-3.5-turbo',
      defaultOptions: {
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
      }
    }),
  ],
})
export class AppModule {}
```

## Uso Básico

```typescript
import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../openai/openai.service';

@Injectable()
export class TuServicio {
  constructor(private readonly openAiService: OpenAiService) {}

  async generarTexto(prompt: string): Promise<string> {
    const respuesta = await this.openAiService.createCompletion({
      prompt,
      model: 'gpt-3.5-turbo',
    });
    return respuesta;
  }

  async chatear(mensajes: Array<{ role: string; content: string }>): Promise<string> {
    const respuesta = await this.openAiService.createChatCompletion({
      messages: mensajes,
    });
    return respuesta;
  }
}
```

## Ejemplos

Consulta el controlador de ejemplo en `controllers/openai-example.controller.ts` para ver ejemplos prácticos de cómo utilizar este módulo con prompts.

## Manejo de Errores

El servicio incluye manejo de errores y reintentos automáticos para problemas comunes como límites de tasa o errores de red.

## Limitaciones

- Asegúrate de gestionar adecuadamente los costos asociados con las llamadas a la API de OpenAI.
- Considera implementar un sistema de caché para respuestas frecuentes.
- Ten en cuenta los límites de tokens según el modelo utilizado.