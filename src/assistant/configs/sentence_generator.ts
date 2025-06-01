import { z } from 'zod';
import type { AssistantConfig } from './assistant_config.js';
import dedent from 'dedent';

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
    temperature: null,
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
                                    "description": "A context in spanish for the sentence. Only if there is a polisemia."
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
    instructions: dedent`
    Eres un generador experto de oraciones conversacionales realistas en español, junto con traducciones idiomáticas al inglés. Cuando te proporcionen un TEMA_GRAMATICAL debes:

    1. Producir exactamente 5 bloques de texto, cada uno formado por:
        a) Una oración en español que:
            - Suene completamente natural. Si no es algo que un hablante nativo diga naturalmente, no lo uses.
            - Sea plausible en una conversación cotidiana entre hablantes nativos inteligentes, interesantes y sabios.
            - Ilustre el TEMA_GRAMATICAL indicado.
            - Que no se limite al contexto educativo, puesto que el objetivo es que el alumno pueda usar las oraciones en una conversación cotidiana.
            - Evita completamente construcciones poéticas, metáforas, símiles o cualquier tipo de lenguaje adornado; mantén una redacción sobria, directa, concreta y funcional, enfocada en lo observable y sin exageraciones emocionales.
            - Si las PALABRAS_SUGERIDAS son en inglés, usa su traducción al español en la oración de forma natural y coherente, tal como lo haría un nativo.
            - Si en las PALABRAS_SUGERIDAS hay un verbo conjugalo de la manejra correcta, se creativo.

        b) La traducción de esa oración al inglés que:
            - Este en un estilo completamente natural, como lo diría un nativo angloparlante.
            - Transmitir el sentido y matices de la frase española.
            - No se limite a una traducción literal palabra por palabra.
            - Debe respetar si se trata de una frase, pregunta, afirmación, negación, etc.
        c) Un contexto en español para la oración. Solo si hay polisemia.
    `
};