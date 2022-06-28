import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 8080 });
interface move {
	x: number;
	y: number;
}
const clients = new Map();
const game: { players: { [key: string]: { color: number; moves: move[] } } } = {
	players: {
		[uuidv4()]: { color: 0, moves: [{ x: 0, y: 0 }] }
	}
};
wss.on('connection', function connection(ws) {
	const id: string = uuidv4();
	const color: number = Math.floor(Math.random() * 360);
	const metadata = { id, color };
	clients.set(ws, metadata);
	game.players[id] = { color: 0, moves: [] };

	ws.on('message', function message(data: string) {
		const { color, id } = clients.get(ws);
		const json = JSON.parse(data);
		console.log(json);
		if ('init' in json) {
			if (json.init) {
				clients.set(ws, { id: json.init, color: clients.get(ws).color });
				if (!game.players[json.init]) {
					game.players[json.init] = { moves: [], ...clients.get(ws) };
				}
			}
			for (const player of Object.values(game.players)) {
				ws.send(JSON.stringify({ color: player.color, moves: player.moves }));
			}
			ws.send(JSON.stringify({ color, id }));
		} else {
			const move: { mousePos: { x: number; y: number } } = JSON.parse(data);
			game.players[id].moves.push(move.mousePos);
			game.players[id].color = color;
			broadcast(JSON.stringify({ ...move, color }));
		}
	});
});
function broadcast(msg: string) {
	wss.clients.forEach((client) => {
		client.send(msg);
	});
}

export {};
