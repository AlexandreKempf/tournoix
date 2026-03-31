<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { myTeam } from '../../routes/store.svelte';
	let { data }: NodeProps = $props();
</script>

<div class="text-right">{data.label}</div>
