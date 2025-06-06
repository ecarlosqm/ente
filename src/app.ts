import OpenAI from "openai";
import { SentenceGenerator } from "./services/sentence_generator";
import { TranslationAnalyser } from "./services/translation_analyser";
import type { Sentence } from "./assistant/configs/sentence_generator";
import type { TranslationError } from "./assistant/configs/translation_analyser";
import SuggestedWordsService from "./services/suggested_words_service";

class App {
    private openai?: OpenAI;
    private sentenceGenerator?: SentenceGenerator;
    private translationAnalyser?: TranslationAnalyser;
    private suggestedWordsService?: SuggestedWordsService;

    private currentSentences: Sentence[];
    private currentSentenceIndex: number;
    private suggestedWords: Set<string>;

    private themeInput: HTMLInputElement;
    private startButton: HTMLButtonElement;
    private listenButton: HTMLButtonElement;
    private practiceSection: HTMLElement;
    private sentenceSection: HTMLElement;
    private originalSentence: HTMLElement;
    private originalSentenceFeedback: HTMLElement;
    private contextInfo: HTMLElement;
    private translationInput: HTMLTextAreaElement;
    private checkButton: HTMLButtonElement;
    private feedbackSection: HTMLElement;
    private feedbackContent: HTMLElement;
    private correctTranslationFeedback: HTMLElement;
    private userTranslationFeedback: HTMLElement;
    private nextButton: HTMLButtonElement;
    private suggestedWordInput: HTMLInputElement;
    private addWordButton: HTMLButtonElement;
    private suggestedWordsList: HTMLElement;
    private toggleSuggestedWordsBtn: HTMLButtonElement;
    private closeSuggestedWordsBtn: HTMLButtonElement;
    private suggestedWordsSection: HTMLDivElement;

    constructor() {
        this.currentSentences = [];
        this.currentSentenceIndex = 0;
        this.suggestedWords = new Set();
        
            // Elementos del DOM
        this.themeInput = document.getElementById('themeInput') as HTMLInputElement;
        this.startButton = document.getElementById('startButton') as HTMLButtonElement;
        this.practiceSection = document.getElementById('practiceSection') as HTMLElement;
        this.originalSentence = document.getElementById('originalSentence') as HTMLElement;
        this.originalSentenceFeedback = document.getElementById('originalSentenceFeedback') as HTMLElement;
        this.contextInfo = document.getElementById('contextInfo') as HTMLElement;
        this.translationInput = document.getElementById('translationInput') as HTMLTextAreaElement;
        this.checkButton = document.getElementById('checkButton') as HTMLButtonElement;
        this.sentenceSection = document.getElementById('sentenceSection') as HTMLElement;
        this.feedbackSection = document.getElementById('feedbackSection') as HTMLElement;
        this.feedbackContent = document.getElementById('feedbackContent') as HTMLElement;
        this.correctTranslationFeedback = document.getElementById('correctTranslationFeedback') as HTMLElement;
        this.userTranslationFeedback = document.getElementById('userTranslationFeedback') as HTMLElement;
        this.nextButton = document.getElementById('nextButton') as HTMLButtonElement;
        this.listenButton = document.getElementById('listenButton') as HTMLButtonElement;
        this.suggestedWordInput = document.getElementById('suggestedWordInput') as HTMLInputElement;
        this.addWordButton = document.getElementById('addWordButton') as HTMLButtonElement;
        this.suggestedWordsList = document.getElementById('suggestedWordsList') as HTMLElement;
        this.toggleSuggestedWordsBtn = document.getElementById('toggleSuggestedWords') as HTMLButtonElement;
        this.closeSuggestedWordsBtn = document.getElementById('closeSuggestedWords') as HTMLButtonElement;
        this.suggestedWordsSection = document.querySelector('.suggested-words-section') as HTMLDivElement;

        // Event listeners
        this.startButton.addEventListener('click', () => this.startPractice());
        this.checkButton.addEventListener('click', () => this.checkTranslation());
        this.nextButton.addEventListener('click', () => this.nextSentence());
        this.addWordButton.addEventListener('click', () => this.addSuggestedWord());
        this.suggestedWordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSuggestedWord();
        });
        this.themeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startPractice();
        });
        this.translationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.checkTranslation();
            }
        });
        this.listenButton.addEventListener('click', () => this.listenSentence());
        this.toggleSuggestedWordsBtn.addEventListener('click', () => {
            this.suggestedWordsSection.classList.toggle('hidden');
        });
        this.closeSuggestedWordsBtn.addEventListener('click', () => {
            this.suggestedWordsSection.classList.add('hidden');
        });

        // Load dependencies
        this.init();
    }

    async init() {
        await this.loadDependencies();
        this.loadSuggestedWords();
        speechSynthesis.getVoices();
    }

    private addSuggestedWord() {
        const word = this.suggestedWordInput.value.trim();
        if (!word) return;

        if (this.suggestedWords.has(word)) {
            alert('Esta palabra o frase ya está en la lista');
            return;
        }

        this.suggestedWords.add(word);
        this.suggestedWordsService!.addWord(word);
        this.updateSuggestedWordsList();
        this.suggestedWordInput.value = '';
        this.suggestedWordInput.focus();
    }

    private removeSuggestedWord(word: string) {
        this.suggestedWords.delete(word);
        this.suggestedWordsService!.removeWord(word);
        this.updateSuggestedWordsList();
    }

    private updateSuggestedWordsList() {
        this.suggestedWordsList.innerHTML = '';
        this.suggestedWords.forEach(word => {
            const tag = document.createElement('div');
            tag.className = 'suggested-word-tag';
            tag.innerHTML = `
                ${word}
                <button type="button" aria-label="Eliminar ${word}">×</button>
            `;
            tag.querySelector('button')?.addEventListener('click', () => this.removeSuggestedWord(word));
            this.suggestedWordsList.appendChild(tag);
        });
    }

    async getApiKey() {
        var apiKey = localStorage.getItem('openaiApiKey');
        if (apiKey) {
            return apiKey;
        }
        apiKey = prompt('Por favor, introduce tu API key de OpenAI:');
        if (!apiKey) {
            throw new Error('Se requiere una API key de OpenAI para usar la aplicación');
        }
        localStorage.setItem('openaiApiKey', apiKey);
        return apiKey;
    }

    async loadDependencies() {
        const apiKey = await this.getApiKey();

        try {
            this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        } catch (error) {
            console.error('Error al inicializar OpenAI:', error);
            alert('Error al inicializar OpenAI. Por favor, recarga la página e intenta de nuevo.');
        }
        this.sentenceGenerator = new SentenceGenerator(this.openai!);
        this.translationAnalyser = new TranslationAnalyser(this.openai!);
        this.suggestedWordsService = new SuggestedWordsService();
    }

    private loadSuggestedWords() {
        const suggestedWords = this.suggestedWordsService!.getSuggestedWords();
        this.suggestedWords = new Set(suggestedWords);
        console.log(this.suggestedWords);
        this.updateSuggestedWordsList();
    }

    async startPractice() {
        if (!this.openai) {
            alert('Por favor, introduce tu API key de OpenAI primero');
            return;
        }

        const theme = this.themeInput.value.trim();
        if (!theme) {
            alert('Por favor, introduce un tema gramatical');
            return;
        }

        try {
            this.startButton.disabled = true;
            this.startButton.textContent = 'Cargando...';

            const suggestedWordsArray = Array.from(this.suggestedWords);
            this.currentSentences = await this.sentenceGenerator!.generateSentences(theme, suggestedWordsArray);
            this.currentSentenceIndex = 0;

            this.practiceSection.classList.remove('hidden');
            this.sentenceSection.classList.remove('hidden');
            this.feedbackSection.classList.add('hidden');
            this.showCurrentSentence();
        } catch (error) {
            console.error('Error al generar oraciones:', error);
            alert('Hubo un error al generar las oraciones. Por favor, intenta de nuevo.');
        } finally {
            this.startButton.disabled = false;
            this.startButton.textContent = 'Comenzar';
        }
    }

    showCurrentSentence() {
        const sentence = this.currentSentences[this.currentSentenceIndex];
        this.originalSentence.textContent = sentence?.original ?? '';
        this.sentenceSection.classList.remove('hidden');
        if (sentence?.context) {
            this.contextInfo.textContent = `Contexto: ${sentence.context}`;
            this.contextInfo.classList.remove('hidden');

        } else {
            this.contextInfo.classList.add('hidden');
        }

        this.translationInput.value = '';
        this.translationInput.focus();
        this.feedbackSection.classList.add('hidden');
    }

    async checkTranslation() {
        const userTranslation = this.translationInput.value.trim();
        if (!userTranslation) {
            alert('Por favor, escribe tu traducción');
            return;
        }

        const currentSentence = this.currentSentences[this.currentSentenceIndex];

        try {
            this.checkButton.disabled = true;
            this.checkButton.textContent = 'Verificando...';

            const errors = await this.translationAnalyser!.analyseTranslation({
                theme: this.themeInput.value.trim(),
                original: currentSentence?.original ?? '',
                translation: currentSentence?.translation ?? '',
                studentTranslation: userTranslation
            });

            this.showFeedback(errors, currentSentence!, userTranslation);
        } catch (error) {
            console.error('Error al analizar la traducción:', error);
            alert('Hubo un error al verificar tu traducción. Por favor, intenta de nuevo.');
        } finally {
            this.checkButton.disabled = false;
            this.checkButton.textContent = 'Verificar';
        }
    }

    showFeedback(errors: TranslationError[], currentSentence: Sentence, userTranslation: string) {
        this.feedbackContent.innerHTML = '';

        if (errors.length === 0) {
            const successItem = document.createElement('div');
            successItem.className = 'feedback-item success';
            successItem.textContent = '¡Excelente! No se encontraron errores.';
            this.feedbackContent.appendChild(successItem);
        } else {
            errors.forEach(error => {
                const errorItem = document.createElement('div');
                errorItem.className = 'feedback-item error';

                const errorTag = document.createElement('div');
                errorTag.className = `error-tag ${error.type}`;
                errorTag.textContent = error.type;
                errorItem.appendChild(errorTag);

                const errorContent = document.createElement('div');
                errorContent.className = 'error-content';
                errorContent.innerHTML = `
                    <p>
                        <span style="color: red;">${error.error}</span>
                        <span> -> </span>
                        <span style="color: green;">${error.correct}</span>
                    </p>
                `;

                errorItem.appendChild(errorContent);
                const explanationP = document.createElement('p');
                explanationP.style.margin = '0';
                explanationP.innerHTML = `<span style="color: gray;">${error.explanation}</span>`;
                errorItem.appendChild(explanationP);
                this.feedbackContent.appendChild(errorItem);
            });
        }

        this.originalSentenceFeedback.textContent = currentSentence.original;
        this.correctTranslationFeedback.textContent = currentSentence.translation;
        this.userTranslationFeedback.textContent = userTranslation;
        this.sentenceSection.classList.add('hidden');
        this.feedbackSection.classList.remove('hidden');
    }

    nextSentence() {
        this.currentSentenceIndex++;
        if (this.currentSentenceIndex >= this.currentSentences.length) {
            if (confirm('¡Has completado todas las oraciones! ¿Quieres practicar con otro tema?')) {
                this.themeInput.value = '';
                this.practiceSection.classList.add('hidden');
                this.sentenceSection.classList.add('hidden');
                this.feedbackSection.classList.add('hidden');
                this.themeInput.focus();
            } else {
                this.currentSentenceIndex = 0;
                this.showCurrentSentence();
            }
        } else {
            this.showCurrentSentence();
        }
    }

    async listenSentence() {
        const sentence = this.currentSentences[this.currentSentenceIndex];
        if (!sentence) return;
        const utterance = new SpeechSynthesisUtterance(sentence.translation);
        utterance.lang = 'en-US';
        const voices = speechSynthesis.getVoices().filter(voice => voice.lang === 'en-US');
        const avaVoice = voices.find(voice => voice.name === 'Ava');
        const samanthaVoice = voices.find(voice => voice.name === 'Samantha');
        utterance.voice = avaVoice ?? samanthaVoice ?? voices[0] ?? null;
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 