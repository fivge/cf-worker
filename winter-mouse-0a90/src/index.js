/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const KV_NAMESPACE = 'cf01';

const fetch = async (request, env, ctx) => {
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

const scheduled = (event) => {};

const handleKV = async (env) => {
	await env[KV_NAMESPACE].put('foo3', 'bar3ss');

	const value = await env[KV_NAMESPACE].get('foo3');

	return value;
};

export default {
	fetch,
	scheduled,
};
