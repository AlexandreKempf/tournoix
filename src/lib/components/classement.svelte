<script lang="ts">
	import type { Team } from './schemas.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { data }: { data: Team[] } = $props();
	let classement_names = {
		A1: '🥇 1<sup>er</sup> A',
		A2: '🥈 2<sup>ème</sup> A',
		A3: '🥉 3<sup>ème</sup> A',
		A4: '4<sup>ème</sup> A',
		A5: '5<sup>ème</sup> A',
		A6: '6<sup>ème</sup> A',
		B1: '🥇 1<sup>er</sup> B',
		B2: '🥈 2<sup>ème</sup> B',
		B3: '🥉 3<sup>ème</sup> B',
		B4: '4<sup>ème</sup> B',
		B5: '5<sup>ème</sup> B',
		B6: '6<sup>ème</sup> B'
	};
</script>

<div class="mt-20 flex w-80 flex-col items-center gap-20">
	<div>
		<Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.A1}</Badge
		> vs <Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.B3}</Badge
		>
	</div>
	<div>
		<Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.A2}</Badge
		> vs <Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.B2}</Badge
		>
	</div>
	<div>
		<Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.A3}</Badge
		> vs <Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.B1}</Badge
		>
	</div>
	<div>
		<Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.A4}</Badge
		> vs <Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.B6}</Badge
		>
	</div>
	<div>
		<Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.A5}</Badge
		> vs <Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.B5}</Badge
		>
	</div>
	<div>
		<Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.A6}</Badge
		> vs <Badge variant="outline" class="text-md px-1.5 text-muted-foreground"
			>{@html classement_names.B4}</Badge
		>
	</div>
</div>
