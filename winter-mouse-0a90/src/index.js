const MS_API_LIST = (userId) => [
	`/users/${userId}`,
	`/${userId}/drive`,
	`/sites/root`,
	`/users/${userId}/calendars`,
	`/users/${userId}/calendarGroups`,
	`/users/${userId}/events`,
	`/users/${userId}/calendar/events`,
	`/users/${userId}/photo`,
	`/users/${userId}/contacts`,
];

let kv = {};

const workerFetch = async (request, env, ctx) => {
	kv = env[env.KV_KEY];
	try {
		const value = await handleKV(env);
		if (value === null) {
			return new Response('Value not found', { status: 404 });
		}
		return new Response(value);
	} catch (error) {
		console.error(`KV returned error: ${error}`);
		// return new Response('Hello Worker!');
		return new Response(err, { status: 500 });
	}
};

const scheduled = async (event, env, ctx) => {
	kv = env[env.KV_KEY];
	ctx.waitUntil(onScheduled(env));
};

const onScheduled = async (env) => {
	const token = await getToken(env);
	const userId = await getRandomUser(token);
	console.log('userId', userId);
	await requestRandomMSApi(userId, token);
	// console.log('doSomeTaskOnASchedule env', env, new Date());
	return true;
};

const handleKV = async (env) => {
	await kv.put('foo3', 'pong');

	const value = await kv.get('foo3');

	return value;
};

const getToken = async (env) => {
	let token = '';
	try {
		let token = await kv.get('ms_token');
		token = JSON.parse(token);
		if (token.expires_time < new Date().getTime()) {
			token = '';
		} else {
			token = token.access_token;
		}
	} catch (error) {}

	if (!token) {
		token = await getToken$(env);
	}

	return token;
};

const getToken$ = async (env) => {
	try {
		const tenantId = env.MS_TANANT_ID;
		const clientId = env.MS_CLIENT_ID;
		const clientSecret = env.MS_CLIENT_SECRET;
		if (!tenantId) {
			console.log('env MS_CLIENT_ID not config, stopped');
			return;
		}
		const params = new URLSearchParams();
		params.set('client_id', clientId);
		params.set('scope', 'https://graph.microsoft.com/.default');
		params.set('client_secret', clientSecret);
		params.set('grant_type', 'client_credentials');
		await delay();
		const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: params,
		}).then((res) => res.json());
		let token = {
			...res,
		};
		const createTime = new Date().getTime();
		const expiresTime = createTime + token.expires_in * 1000;
		token.create_time = createTime;
		token.expires_time = expiresTime;
		token = JSON.stringify(token);

		await kv.put('ms_token', token);

		return res.access_token;
	} catch (error) {}
};

const getRandomUser = async (token) => {
	try {
		let userList = await msGraphRequest('/users', token);
		userList = userList.value;
		const userId = userList[getRandomInt(getRandomInt.length)].id;
		return userId;
	} catch (error) {
		console.log('error', error);
	}
};

const requestRandomMSApi = async (userId, token) => {
	const apiList = MS_API_LIST(userId);
	const times = getRandomInt(apiList.length);
	const newApiList = new Array(times).fill(null).map((i) => apiList[getRandomInt(times)]);
	console.log('new', newApiList, times);
	for (const uri of newApiList) {
		const res = await msGraphRequest(uri, token);
		console.log('***** res', res);
	}
};

const getRandomInt = (max) => {
	return Math.floor(Math.random() * max);
};

const msGraphRequest = async (uri, token) => {
	try {
		const url = `https://graph.microsoft.com/v1.0/${uri}`;
		await delay();
		const res = await fetch(url, {
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}).then((res) => res.json());

		return res;
	} catch (error) {}
};

const delay = () => {
	const time = getRandomInt(30) * 1000;
	// const time = getRandomInt(1) * 100;
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};

export default {
	fetch: workerFetch,
	scheduled,
};
