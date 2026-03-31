<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { myTeam } from '../../routes/store.svelte';
	let { data }: NodeProps = $props();
</script>

<div class="flex w-70 items-center justify-between gap-2 text-xs">
	<Badge
		variant="outline"
		class={myTeam.name === data.label ? 'border-green-500 text-green-500' : ''}
	>
		{data.label.length > 21 ? data.label.slice(0, 21) + '...' : data.label}
	</Badge>
	<div class="grow"></div>
	<p>
		{data.wins} 🏆
	</p>
	<p>
		{data.loses} 💀
	</p>
	<p class="min-w-10 text-right">
		{data.points} 🏐
	</p>
</div>
