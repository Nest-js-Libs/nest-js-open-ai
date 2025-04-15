import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatCompletionDto, GenerateTextDto, SystemPromptDto } from './dtos';
import { OpenAiService } from 'src/lib/openai.service';

@ApiTags('OpenAI')
@Controller('openai')
export class OpenAiExampleController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('generate-text')
  @ApiOperation({ summary: 'Genera texto a partir de un prompt simple' })
  @ApiResponse({ status: 200, description: 'Texto generado correctamente' })
  async generateText(
    @Body() dto: GenerateTextDto,
  ): Promise<{ result: string }> {
    const result = await this.openAiService.generateText(dto.prompt, {
      model: dto.model,
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    });
    return { result };
  }

  @Post('chat-completion')
  @ApiOperation({ summary: 'Genera una respuesta basada en una conversación' })
  @ApiResponse({ status: 200, description: 'Respuesta generada correctamente' })
  async chatCompletion(
    @Body() dto: ChatCompletionDto,
  ): Promise<{ result: string }> {
    const result = await this.openAiService.createChatCompletion({
      messages: dto.messages as any,
      model: dto.model,
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    });
    return { result };
  }

  @Post('system-prompt')
  @ApiOperation({
    summary: 'Genera una respuesta utilizando un prompt de sistema',
  })
  @ApiResponse({ status: 200, description: 'Respuesta generada correctamente' })
  async systemPrompt(
    @Body() dto: SystemPromptDto,
  ): Promise<{ result: string }> {
    const result = await this.openAiService.generateWithSystemPrompt({
      systemPrompt: dto.systemPrompt,
      userPrompt: dto.userPrompt,
      options: {
        model: dto.model,
        temperature: dto.temperature,
        maxTokens: dto.maxTokens,
      },
    });
    return { result };
  }

  @Get('examples')
  @ApiOperation({ summary: 'Obtiene ejemplos de prompts para usar con OpenAI' })
  @ApiResponse({ status: 200, description: 'Ejemplos obtenidos correctamente' })
  getExamples() {
    return {
      examples: [
        {
          title: 'Generación de texto simple',
          endpoint: '/openai/generate-text',
          payload: {
            prompt: 'Escribe un poema corto sobre la inteligencia artificial',
            temperature: 0.7,
            maxTokens: 150,
          },
        },
        {
          title: 'Conversación con ChatGPT',
          endpoint: '/openai/chat-completion',
          payload: {
            messages: [
              {
                role: 'system',
                content: 'Eres un asistente experto en programación',
              },
              {
                role: 'user',
                content:
                  '¿Puedes explicarme qué es NestJS y por qué debería usarlo?',
              },
            ],
            temperature: 0.5,
          },
        },
        {
          title: 'Uso de prompt de sistema',
          endpoint: '/openai/system-prompt',
          payload: {
            systemPrompt:
              'Eres un experto en marketing digital que ofrece consejos concisos y prácticos',
            userPrompt:
              '¿Cuáles son las mejores estrategias para aumentar el engagement en redes sociales?',
            temperature: 0.6,
            maxTokens: 300,
          },
        },
      ],
    };
  }
}
