<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import IconTournament from '@tabler/icons-svelte/icons/tournament';
	import ListDetailsIcon from '@tabler/icons-svelte/icons/list-details';
	import BookIcon from '@tabler/icons-svelte/icons/book-2';
	import HelpIcon from '@tabler/icons-svelte/icons/help';
</script>

<div class="mx-2 flex flex-col items-center sm:mx-4 lg:mx-40">
	<h1 class="mb-4 text-center text-xl font-bold">Bienvenue au tournoi de Drefféac</h1>

	<p class="mb-4 text-center">
		Heureux de te voir parmi nous ! Suis tes matchs, consulte le classement en temps réel
		et profite de la fête.
	</p>

	<p class="mb-4 text-center">Sélectionne une des options suivantes:</p>
	<div class="mb-4 flex w-full flex-wrap justify-center gap-4">
		<Button href="/matches" variant="outline" size="lg" class="h-20 w-[90%] max-w-140"
			><div class="flex items-center gap-2 text-xl font-bold">
				<ListDetailsIcon />
				<p>Prochains matchs</p>
			</div>
		</Button>
		<Button href="/organisation" variant="outline" size="lg" class="h-20 w-[90%] max-w-140"
			><div class="flex items-center gap-2 text-xl font-bold">
				<IconTournament />
				<p>Classement en temps réel</p>
			</div>
		</Button>
	</div>
	<div class="mb-4 flex w-full flex-wrap justify-center gap-1">
		<Button href="/rules" variant="outline" size="lg" class="h-10 w-[90%] max-w-140"
			><div class="flex items-center gap-2">
				<BookIcon />
				<p>Lire les règles</p>
			</div>
		</Button>
		<Button href="/tutorial" variant="outline" size="lg" class="h-10 w-[90%] max-w-140"
			><div class="flex items-center gap-2">
				<HelpIcon />
				<p>Tutoriel du site</p>
			</div>
		</Button>
	</div>
</div>
