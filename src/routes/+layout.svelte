<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={'tournoix.png'} />
</svelte:head>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 60); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" />

	<Sidebar.Inset>
		<SiteHeader />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<div class="flex flex-col gap-4 overflow-hidden py-4 md:gap-6 md:py-6">
					{@render children()}
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
