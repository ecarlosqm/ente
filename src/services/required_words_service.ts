export default class RequiredWordsService {

    public addWord(word: string): void {
        const requiredWords = this.getRequiredWords();
        requiredWords.push(word);
        localStorage.setItem('requiredWords', JSON.stringify(requiredWords));
    }

    public removeWord(word: string): void {
        const requiredWords = this.getRequiredWords();
        const newRequiredWords = requiredWords.filter(w => w !== word);
        localStorage.setItem('requiredWords', JSON.stringify(newRequiredWords));
    }
    
    public getRequiredWords(): string[] {
        const requiredWords = localStorage.getItem('requiredWords');
        return requiredWords ? JSON.parse(requiredWords) : [];
    }
}