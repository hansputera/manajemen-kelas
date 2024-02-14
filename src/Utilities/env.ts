import * as process from 'node:process';

export const readEnvironmentVariables = <T>(vars: Array<keyof T>): T => {
	const envs = Object.create({}) as T;

	for (const key of vars) {
		if (key in process.env) {
			envs[key] = Reflect.get(process.env, key);

			if (/^[0-9]+$/g.test(envs[key] as string)) {
				envs[key] = parseInt(envs[key] as string, 10) as T[keyof T];
			}
		} else {
			throw new Error(`Missing '${key.toString()}' on .env`);
		}
	}

	return envs;
};
