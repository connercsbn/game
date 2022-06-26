<script lang="ts">
	import { onMount } from 'svelte';
	let message = '';
	let ws;
	let canvas;
	let ctx;
	type MousePos = {
		x: number;
		y: number;
	};
	const fillPixel = (x, y) => {
		ctx.fillStyle = 'rgba(' + 0 + ',' + 0 + ',' + 0 + ',' + 255 / 255 + ')';
		ctx.fillRect(x, y, 3, 3);
	};
	let mousePos: MousePos = { x: 0, y: 0 };
	const handleMouseMove = (e) => {
		mousePos.x = e.x;
		mousePos.y = e.y;
		ws.send(JSON.stringify({ player: 1, mousePos: mousePos }));
	};
	onMount(() => {
		ctx = canvas.getContext('2d');
		ws = new WebSocket('ws://localhost:8080');
		ws.addEventListener('message', (data) => {
			const info = JSON.parse(data.data);
			console.log(info.mousePos);
			fillPixel(info.mousePos.x, info.mousePos.y);
		});
	});
</script>

<svelte:window on:mousemove={handleMouseMove} />
<canvas bind:this={canvas} width={1000} height={1000} />
{mousePos.x.toString()}
{mousePos.y.toString()}

<style>
	canvas {
		position: absolute;
		z-index: -1;
		inset: 0;
	}
</style>
