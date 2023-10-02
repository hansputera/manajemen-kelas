export const getGreetCondition = (): string => {
	const currentHour = new Date().getHours();

	if (currentHour < 10 && currentHour > 1) {
		return 'pagi';
	}

	if (currentHour > 10 && currentHour < 15) {
		return 'siang';
	}

	if (currentHour > 15 && currentHour < 20) {
		return 'sore';
	}

	return 'malam';
};
