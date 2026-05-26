<script lang="ts">
	import IconTournament from '@tabler/icons-svelte/icons/tournament';
	import IconAvocado from '@tabler/icons-svelte/icons/avocado';
	import ListDetailsIcon from '@tabler/icons-svelte/icons/list-details';
	import BookIcon from '@tabler/icons-svelte/icons/book-2';
	import NavMain from './nav-main.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import HelpIcon from '@tabler/icons-svelte/icons/help';

	const data = {
		navMain: [
			{
				title: 'Organisation',
				url: '/organisation',
				icon: IconTournament
			},
			{
				title: 'Matchs',
				url: '/matches',
				icon: ListDetailsIcon
			},
			{
				title: 'Règles',
				url: '/rules',
				icon: BookIcon
			},
			{
				title: 'Aide',
				url: '/tutorial',
				icon: HelpIcon
			}
		]
	};

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<IconAvocado class="!size-5" />
							<span class="text-base font-semibold">Tournoix</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
</Sidebar.Root>
