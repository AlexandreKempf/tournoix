<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { pb } from '../../routes/pocketbase.ts';
	import type { Match } from './schemas.ts';

	const TOURNAMENT_SCOPED_PATHS = ['/matches', '/organisation'];

	const sidebar = useSidebar();

	let teams = $state<any[]>([]);
	let matches = $state<any[]>([]);

	const ranking = $derived.by(() => {
		const stats = new Map<string, { wins: number; points: number }>();
		for (const t of teams) {
			stats.set(t.name, { wins: 0, points: 0 });
		}
		for (const m of matches as Match[]) {
			if (!m.teamA || !m.teamB) continue;
			const a = stats.get(m.teamA) ?? { wins: 0, points: 0 };
			const b = stats.get(m.teamB) ?? { wins: 0, points: 0 };
			a.points += m.scoreA ?? 0;
			b.points += m.scoreB ?? 0;
			if ((m.scoreA ?? 0) > (m.scoreB ?? 0)) a.wins += 1;
			else if ((m.scoreB ?? 0) > (m.scoreA ?? 0)) b.wins += 1;
			stats.set(m.teamA, a);
			stats.set(m.teamB, b);
		}
		return [...stats.entries()]
			.map(([name, s]) => ({ name, ...s }))
			.toSorted((x, y) => y.wins * 10000 + y.points - (x.wins * 10000 + x.points));
	});

	const isTournamentPage = $derived(TOURNAMENT_SCOPED_PATHS.includes(page.url.pathname));
	const visible = $derived(isTournamentPage && !sidebar.isMobile);

	onMount(() => {
		(async () => {
			teams = await pb.collection('teams').getFullList();
			matches = await pb.collection('matches').getFullList();
		})();

		pb.collection('matches').subscribe('*', (e) => {
			if (e.action === 'create') {
				matches.push(e.record);
			}
			if (e.action === 'update') {
				matches = matches.map((m) => (m.id === e.record.id ? e.record : m));
			}
			if (e.action === 'delete') {
				matches = matches.filter((m) => m.id !== e.record.id);
			}
		});

		return () => {
			pb.collection('matches').unsubscribe('*');
		};
	});
</script>

{#if visible}
	<Sidebar.Group>
		<Sidebar.GroupLabel>Classement</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="flex flex-col gap-2">
			<Sidebar.Menu>
				{#each ranking as team, idx (team.name)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton tooltipContent={team.name}>
							<span class="text-sidebar-foreground/60 w-5 tabular-nums">{idx + 1}.</span>
							<span>{team.name}</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.GroupContent>
	</Sidebar.Group>
{/if}
