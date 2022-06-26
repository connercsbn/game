import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const game = {
	players: {
		1: [
			{
				x: 0,
				y: 0
			}
		],
		2: [
			{
				x: 0,
				y: 0
			}
		]
	}
};

wss.on('connection', function connection(ws) {
	ws.on('message', function message(data: string) {
		const move = JSON.parse(data);
		// game.players[move.player].push(move.mousePos);
		broadcast(JSON.stringify(move));
	});
});
function broadcast(msg: string) {
	wss.clients.forEach((client) => {
		client.send(msg);
	});
}

export {};
