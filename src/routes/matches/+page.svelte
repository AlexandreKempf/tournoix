<script lang="ts">
	import DataTable from '$lib/components/data-table-matches.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { columns } from './column.ts';
	import { pb } from '../pocketbase.ts';
	import { createMatches } from './logic.ts';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import type { Match } from '$lib/components/schemas.ts';
	import { onMount } from 'svelte';

	let teams = $state<any[]>([]);
	let matches = $state<any[]>([]);

	onMount(async () => {
		teams = await pb.collection('teams').getFullList();
		matches = await pb.collection('matches').getFullList();

		// subscribe to all changes on the "teams" collection
		pb.collection('matches').subscribe('*', function (e) {
			if (e.action === 'create') {
				matches.push(e.record);
			}

			if (e.action === 'update') {
				matches = matches.map((m) => (m.id === e.record.id ? e.record : m));
			}
		});

		return () => {
			// cleanup when component is destroyed
			pb.collection('teams').unsubscribe('*');
		};
	});
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
		}, 3000);
	}
</script>

<div class="flex flex-col xl:flex-row">
	<div class="mx-1 mb-4 flex flex-col sm:mx-8 xl:w-[50%]">
		<h2 class="m-2 mx-auto text-2xl font-bold">Terrain A</h2>
		<DataTable data={matches.filter((m: Match) => m.court == 0)} {columns} />
	</div>
	<div class="mx-1 flex flex-col sm:mx-8 xl:w-[50%]">
		<h2 class="m-2 mx-auto text-2xl font-bold">Terrain B</h2>
		<DataTable data={matches.filter((m: Match) => m.court == 1)} {columns} />
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
