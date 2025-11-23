<script lang="ts">
	import DataTable from '$lib/components/data-table-matches.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { columns } from './column.ts';
	import { pb } from '../pocketbase.ts';
	import { createMatches } from './logic.ts';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import type { Match } from '$lib/components/schemas.ts';

	let matches = $state(await pb.collection('matches').getFullList());
	let teams = $state(await pb.collection('teams').getFullList());
	let alert = $state('');

	async function createNewMatches() {
		matches = await pb.collection('matches').getFullList();
		teams = await pb.collection('teams').getFullList();
		alert = await createMatches(pb, matches, teams);
		showAlert(alert);
		matches = await pb.collection('matches').getFullList();
	}

	function showAlert(message: string) {
		alert = message;

		setTimeout(() => {
			alert = '';
		}, 4000); // 7 seconds
	}
</script>

<div class="mx-8 flex flex-wrap justify-around gap-6">
	<div class="flex grow flex-col items-center gap-2">
		<h2 class="font-bold">Terrain A</h2>
		<div class="w-full min-w-120">
			<DataTable data={matches.filter((m: Match) => m.court == 0)} {columns} />
		</div>
	</div>
	<div class="flex grow flex-col items-center gap-2">
		<h2 class="font-bold">Terrain B</h2>
		<div class="w-full min-w-120">
			<DataTable data={matches.filter((m: Match) => m.court == 1)} {columns} />
		</div>
	</div>
</div>

<Button class="mx-8" onclick={() => createNewMatches()}>Générer des nouveaux matches</Button>

{#if alert !== ''}
	<div class="fixed top-4 right-4 z-50">
		<Alert.Root>
			<Alert.Title>{alert}</Alert.Title>
		</Alert.Root>
	</div>
{/if}
