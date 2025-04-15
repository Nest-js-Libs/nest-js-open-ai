# Módulo OpenAI para NestJS

### @nest-js/open-ai

[![npm version](https://img.shields.io/npm/v/@nest-js/open-ai.svg)](https://www.npmjs.com/package/@nest-js/open-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este módulo proporciona una integración completa con la API de OpenAI para aplicaciones NestJS, permitiendo utilizar fácilmente ChatGPT y otros modelos de OpenAI en tus proyectos.

## 📋 Características

- **Integración completa** con la API de OpenAI
- **Soporte para múltiples modelos** (GPT-3.5-turbo, GPT-4, etc.)
- **Gestión avanzada de prompts y conversaciones**
- **Configuración flexible** mediante opciones estáticas o dinámicas
- **Manejo inteligente de errores y reintentos automáticos**
- **Limitación de tasa** (rate limiting) para optimizar costos
- **Soporte para prompts de sistema** para personalizar el comportamiento del asistente
- **Continuación de conversaciones** para mantener el contexto
- **Consulta de modelos disponibles** en tu cuenta de OpenAI

## ⚙️ Configuración

### Variables de Entorno

Agrega las siguientes variables de entorno a tu archivo `.env`:

```env
OPENAI_API_KEY=tu_api_key_de_openai
OPENAI_ORGANIZATION=tu_id_de_organizacion_opcional
OPENAI_DEFAULT_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7
OPENAI_TOP_P=1
OPENAI_FREQUENCY_PENALTY=0
OPENAI_PRESENCE_PENALTY=0
OPENAI_TIMEOUT=30000
OPENAI_MAX_RETRIES=3
```

### Configuración Estática

Importa el módulo en tu `app.module.ts` con configuración estática:

```typescript
import { Module } from '@nestjs/common';
import { OpenAiModule } from '@nest-js/open-ai';

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
        topP: parseFloat(process.env.OPENAI_TOP_P || '1'),
        frequencyPenalty: parseFloat(process.env.OPENAI_FREQUENCY_PENALTY || '0'),
        presencePenalty: parseFloat(process.env.OPENAI_PRESENCE_PENALTY || '0'),
      },
      timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3'),
    }),
  ],
})
export class AppModule {}
```

### Configuración Asíncrona

Alternativamente, puedes usar configuración asíncrona con `ConfigModule`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAiModule } from '@nest-js/open-ai';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Configuración del módulo de configuración
    }),
    OpenAiModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('OPENAI_API_KEY'),
        organization: configService.get<string>('OPENAI_ORGANIZATION'),
        defaultModel: configService.get<string>('OPENAI_DEFAULT_MODEL') || 'gpt-3.5-turbo',
        defaultOptions: {
          temperature: parseFloat(configService.get('OPENAI_TEMPERATURE') || '0.7'),
          maxTokens: parseInt(configService.get('OPENAI_MAX_TOKENS') || '1000'),
          topP: parseFloat(configService.get('OPENAI_TOP_P') || '1'),
          frequencyPenalty: parseFloat(configService.get('OPENAI_FREQUENCY_PENALTY') || '0'),
          presencePenalty: parseFloat(configService.get('OPENAI_PRESENCE_PENALTY') || '0'),
        },
        timeout: parseInt(configService.get('OPENAI_TIMEOUT') || '30000'),
        maxRetries: parseInt(configService.get('OPENAI_MAX_RETRIES') || '3'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## 🚀 Uso Básico

### Inyección del Servicio

```typescript
import { Injectable } from '@nestjs/common';
import { OpenAiService } from '@nest-js/open-ai';

@Injectable()
export class TuServicio {
  constructor(private readonly openAiService: OpenAiService) {}

  // Métodos de tu servicio...
}
```

### Generación de Texto Simple

```typescript
async generarTexto(prompt: string): Promise<string> {
  return await this.openAiService.generateText(prompt, {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 150,
  });
}
```

### Completación de Chat

```typescript
async chatear(mensajes: Array<{ role: string; content: string }>): Promise<string> {
  return await this.openAiService.createChatCompletion({
    messages: mensajes,
    temperature: 0.5,
    maxTokens: 500,
  });
}
```

### Uso de Prompt de Sistema

```typescript
async responderConContexto(pregunta: string): Promise<string> {
  return await this.openAiService.generateWithSystemPrompt({
    systemPrompt: 'Eres un asistente experto en programación NestJS',
    userPrompt: pregunta,
    options: {
      temperature: 0.3,
      maxTokens: 800,
    },
  });
}
```

### Continuación de Conversaciones

```typescript
async continuarConversacion(
  conversacionPrevia: Array<{ role: string; content: string }>,
  nuevoMensaje: string
): Promise<string> {
  return await this.openAiService.continueConversation({
    conversation: conversacionPrevia,
    newMessage: nuevoMensaje,
    options: {
      temperature: 0.7,
      maxTokens: 500,
    },
  });
}
```

### Consulta de Modelos Disponibles

```typescript
async obtenerModelos(): Promise<string[]> {
  return await this.openAiService.getAvailableModels();
}
```

## 🔍 Ejemplos Avanzados

### Implementación de un Controlador

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { OpenAiService } from '@nest-js/open-ai';
import { ChatRole } from '@nest-js/open-ai';

@Controller('ia')
export class IaController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('asistente')
  async obtenerRespuesta(@Body() body: { pregunta: string }) {
    const respuesta = await this.openAiService.generateWithSystemPrompt({
      systemPrompt: 'Eres un asistente virtual amigable y servicial que ayuda a los usuarios con sus consultas.',
      userPrompt: body.pregunta,
      options: {
        temperature: 0.7,
        maxTokens: 500,
      },
    });
    
    return { respuesta };
  }

  @Post('chat')
  async chatear(@Body() body: { mensajes: Array<{ role: string; content: string }> }) {
    const respuesta = await this.openAiService.createChatCompletion({
      messages: body.mensajes,
      temperature: 0.5,
    });
    
    return { respuesta };
  }
}
```

### Personalización de Parámetros

Puedes ajustar los siguientes parámetros para controlar la generación de texto:

- **temperature**: Controla la aleatoriedad (0-1). Valores más bajos = respuestas más deterministas.
- **maxTokens**: Limita la longitud de la respuesta.
- **topP**: Controla la diversidad mediante muestreo de núcleo.
- **frequencyPenalty**: Penaliza palabras repetidas (0-2).
- **presencePenalty**: Penaliza tokens ya utilizados (0-2).

## 🧩 Integración con Otros Servicios

### Ejemplo con Servicio de Traducción

```typescript
@Injectable()
export class TraductorService {
  constructor(private readonly openAiService: OpenAiService) {}

  async traducir(texto: string, idiomaDestino: string): Promise<string> {
    return await this.openAiService.generateWithSystemPrompt({
      systemPrompt: `Eres un traductor profesional. Traduce el siguiente texto al idioma ${idiomaDestino} manteniendo el tono y contexto original.`,
      userPrompt: texto,
      options: {
        temperature: 0.3,
        maxTokens: 1000,
      },
    });
  }
}
```

## 📝 Limitaciones

- **Costos**: Gestiona adecuadamente los costos asociados con las llamadas a la API de OpenAI.
- **Límites de tokens**: Cada modelo tiene un límite máximo de tokens por solicitud (contexto + respuesta).
- **Rate limiting**: OpenAI impone límites de tasa que pueden afectar aplicaciones con alto volumen.
- **Latencia**: Las respuestas pueden tardar varios segundos, especialmente con modelos más grandes.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request en el repositorio.

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](https://opensource.org/licenses/MIT).