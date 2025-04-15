import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsArray,
    IsOptional,
    Min,
    Max,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessage, ChatRole } from "src/lib/types/openai.types";

export class GenerateTextDto {
    @ApiProperty({
        description: 'Texto que se utilizará como prompt para generar contenido',
        example: 'Escribe un poema corto sobre la inteligencia artificial',
    })
    @IsString()
    @IsNotEmpty()
    prompt: string;

    @ApiPropertyOptional({
        description: 'Modelo de OpenAI a utilizar',
        example: 'gpt-3.5-turbo',
        default: 'gpt-3.5-turbo',
    })
    @IsString()
    @IsOptional()
    model?: string;

    @ApiPropertyOptional({
        description: 'Controla la aleatoriedad de la respuesta (0-1)',
        example: 0.7,
        default: 0.7,
        minimum: 0,
        maximum: 1,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1)
    temperature?: number;

    @ApiPropertyOptional({
        description: 'Número máximo de tokens a generar',
        example: 150,
        default: 150,
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    maxTokens?: number;

    @ApiPropertyOptional({
        description: 'Controla la diversidad mediante muestreo de núcleo (0-1)',
        example: 1,
        default: 1,
        minimum: 0,
        maximum: 1,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1)
    topP?: number;

    @ApiPropertyOptional({
        description: 'Penaliza las repeticiones de frecuencia (-2.0 a 2.0)',
        example: 0,
        default: 0,
        minimum: -2,
        maximum: 2,
    })
    @IsNumber()
    @IsOptional()
    @Min(-2)
    @Max(2)
    frequencyPenalty?: number;

    @ApiPropertyOptional({
        description: 'Penaliza las repeticiones generales (-2.0 a 2.0)',
        example: 0,
        default: 0,
        minimum: -2,
        maximum: 2,
    })
    @IsNumber()
    @IsOptional()
    @Min(-2)
    @Max(2)
    presencePenalty?: number;
}

export class ChatMessageDto implements ChatMessage {
    @ApiProperty({
        description: 'Rol del mensaje en la conversación',
        example: 'user',
        enum: ChatRole,
    })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({
        description: 'Contenido del mensaje',
        example: '¿Puedes explicarme qué es NestJS y por qué debería usarlo?',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({
        description: 'Nombre opcional para identificar al remitente',
        example: 'Usuario1',
    })
    @IsString()
    @IsOptional()
    name?: string;
}

export class ChatCompletionDto {
    @ApiProperty({
        description: 'Lista de mensajes que forman la conversación',
        type: [ChatMessageDto],
        example: [
            { role: 'system', content: 'Eres un asistente experto en programación' },
            {
                role: 'user',
                content: '¿Puedes explicarme qué es NestJS y por qué debería usarlo?',
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatMessageDto)
    messages: ChatMessage[];

    @ApiPropertyOptional({
        description: 'Modelo de OpenAI a utilizar',
        example: 'gpt-3.5-turbo',
        default: 'gpt-3.5-turbo',
    })
    @IsString()
    @IsOptional()
    model?: string;

    @ApiPropertyOptional({
        description: 'Controla la aleatoriedad de la respuesta (0-1)',
        example: 0.5,
        default: 0.5,
        minimum: 0,
        maximum: 1,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1)
    temperature?: number;

    @ApiPropertyOptional({
        description: 'Número máximo de tokens a generar',
        example: 300,
        default: 300,
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    maxTokens?: number;

    @ApiPropertyOptional({
        description: 'Controla la diversidad mediante muestreo de núcleo (0-1)',
        example: 1,
        default: 1,
        minimum: 0,
        maximum: 1,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1)
    topP?: number;

    @ApiPropertyOptional({
        description: 'Penaliza las repeticiones de frecuencia (-2.0 a 2.0)',
        example: 0,
        default: 0,
        minimum: -2,
        maximum: 2,
    })
    @IsNumber()
    @IsOptional()
    @Min(-2)
    @Max(2)
    frequencyPenalty?: number;

    @ApiPropertyOptional({
        description: 'Penaliza las repeticiones generales (-2.0 a 2.0)',
        example: 0,
        default: 0,
        minimum: -2,
        maximum: 2,
    })
    @IsNumber()
    @IsOptional()
    @Min(-2)
    @Max(2)
    presencePenalty?: number;
}

export class SystemPromptDto {
    @ApiProperty({
        description:
            'Instrucciones de sistema que definen el comportamiento del asistente',
        example:
            'Eres un experto en marketing digital que ofrece consejos concisos y prácticos',
    })
    @IsString()
    @IsNotEmpty()
    systemPrompt: string;

    @ApiProperty({
        description: 'Mensaje o pregunta del usuario',
        example:
            '¿Cuáles son las mejores estrategias para aumentar el engagement en redes sociales?',
    })
    @IsString()
    @IsNotEmpty()
    userPrompt: string;

    @ApiPropertyOptional({
        description: 'Modelo de OpenAI a utilizar',
        example: 'gpt-3.5-turbo',
        default: 'gpt-3.5-turbo',
    })
    @IsString()
    @IsOptional()
    model?: string;

    @ApiPropertyOptional({
        description: 'Controla la aleatoriedad de la respuesta (0-1)',
        example: 0.6,
        default: 0.6,
        minimum: 0,
        maximum: 1,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1)
    temperature?: number;

    @ApiPropertyOptional({
        description: 'Número máximo de tokens a generar',
        example: 300,
        default: 300,
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    maxTokens?: number;

    @ApiPropertyOptional({
        description: 'Controla la diversidad mediante muestreo de núcleo (0-1)',
        example: 1,
        default: 1,
        minimum: 0,
        maximum: 1,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1)
    topP?: number;

    @ApiPropertyOptional({
        description: 'Penaliza las repeticiones de frecuencia (-2.0 a 2.0)',
        example: 0,
        default: 0,
        minimum: -2,
        maximum: 2,
    })
    @IsNumber()
    @IsOptional()
    @Min(-2)
    @Max(2)
    frequencyPenalty?: number;

    @ApiPropertyOptional({
        description: 'Penaliza las repeticiones generales (-2.0 a 2.0)',
        example: 0,
        default: 0,
        minimum: -2,
        maximum: 2,
    })
    @IsNumber()
    @IsOptional()
    @Min(-2)
    @Max(2)
    presencePenalty?: number;
}
