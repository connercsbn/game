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
	const getCurrentGameData: WSEventHandler = ({ data }) => {
		const metadata: Moves = JSON.parse(data);
		console.log(metadata);
		if ('moves' in metadata) {
			for (const move of metadata.moves || []) {
				fillPixel(move?.x, move?.y, Number(metadata.color));
			}
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
		mousePos.x = e.x;
		mousePos.y = e.y;
		ws.send(JSON.stringify({ player: id, mousePos: mousePos }));
	};
	onMount(() => {
		const uid = Cookies.get('uid') || '';
		ctx = canvas.getContext('2d');
		ws = new WebSocket('ws://www.conner.soy:3009');
		ws.addEventListener('message', getCurrentGameData);
		ws.onopen = () => {
			ws.send(JSON.stringify({ init: uid }));
		};
	});
</script>

<svelte:window on:mousemove={handleMouseMove} />
<canvas bind:this={canvas} width={1200} height={800} />
{mousePos.x.toString()}
{mousePos.y.toString()}

<style>
	canvas {
		position: absolute;
		z-index: -1;
		overflow: hidden;
		inset: 0;
	}
</style>
