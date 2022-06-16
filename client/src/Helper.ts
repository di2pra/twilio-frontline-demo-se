export const addCodeTag = (text: string) => {
  return text.replace(/{{\s*[\w.]+\s*}}/g, (t1) => {
    return `<code>${t1}</code>`
  });
}

export const getFlagEmoji = (countryCode : string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const Delay = (value: any, duration: number) => {
  return new Promise(resolve => setTimeout(resolve, duration, value));
}