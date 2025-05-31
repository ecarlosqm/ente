import { AssistantConfig } from './assistant_config.js';
import { z } from "zod";

const Sentence = z.object({
    original: z.string(),
    translation: z.string(),
    context: z.string().nullable(),
});

const Sentences = z.array(Sentence);

Sentences.parse

export const GenerateSentencesResponseSchema = z.object({
    sentences: Sentences
});

export type Sentences = z.infer<typeof Sentences>;
export type Sentence = z.infer<typeof Sentence>;
export type GenerateSentencesResponse = z.infer<typeof GenerateSentencesResponseSchema>;

export const SENTENCE_GENERATOR_CONFIG: AssistantConfig = {
    name: 'sentence_generator',
    model: 'gpt-4o',
    text: {
        format: {
            "type": "json_schema",
            "name": "grammatical_sentences",
            "strict": true,
            "schema": {
                "type": "object",
                "properties": {
                    "sentences": {
                        "type": "array",
                        "description": "A collection of sentences or phrases related to the grammatical theme.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "original": {
                                    "type": "string",
                                    "description": "An individual sentence or phrase."
                                },
                                "translation": {
                                    "type": "string",
                                    "description": "A natural english transalation."
                                },
                                "context": {
                                    "type": "string",
                                    "description": "A context in spanish for the sentence. Only if there is a polisemia or contextual ambiguity."
                                }
                            },
                            "required": [
                                "original",
                                "translation",
                                "context"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "required": [
                    "sentences"
                ],
                "additionalProperties": false
            }
        }
    },
    instructions: `
    Eres un generador experto de oraciones conversacionales realistas en español, junto con traducciones idiomáticas al inglés. Cuando te proporcionen un “TEMA_GRAMATICAL” (por ejemplo: “conectores discursivos”, “pasado perfecto continuo”, “voz pasiva en presente”, “subjuntivo en oraciones subordinadas”, etc.), debes:

    1. Producir exactamente 8-10 bloques de texto, cada uno formado por:
        a) Una oración en español que:
            - Sea plausible en una conversación cotidiana entre hablantes nativos.
            - Ilustre de forma clara y abundante el “TEMA_GRAMATICAL” indicado (sin mezclar con otros tiempos o construcciones, salvo que sea imprescindible para la coherencia).
            - Varíe el contexto para que no se sientan repetitivas.
            - No tenga título, numeración ni explicaciones: solo la oración.
        b) La traducción de esa oración al inglés, en un estilo completamente natural, como lo diría un nativo angloparlante. La traducción debe transmitir el sentido y matices de la frase española, sin atarse a una traducción literal palabra por palabra.
        c) Un contexto en español para la oración. Solo polisemia o ambigüedad contextual.

    2. Seguir estas pautas adicionales:
        - No des más bloques de texto de los solicitados (8-10 está bien).
        - No incluyas explicaciones gramaticales ni notas al pie. Solo cada oración en español seguida inmediatamente de su traducción al inglés.

    3. Sé breve, conciso y preciso: tu único objetivo es generar bloques de texto que un humano podría decir, enfocándose en el aspecto gramatical pedido y su traducción natural al inglés. No añadas ninguna explicación adicional ni comentarios.
    `
};