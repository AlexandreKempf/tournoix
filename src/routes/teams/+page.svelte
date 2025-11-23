<script lang="ts">
	import DataTable from '$lib/components/data-table-teams.svelte';
	import { columns } from './column.ts';
	import { pb } from '../pocketbase.ts';

	let teams = $state(await pb.collection('teams').getFullList());
</script>

<div class="mx-8 flex flex-col gap-6">
	<DataTable data={teams} {columns} />
</div>
