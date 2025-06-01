export default class SuggestedWordsService {

    public addWord(word: string): void {
        const suggestedWords = this.getSuggestedWords();
        suggestedWords.push(word);
        localStorage.setItem('suggestedWords', JSON.stringify(suggestedWords));
    }

    public removeWord(word: string): void {
        const suggestedWords = this.getSuggestedWords();
        const newSuggestedWords = suggestedWords.filter(w => w !== word);
        localStorage.setItem('suggestedWords', JSON.stringify(newSuggestedWords));
    }
    
    public getSuggestedWords(): string[] {
        const suggestedWords = localStorage.getItem('suggestedWords');
        return suggestedWords ? JSON.parse(suggestedWords) : [];
    }
}