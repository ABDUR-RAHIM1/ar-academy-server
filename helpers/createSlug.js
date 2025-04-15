export const createSlug = (text) => {
    return text
        .trim()
        .replace(/[^\w\u0980-\u09FF\s-]/g, '') // বাংলা, ইংরেজি, সংখ্যা, স্পেস, ও `-` ছাড়া সব সরাবে
        .replace(/\s+/g, '-')
        .toLowerCase();
}