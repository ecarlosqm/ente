import { z } from "zod";
import type { AssistantConfig } from "./assistant_config.js";
import dedent from "dedent";

const TranslationError = z.object({
    error: z.string(),
    correct: z.string(),
    type: z.string(),
    explanation: z.string().nullable(),
});

const TransalationErrors = z.array(TranslationError);

export const TranslationAnalysisResponseSchema = z.object({
    errors: TransalationErrors
});

export type TransalationErrors = z.infer<typeof TransalationErrors>;
export type TranslationError = z.infer<typeof TranslationError>;
export type TranslationAnalysisResponse = z.infer<typeof TranslationAnalysisResponseSchema>;

export const TRANSLATION_ANALYSER_CONFIG: AssistantConfig = {
    name: 'translation_analyser',
    model: 'gpt-4o',
    text: {
        format: {
            "type": "json_schema",
            "name": "translation_analysis",
            "strict": false,
            "schema": {
                "type": "object",
                "properties": {
                    "errors": {
                        "type": "array",
                        "description": "A collection of errors detected in the student translation.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "error": {
                                    "type": "string",
                                    "description": "Cited error of the student's translation, which may include grammar, spelling, or punctuation mistakes. Must be short and concise, ideally one word or a short phrase."
                                },
                                "correct": {
                                    "type": "string",
                                    "description": "The suggested correction for the error."
                                },
                                "type": {
                                    "type": "string",
                                    "description": "The type of error, e.g., 'grammar', 'spelling', 'punctuation'."
                                },
                                "explanation": {
                                    "type": "string",
                                    "description": "A pedagogical explanation of the error if applicable",
                                }
                            },
                            "required": [
                                "error",
                                "correct",
                                "type",
                                "explanation"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "required": [
                    "errors"
                ],
                "additionalProperties": false
            }
        }
    },
    instructions: dedent`
    Eres un evaluador experto en traducciones de español a inglés y un tutor exigente pero constructivo. Cuando recibas cuatro elementos:

        1. THEME (el tema gramatical que se está practicando)
        2. ORIGINAL (la frase en español)
        3. TRANSLATION (la versión correcta y natural en inglés)
        4. STUDENT_TRANSLATION (la versión que el alumno ha escrito en inglés)

    Debes realizar lo siguiente:

        1. Comparar minuciosamente la STUDENT_TRANSLATION con la TRANSLATION y el ORIGINAL.
        2. Emitir una calificación global de la traducción del alumno en una escala (0-10), fundamentada en:
            - Precisión semántica: ¿Captura correctamente el sentido completo de la frase ORIGINAL?
            - Corrección gramatical: ¿Usa estructuras y tiempos verbales adecuados en inglés?
            - Fluidez y estilo: ¿Suena natural para un hablante nativo de inglés? ¿Mantiene el registro y tono apropiados?
            - Fidelidad idiomática: ¿Evita calcos literales innecesarios y emplea expresiones propias del inglés?
        3. Proporcionar un análisis detallado que incluya:
            - Errores específicos detectados.
            - Para cada error:
            - Descripción clara y precisa de en qué consiste.
            - Corrección sugerida: Presentar la frase (o fragmento) corregida, con la solución adecuada.
            - Explicación pedagógica de ser necesaria. Los errores ortográficos no requieren explicación.
            - No corrijas los puntos finales de las frases.
        4. Tus explicaciones siempre deben ser en español.
    `
};