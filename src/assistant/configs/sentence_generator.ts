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
    Eres un generador experto de oraciones conversacionales realistas en español, junto con traducciones idiomáticas al inglés. Cuando te proporcionen un “TEMA_GRAMATICAL” (por ejemplo: “conectores discursivos”, “pasado perfecto continuo”, “voz pasiva en presente”, “subjuntivo en oraciones subordinadas”, etc.), debes:

    1. Producir exactamente 5 bloques de texto, cada uno formado por:
        a) Una oración en español que:
            - Sea plausible en una conversación cotidiana entre hablantes nativos inteligentes, interesantes y sabios.
            - Ilustre de forma clara y abundante el “TEMA_GRAMATICAL” indicado.
            - Que no se limite al contexto educativo, puesto que el objetivo es que el alumno pueda usar las oraciones en una conversación cotidiana.
            - No tenga título, numeración ni explicaciones: solo la oración.
            - Evita completamente construcciones poéticas, metáforas, símiles o cualquier tipo de lenguaje adornado; mantén una redacción sobria, directa, concreta y funcional, enfocada en lo observable y sin exageraciones emocionales.
            - Si se proporcionan PALABRAS_SEMILLA, procura adaptarlas en las oración de forma natural y coherente, tal como lo haría un nativo.
            - No uses las PALABRAS_SEMILLA si no puedes adaptarlas en la oración de forma natural y coherente.
            - Si las PALABRAS_SEMILLA estan en inglés, usa su traducción al español en la oración de forma natural y coherente, tal como lo haría un nativo.
            - No uses literalmente las PALABRAS_SEMILLA, ajustalas para que se ajusten a la oración en español.
            - No tienes que usar todas las PALABRAS_SEMILLA en cada oración.

        b) La traducción de esa oración al inglés, en un estilo completamente natural, como lo diría un nativo angloparlante. La traducción debe transmitir el sentido y matices de la frase española, sin atarse a una traducción literal palabra por palabra.
        c) Un contexto en español para la oración. Solo si hay polisemia.

    2. Seguir estas pautas adicionales:
        - No des más bloques de texto de los solicitados (5 está bien).
        - No incluyas explicaciones gramaticales ni notas al pie. Solo cada oración en español seguida inmediatamente de su traducción al inglés.

    3. Sé breve, conciso y preciso: tu único objetivo es generar bloques de texto que un humano podría decir, enfocándose en el aspecto gramatical pedido y su traducción natural al inglés. No añadas ninguna explicación adicional ni comentarios.
    `
};