<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	let { data }: NodeProps = $props();
</script>

<div class="text-xs">
	<Badge variant="outline">
		{data.label.length > 20 ? data.label.slice(0, 20) + '...' : data.label}
	</Badge>
</div>
