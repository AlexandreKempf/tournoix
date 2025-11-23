<script lang="ts">
	import CameraIcon from '@tabler/icons-svelte/icons/camera';
	import IconUsers from '@tabler/icons-svelte/icons/users';
	import FileAiIcon from '@tabler/icons-svelte/icons/file-ai';
	import FileDescriptionIcon from '@tabler/icons-svelte/icons/file-description';
	import IconTournament from '@tabler/icons-svelte/icons/tournament';
	import IconAvocado from '@tabler/icons-svelte/icons/avocado';
	import ListDetailsIcon from '@tabler/icons-svelte/icons/list-details';
	import NavMain from './nav-main.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	const data = {
		navMain: [
			{
				title: 'Équipes',
				url: '/teams',
				icon: IconUsers
			},
			{
				title: 'Organisation',
				url: '/organisation',
				icon: IconTournament
			},
			{
				title: 'Matchs',
				url: '/matches',
				icon: ListDetailsIcon
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
