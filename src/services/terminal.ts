import readline from "readline";

// Códigos de color ANSI
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

export class Terminal {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public question(question: string): Promise<string> {
        return new Promise<string>(resolve => {
            this.rl.question(`${COLORS.cyan}${question}${COLORS.reset}`, resolve);
        });
    }

    public print(message: any) {
        console.log(`${COLORS.white}${message}${COLORS.reset}`);
    }

    public printSuccess(message: string) {
        console.log(`${COLORS.green}${message}${COLORS.reset}`);
    }

    public printContext(context: string) {
        console.log(`${COLORS.dim}Contexto: ${context}${COLORS.reset}`);
    }

    public printFeedback(error: string, correct: string, explanation: string | null) {
        console.log(`${COLORS.red}${error}${COLORS.reset} -> ${COLORS.green}${correct}${COLORS.reset}`);
        if (explanation) {
            console.log(`${COLORS.white}${explanation}${COLORS.reset}`);
        }
    }

    public printComparison(transalation: string, userTranslation: string) {
        console.log(`🤖: ${COLORS.green}${transalation}${COLORS.reset}`);
        console.log(`🤓: ${COLORS.magenta}${userTranslation}${COLORS.reset}`);
    }

    public printBreakLine() {
        console.log('\n');
    }

    public clearScreen() {
        console.clear();
    }
}  