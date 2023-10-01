export const compareTodayDate = (compareDate: Date): boolean => {
	const currentDate = new Date();

	return compareDate <= currentDate && compareDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
};
