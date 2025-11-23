<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	let { data, width, height }: NodeProps = $props();
</script>

<div
	class="text-bold rounded border border-2 border-black px-1 font-bold {data.background
		? data.background
		: ''}"
	style="width:{width}px; height:{height}px;"
>
	{data.label}
</div>
<!-- Invisible handles -->
{#if data.connection_left}
	<Handle type="target" position={Position.Left} isConnectable={true} />
{/if}
{#if data.connection_right}
	<Handle type="source" position={Position.Right} isConnectable={true} />
{/if}
