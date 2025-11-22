<script lang="ts">
	import Classement from '$lib/components/classement.svelte';
	import SwissGroup from '$lib/components/data-table-simple.svelte';
	import Poule from '$lib/components/data-table-poule.svelte';
	import teams from '../teams.ts';
</script>

<div
	class="flex gap-6
"
>
	<div class="flex flex-col">
		<h1 class="mx-8 mt-4 mb-4 scroll-m-20 text-xl font-extrabold tracking-tight text-balance">
			Ronde Suisse
		</h1>
		<div class="flex flex-wrap">
			<SwissGroup data={teams} title="Toutes les équipes" default_message="" />
			<div class="flex flex-col justify-around">
				<SwissGroup
					data={teams.filter((team) => team.swiss_points[0] == 1)}
					title="🏆 Victoire"
					default_message=""
				/>
				<SwissGroup
					data={teams.filter((team) => team.swiss_points[0] == 0)}
					title="🤕 Défaite"
					default_message=""
				/>
			</div>
			<div class="flex flex-col justify-around">
				<SwissGroup
					data={teams.filter(
						(team) =>
							team.swiss_points.length == 2 && team.swiss_points.reduce((a, b) => a + b, 0) == 2
					)}
					title="🏆🏆 2 Victoires"
					winner={true}
					default_message=""
				/>
				<SwissGroup
					data={teams.filter(
						(team) =>
							team.swiss_points.length == 2 && team.swiss_points.reduce((a, b) => a + b, 0) == 1
					)}
					title="🏆🤕 1 Victoire 1 Défaite"
					default_message=""
				/>
				<SwissGroup
					data={teams.filter(
						(team) =>
							team.swiss_points.length == 2 && team.swiss_points.reduce((a, b) => a + b, 0) == 0
					)}
					title="🤕🤕 2 Défaites"
					winner={false}
					default_message=""
				/>
			</div>
			<div class="flex flex-col justify-around">
				<SwissGroup
					data={teams.filter(
						(team) =>
							team.swiss_points.length == 2 && team.swiss_points.reduce((a, b) => a + b, 0) == 2
					)}
					title="🏆🏆 2 Victoires"
					winner={true}
					hidden={true}
					default_message=""
				/>
				<SwissGroup
					data={teams.filter(
						(team) =>
							team.swiss_points.length == 3 && team.swiss_points.reduce((a, b) => a + b, 0) == 2
					)}
					title="🏆🏆🤕 2 Victoires 1 Défaite"
					winner={true}
					default_message=""
				/>
				<SwissGroup
					data={teams.filter(
						(team) =>
							team.swiss_points.length == 3 && team.swiss_points.reduce((a, b) => a + b, 0) == 1
					)}
					title="🏆🤕🤕 1 Victoire 2 Défaites"
					winner={false}
					default_message=""
				/>
				<SwissGroup
					data={teams.filter(
						(team) =>
							team.swiss_points.length == 3 && team.swiss_points.reduce((a, b) => a + b, 0) == 0
					)}
					title="🤕🤕 2 Défaites"
					winner={false}
					hidden={true}
					default_message=""
				/>
			</div>
		</div>
	</div>
	<div>
		<h1 class="mx-8 mt-4 mb-4 scroll-m-20 text-xl font-extrabold tracking-tight text-balance">
			Poule de classement
		</h1>
		<div class="flex h-full flex-col justify-around">
			<Poule
				data={teams.filter(
					(team) =>
						team.swiss_points.length >= 2 && team.swiss_points.filter((x) => x == 1).length >= 2
				)}
				winner={true}
				default_message="Équipes de 1 à 6"
			/>
			<Poule
				data={teams.filter(
					(team) =>
						team.swiss_points.length >= 2 && team.swiss_points.filter((x) => x == 0).length >= 2
				)}
				winner={false}
				default_message="Équipes de 7 à 12"
			/>
		</div>
	</div>
	<div>
		<h1 class="mx-8 mt-4 mb-4 scroll-m-20 text-xl font-extrabold tracking-tight text-balance">
			Finales
		</h1>
		<div class="flex h-full flex-col justify-around">
			<SwissGroup data={[]} title="Grande finale" default_message="" />
			<SwissGroup data={[]} title="Finale consolante" default_message="" />
		</div>
	</div>
</div>
