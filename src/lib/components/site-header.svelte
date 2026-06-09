<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount, setContext, getContext } from 'svelte';

	import { pb } from '../../routes/pocketbase.ts';
	import { myTeam } from '../../routes/store.svelte.ts';

	let teams = $state<any[]>([]);

	onMount(async () => {
		const result = await pb.collection('teams').getFullList();
		teams = result;
	});
</script>

<header
	class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center justify-between">
		<div class="flex items-center gap-1 truncate overflow-hidden px-4 lg:gap-2 lg:px-6">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
			<h1 class="hidden text-base font-medium sm:inline">Drefféac tournoi</h1>
		</div>
		<Select.Root type="single">
			<Select.Trigger class="ml-4 w-[180px]"
				>{myTeam.name === ''
					? 'Choisir son équipe'
					: myTeam.name.length > 20
						? myTeam.name.slice(0, 20) + '...'
						: myTeam.name}</Select.Trigger
			>
			<Select.Content>
				{#each teams as team}
					<Select.Item
						onclick={() => {
							myTeam.name = team.name;
						}}
						value={team.name}>{team.name}</Select.Item
					>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</header>
