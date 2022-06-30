<script lang="ts">
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';
	let message = '';
	let ws: WebSocket;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	type MousePos = {
		x: number;
		y: number;
	};
	type WSEventHandler = (data: { data: string }) => void;
	let id: string;
	$: if (id) {
		ws.removeEventListener('message', getCurrentGameData);
		ws.addEventListener('message', playGame);
	}
	type Moves = { id?: string; color?: string; moves?: [{ x: number; y: number }] };
	const getCurrentGameData: WSEventHandler = async ({ data }) => {
		const metadata: Moves = JSON.parse(data);
		console.log(metadata);
		if ('moves' in metadata) {
			let i = 0;
			let interval = window.setInterval(() => {
				if (!metadata?.moves) {
					return clearInterval(interval);
				}
				let currentMove = metadata?.moves[i++];
				if (currentMove) {
					fillPixel(currentMove.x, currentMove.y, Number(metadata.color));
				}
			}, 0);
		} else if ('id' in metadata) {
			id = metadata.id as string;
			Cookies.set('uid', id);
		}
	};
	const playGame: WSEventHandler = ({ data }) => {
		const info = JSON.parse(data);
		fillPixel(info.mousePos.x, info.mousePos.y, info.color);
	};

	const fillPixel = (x: number, y: number, hue: number) => {
		if (ctx) ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
		ctx?.fillRect(x, y, 4, 4);
	};
	let mousePos: MousePos = { x: 0, y: 0 };
	const handleMouseMove = (e: MouseEvent) => {
		let rect = canvas.getBoundingClientRect();
		mousePos.x = e.x - rect.left;
		mousePos.y = e.y - rect.top;
		ws.send(JSON.stringify({ player: id, mousePos: mousePos }));
	};
	onMount(() => {
		const uid = Cookies.get('uid') || '';
		ctx = canvas.getContext('2d');
		ws = new WebSocket('ws://localhost:3009');
		ws.addEventListener('message', getCurrentGameData);
		ws.onopen = () => {
			ws.send(JSON.stringify({ init: uid }));
		};
	});
</script>

<svelte:window on:mousemove={handleMouseMove} />
<canvas bind:this={canvas} width={1100} height={700} />

<style>
	canvas {
		border: solid;
		border-image-source: url(https://media.istockphoto.com/photos/gold-vintage-frame-isolated-on-white-background-picture-id497315730);
	    border-image-slice: 261;
	    border-image-width: 271px;
	    border-image-outset: 54;
	    border-image-repeat: round;
	}
</style>
