import dotenv from "dotenv"
import { SentenceGenerator } from './services/sentence_generator.js';
import { TranslationAnalyser } from './services/translation_analyser.js';
import { Terminal } from './services/terminal.js';

dotenv.config()

async function main() {
    const terminal = new Terminal();
    const sentenceGenerator = new SentenceGenerator();
    const translationAnalyser = new TranslationAnalyser();

    while (true) {
        const theme = await terminal.question('Introduce el tema gramatical: ');
        const sentences = await sentenceGenerator.generateSentences(theme);
        terminal.clearScreen();
        for (const sentence of sentences) {
            terminal.print(`Traduce: ${sentence.original}`);
            if (sentence.context) {
                terminal.printContext(sentence.context);
            }
            const userTranslation = await terminal.question('');
            const errors = await translationAnalyser.analyseTranslation({
                theme: theme,
                original: sentence.original,
                translation: sentence.translation,
                studentTranslation: userTranslation
            });

            terminal.printBreakLine();

            if (errors.length === 0) {
                terminal.printSuccess('No se encontraron errores');
                continue;
            } else {
                for (const error of errors) {
                    terminal.printFeedback(error.error, error.correct, error.explanation);
                    terminal.printBreakLine();
                }
            }

            terminal.printComparison(sentence.translation, userTranslation);
            terminal.printBreakLine();

            terminal.print('Presiona enter para continuar');
            await terminal.question('');
            terminal.clearScreen();
        }
    }
}

// Run the example
main().catch(console.error); 