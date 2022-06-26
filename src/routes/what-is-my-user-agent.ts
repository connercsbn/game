import type { RequestEvent } from '@sveltejs/kit';
export function get(event: RequestEvent) {
	// log all headers
	console.log(event.request.headers);

	return {
		body: {
			// retrieve a specific header
			userAgent: event.request.headers.get('user-agent')
		}
	};
}
