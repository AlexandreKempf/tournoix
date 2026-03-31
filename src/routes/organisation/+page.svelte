<script lang="ts">
	import { MarkerType, SvelteFlow, Background, type Node, type Edge } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import TeamNode from '$lib/components/teamnode.svelte';
	import RuleNode from '$lib/components/rulenode.svelte';
	import GroupNode from '$lib/components/groupnode.svelte';
	import TeamBracketNode from '$lib/components/teambracket.svelte';
	import { pb } from '../pocketbase.ts';
	import type { Match, Team } from '$lib/components/schemas.ts';
	import { onMount } from 'svelte';

	let teams = $state(await pb.collection('teams').getFullList());
	let matches = $state(await pb.collection('matches').getFullList());
	onMount(() => {
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
	function is_winner(match: Match, team: Team) {
		return (
			(match.teamA == team.name && match.scoreA > match.scoreB) ||
			(match.teamB == team.name && match.scoreB > match.scoreA)
		);
	}
	function is_loser(match: Match, team: Team) {
		return (
			(match.teamA == team.name && match.scoreA < match.scoreB) ||
			(match.teamB == team.name && match.scoreB < match.scoreA)
		);
	}
	function wins_in_bracket(matches: Match[], team: Team) {
		return matches.filter((m) => m.phase == 'bracket' && is_winner(m, team)).length;
	}

	function loses_in_bracket(matches: Match[], team: Team) {
		return matches.filter((m) => m.phase == 'bracket' && is_loser(m, team)).length;
	}

	function points_in_bracket(matches: Match[], team: Team) {
		return matches
			.filter((m) => m.phase == 'bracket')
			.map((m) => (m.teamA === team.name ? m.scoreA : m.teamB === team.name ? m.scoreB : 0))
			.reduce((a, b) => a + b, 0);
	}
	const top_margin_group = 30;
	const bottom_margin_group = 10;
	const vertical_gap = 5;
	const team_height = 20;

	let nodes = $state.raw<Node[]>([
		{
			id: 'SwissRound',
			type: 'group2',
			data: { label: 'Ronde Suisse', connection_left: false, connection_right: false },
			position: { x: 0, y: 0 },
			width: 1000,
			height: 600,
			draggable: false
		},
		{
			id: 'SwissRoundRules',
			type: 'rule',
			data: { label: "8 min ⏱️, 1 point d'écart", connection_left: false, connection_right: false },
			position: { x: 680, y: 10 },
			width: 300,
			height: 600,
			draggable: false
		},
		{
			id: 'FirstRound',
			type: 'group2',
			data: {
				label: 'All teams',
				connection_left: false,
				connection_right: true,
				background: 'bg-white'
			},
			position: { x: 50, y: 150 },
			width: 160,
			parentId: 'SwissRound',

			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 12 - vertical_gap,
			draggable: false
		},
		...teams.map((team: Team, idx: number) => {
			return {
				id: 'FirstRound' + idx,
				type: 'team',
				data: { label: team.name },
				position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
				parentId: 'FirstRound',
				width: 150,
				height: team_height,
				draggable: false
			};
		}),
		{
			id: 'SecondRoundV',
			type: 'group2',
			data: {
				label: '1 🏆 0 💀',
				connection_left: true,
				connection_right: true,
				background: 'bg-white'
			},
			position: { x: 300, y: 125 },
			width: 160,
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 6 - vertical_gap,
			parentId: 'SwissRound',
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter((match: Match) => is_winner(match, team) && match.phase == 'swiss1')
						.length == 1
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'SecondRoundV' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'SecondRoundV',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'SecondRoundD',
			type: 'group2',
			data: {
				label: '0 🏆 1 💀',
				connection_left: true,
				connection_right: true,
				background: 'bg-white'
			},
			position: { x: 300, y: 325 },
			width: 160,
			parentId: 'SwissRound',
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 6 - vertical_gap,
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter((match: Match) => is_loser(match, team) && match.phase == 'swiss1')
						.length == 1
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'SecondRoundD' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'SecondRoundD',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'ThirdRoundVV',
			type: 'group2',
			data: {
				label: '2 🏆 0 💀',
				connection_left: true,
				connection_right: true,
				background: 'bg-yellow-100'
			},
			position: { x: 550, y: 70 },
			parentId: 'SwissRound',
			width: 160,
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 3 - vertical_gap,
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) => is_winner(match, team) && ['swiss1', 'swiss2'].includes(match.phase)
					).length == 2
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'ThirdRoundVV' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'ThirdRoundVV',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'ThirdRoundVD',
			type: 'group2',
			data: {
				label: '1 🏆 1 💀',
				connection_left: true,
				connection_right: true,
				background: 'bg-white'
			},
			position: { x: 550, y: 225 },
			parentId: 'SwissRound',
			width: 160,
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 6 - vertical_gap,
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) => is_winner(match, team) && ['swiss1', 'swiss2'].includes(match.phase)
					).length == 1 &&
					matches.filter(
						(match: Match) => is_loser(match, team) && ['swiss1', 'swiss2'].includes(match.phase)
					).length == 1
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'ThirdRoundVD' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'ThirdRoundVD',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'ThirdRoundDD',
			type: 'group2',
			data: {
				label: '0 🏆 2 💀',
				connection_left: true,
				connection_right: true,
				background: 'bg-blue-100'
			},
			position: { x: 550, y: 450 },
			parentId: 'SwissRound',
			width: 160,
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 3 - vertical_gap,
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) => is_loser(match, team) && ['swiss1', 'swiss2'].includes(match.phase)
					).length == 2
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'ThirdRoundDD' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'ThirdRoundDD',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'FourthRoundVVD',
			type: 'group2',
			data: {
				label: '2 🏆 1 💀',
				connection_left: true,
				connection_right: true,
				background: 'bg-yellow-100'
			},
			position: { x: 800, y: 200 },
			parentId: 'SwissRound',
			width: 160,
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 3 - vertical_gap,
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) =>
							is_winner(match, team) && ['swiss1', 'swiss2', 'swiss3'].includes(match.phase)
					).length == 2 &&
					matches.filter(
						(match: Match) =>
							is_loser(match, team) && ['swiss1', 'swiss2', 'swiss3'].includes(match.phase)
					).length == 1
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'FourthRoundVVD' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'FourthRoundVVD',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'FourthRoundVDD',
			type: 'group2',
			data: {
				label: '1 🏆 2 💀',
				connection_left: true,
				connection_right: true,
				background: 'bg-blue-100'
			},
			position: { x: 800, y: 320 },
			parentId: 'SwissRound',
			width: 160,
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 3 - vertical_gap,
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) =>
							is_winner(match, team) && ['swiss1', 'swiss2', 'swiss3'].includes(match.phase)
					).length == 1 &&
					matches.filter(
						(match: Match) =>
							is_loser(match, team) && ['swiss1', 'swiss2', 'swiss3'].includes(match.phase)
					).length == 2
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'FourthRoundVDD' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'FourthRoundVDD',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'Poule',
			type: 'group2',
			data: { label: 'Classement', connection_left: false, connection_right: false },
			position: { x: 1100, y: 0 },
			width: 400,
			height: 600,
			draggable: false
		},
		{
			id: 'BracketRoundRules',
			type: 'rule',
			data: { label: "8 min ⏱️, 1 point d'écart", connection_left: false, connection_right: false },
			position: { x: 1180, y: 10 },
			width: 300,
			height: 600,
			draggable: false
		},
		{
			id: 'PouleV',
			type: 'group2',
			data: {
				label: 'Poule 1-6',
				connection_left: true,
				connection_right: true,
				background: 'bg-yellow-100'
			},
			position: { x: 50, y: 70 },
			width: 300,
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 6 - vertical_gap,
			parentId: 'Poule',
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) =>
							is_winner(match, team) && ['swiss1', 'swiss2', 'swiss3'].includes(match.phase)
					).length == 2
			)
			.map((team: Team) => {
				return {
					label: team.name,
					wins: wins_in_bracket(matches, team),
					loses: loses_in_bracket(matches, team),
					points: points_in_bracket(matches, team)
				};
			})
			.toSorted(
				(teamA, teamB) => teamB.wins * 10000 + teamB.points - (teamA.wins * 10000 + teamA.points)
			)
			.map((data, idx: number) => {
				return {
					id: 'PouleV' + idx,
					type: 'teambracket',
					data: data,
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'PouleV',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'PouleD',
			type: 'group2',
			data: {
				label: 'Poule 7-12',
				connection_left: true,
				connection_right: true,
				background: 'bg-blue-100'
			},
			position: { x: 50, y: 325 },
			width: 300,
			parentId: 'Poule',
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 6 - vertical_gap,
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) =>
							is_loser(match, team) && ['swiss1', 'swiss2', 'swiss3'].includes(match.phase)
					).length == 2
			)
			.map((team: Team) => {
				return {
					label: team.name,
					wins: wins_in_bracket(matches, team),
					loses: loses_in_bracket(matches, team),
					points: points_in_bracket(matches, team)
				};
			})
			.toSorted(
				(teamA, teamB) => teamB.wins * 10000 + teamB.points - (teamA.wins * 10000 + teamA.points)
			)
			.map((data, idx: number) => {
				return {
					id: 'PouleD' + idx,
					type: 'teambracket',
					data: data,
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'PouleD',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'Finale',
			type: 'group2',
			data: { label: 'Finales', connection_left: false, connection_right: false },
			position: { x: 1600, y: 0 },
			width: 250,
			height: 600,
			draggable: false
		},
		{
			id: 'FinaleRoundRules',
			type: 'rule',
			data: {
				label: '15 points',
				connection_left: false,
				connection_right: false
			},
			position: { x: 1530, y: 10 },
			width: 300,
			height: 600,
			draggable: false
		},

		{
			id: 'FinaleRoundRules2',
			type: 'rule',
			data: {
				label: "2 points d'écart",
				connection_left: false,
				connection_right: false
			},
			position: { x: 1530, y: 30 },
			width: 300,
			height: 600,
			draggable: false
		},
		{
			id: 'FinaleV',
			type: 'group2',
			data: {
				label: 'Grande finale',
				connection_left: true,
				connection_right: false,
				background: 'bg-yellow-100'
			},
			position: { x: 50, y: 70 },
			width: 150,
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 2 - vertical_gap,
			parentId: 'Finale',
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) =>
							is_winner(match, team) && ['swiss1', 'swiss2', 'swiss3'].includes(match.phase)
					).length == 2
			)
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) =>
							['finale'].includes(match.phase) && [match.teamA, match.teamB].includes(team.name)
					).length == 1
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'FinaleV' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'FinaleV',
					width: 150,
					height: 20,
					draggable: false
				};
			}),
		{
			id: 'FinaleD',
			type: 'group2',
			data: {
				label: 'Finale consolante',
				connection_left: true,
				connection_right: false,
				background: 'bg-blue-100'
			},
			position: { x: 50, y: 325 },
			width: 150,
			parentId: 'Finale',
			height:
				top_margin_group + bottom_margin_group + (team_height + vertical_gap) * 2 - vertical_gap,
			draggable: false
		},
		...teams
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) =>
							is_loser(match, team) && ['swiss1', 'swiss2', 'swiss3'].includes(match.phase)
					).length == 2
			)
			.filter(
				(team: Team) =>
					matches.filter(
						(match: Match) =>
							['finale'].includes(match.phase) && [match.teamA, match.teamB].includes(team.name)
					).length == 1
			)
			.map((team: Team, idx: number) => {
				return {
					id: 'FinaleD' + idx,
					type: 'team',
					data: { label: team.name },
					position: { x: 8, y: top_margin_group + (team_height + vertical_gap) * idx },
					parentId: 'FinaleD',
					width: 150,
					height: 20,
					draggable: false
				};
			})
	]);

	const nodeTypes = {
		team: TeamNode,
		group2: GroupNode,
		teambracket: TeamBracketNode,
		rule: RuleNode
	};
	let edges = $state.raw<Edge[]>([
		{
			id: 'e1-2V',
			source: 'FirstRound',
			target: 'SecondRoundV',
			label: '🏆',
			animated: matches.length <= 6,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e1-2D',
			source: 'FirstRound',
			target: 'SecondRoundD',
			label: '💀',
			animated: matches.length <= 6,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e2V-3VV',
			source: 'SecondRoundV',
			target: 'ThirdRoundVV',
			label: '🏆',
			animated: matches.length <= 12,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e2D-3VD',
			source: 'SecondRoundD',
			target: 'ThirdRoundVD',
			label: '🏆',
			animated: matches.length <= 12,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e2V-3VD',
			source: 'SecondRoundV',
			target: 'ThirdRoundVD',
			label: '💀',
			animated: matches.length <= 12,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e2D-3DD',
			source: 'SecondRoundD',
			target: 'ThirdRoundDD',
			label: '💀',
			animated: matches.length <= 12,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e3VD-4VVD',
			source: 'ThirdRoundVD',
			target: 'FourthRoundVVD',
			label: '🏆',
			animated: matches.length <= 15,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e3VD-4VDD',
			source: 'ThirdRoundVD',
			target: 'FourthRoundVDD',
			label: '💀',
			animated: matches.length <= 15,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e3VV-PouleV',
			source: 'ThirdRoundVV',
			target: 'PouleV',
			label: '',
			animated: matches.length <= 45,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e4VVD-PouleV',
			source: 'FourthRoundVVD',
			target: 'PouleV',
			label: '',
			animated: matches.length <= 45,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e4VDD-PouleD',
			source: 'FourthRoundVDD',
			target: 'PouleD',
			label: '',
			animated: matches.length <= 45,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'e3DD-PouleD',
			source: 'ThirdRoundDD',
			target: 'PouleD',
			label: '',
			animated: matches.length <= 45,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},

		{
			id: 'PouleV-FinaleV',
			source: 'PouleV',
			target: 'FinaleV',
			label: '1er et 2ème',
			animated: true,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},

		{
			id: 'PouleD-FinaleD',
			source: 'PouleD',
			target: 'FinaleD',
			label: '1er et 2ème',
			animated: true,
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		}
	]);
</script>

<div style:width="100vw" style:height="100vh">
	<SvelteFlow bind:nodes bind:edges fitView {nodeTypes}>
		<Background />
	</SvelteFlow>
</div>
