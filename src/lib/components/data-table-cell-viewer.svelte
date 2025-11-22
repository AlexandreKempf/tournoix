<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import type { Team } from './schemas.js';

	const isMobile = new IsMobile();

	let { item, short }: { item: Team; short: boolean } = $props();
</script>

<Drawer.Root direction={isMobile.current ? 'bottom' : 'right'}>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button variant="link" class="mr-8 w-fit px-0 text-left text-foreground" {...props}>
				{short && item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
			</Button>
		{/snippet}
	</Drawer.Trigger>
</Drawer.Root>
