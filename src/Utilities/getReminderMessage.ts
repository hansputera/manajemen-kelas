import {readFileSync} from 'fs';
import path from 'path';

export const getReminderMessage = (key: string, variables: Record<string, string>) => {
	const contents = readFileSync(path.resolve(__dirname, '..', 'assets', 'reminder_messages.json'), 'utf8');

	const contentsJson = Reflect.get(JSON.parse(contents), key) as string[];
	if (!contentsJson) {
		return undefined;
	}

	let text = contentsJson[Math.floor(Math.random() * contentsJson.length)];
	for (const variable of Object.keys(variables)) {
		text = text.replace(`{${variable}}`, variables[variable]);
	}

	return text;
};
