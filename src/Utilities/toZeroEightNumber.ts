export const toZeroEightNumber = (phone: string) => {
	const phoneMatches = phone.match(/[0-9]+/g);
	if (!phoneMatches?.length) {
		return undefined;
	}

	const phoneFix = phoneMatches.at(0) ?? '';
	if (phoneFix.startsWith('62')) {
		return phone.replace('62', '0');
	}

	if (phoneFix.startsWith('8')) {
		return '0'.concat(phoneFix);
	}

	return phoneFix;
};
