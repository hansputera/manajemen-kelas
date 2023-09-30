export const toCapitalCase = (text: string): string => text.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
