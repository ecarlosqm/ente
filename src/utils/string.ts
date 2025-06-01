class StringUtils {
    static removeLineBreaks(str: string) {
        return str.replace(/\n/g, '');
    }

    static removeQuotes(str: string) {
        return str.replace(/"/g, '');
    }   
}

export default StringUtils;