<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Match } from './schemas';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import { pb } from '../../routes/pocketbase.ts';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { myTeam } from '../../routes/store.svelte';

	let { row }: { row: Match } = $props();

	let scoreA = $state(row.scoreA);
	let scoreB = $state(row.scoreB);
	let isOTP = $state(false);
	let isOTP_good = $state(false);
	let isOTP_bad = $state(false);
	let otp = $state('');
	let referee = row.referee.length > 21 ? row.referee.slice(0, 21) + '...' : row.referee;
	let color = myTeam.name === row.referee ? 'text-green-500 font-bold' : '';
	let buttoncolor = myTeam.name === row.referee ? 'bg-green-500 font-bold' : '';
</script>

<div class="flex w-36 flex-col items-center">
	<p class="text-xs {color}">{referee}</p>
	{#if row.scoreA == 0 && row.scoreB == 0}
		<Drawer.Root>
			<Drawer.Trigger>
				{#snippet child({ props })}
					<Button {...props} class="h-6 text-xs {buttoncolor} hover:{buttoncolor}"
						>Mettre le score</Button
					>
				{/snippet}
			</Drawer.Trigger>
			<Drawer.Content>
				{#if isOTP}
					<Drawer.Header class="text-center">
						<Drawer.Title>Rentrer mon code d'arbitre</Drawer.Title>
					</Drawer.Header>
					<div class="mx-auto">
						<InputOTP.Root bind:value={otp} maxlength={4} pattern={REGEXP_ONLY_DIGITS}>
							{#snippet children({ cells })}
								<InputOTP.Group>
									{#each cells as cell (cell)}
										<InputOTP.Slot {cell} />
									{/each}
								</InputOTP.Group>
							{/snippet}
						</InputOTP.Root>
					</div>
					<Drawer.Footer class="mx-auto max-w-120">
						<Drawer.Close>
							<Button
								onclick={async () => {
									const referee = await pb.collection('teams').getFullList({
										filter: `name = "${row.referee}" && (code = "${otp}" || admincode = "${otp}" )`
									});

									if (referee.length !== 0) {
										await pb.collection('matches').update(row.id, { scoreA, scoreB });
										isOTP_good = true;
										setTimeout(() => {
											isOTP_good = false;
										}, 3000);
									} else {
										isOTP_bad = true;
										setTimeout(() => {
											isOTP_bad = false;
										}, 3000);
									}

									isOTP = false;
									otp = '';
								}}
							>
								Sauvegarder le score
							</Button>
						</Drawer.Close>

						<Drawer.Close
							onclick={() => {
								isOTP = false;
								otp = '';
							}}
						>
							Annuler
						</Drawer.Close>
					</Drawer.Footer>
				{:else}
					<Drawer.Header class="text-center">
						<Drawer.Title>Quel est le score du match ?</Drawer.Title>
					</Drawer.Header>
					<div class="mx-1 flex w-full flex-col items-center gap-6 sm:mx-8">
						<div class="flex w-[95%] max-w-100 items-center justify-between gap-4">
							<p class="max-w-48">
								{row.teamA.length > 20 ? row.teamA.slice(0, 20) + '...' : row.teamA}
							</p>
							<ButtonGroup.Root>
								<Button
									onclick={() => {
										scoreA = Math.max(scoreA - 1, 0);
									}}
								>
									-
								</Button>
								<ButtonGroup.Separator />
								<Input
									type="number"
									placeholder={String(scoreA)}
									bind:value={scoreA}
									class="w-20 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								/>
								<ButtonGroup.Separator />
								<Button onclick={() => scoreA++}>+</Button>
							</ButtonGroup.Root>
						</div>
						<div class="flex w-[95%] max-w-100 items-center justify-between gap-4">
							<p class="max-w-48">
								{row.teamB.length > 20 ? row.teamB.slice(0, 20) + '...' : row.teamB}
							</p>
							<ButtonGroup.Root>
								<Button
									onclick={() => {
										scoreB = Math.max(scoreB - 1, 0);
									}}
								>
									-
								</Button>
								<ButtonGroup.Separator />
								<Input
									type="number"
									placeholder={String(scoreB)}
									bind:value={scoreB}
									class="w-20 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								/>
								<ButtonGroup.Separator />
								<Button onclick={() => scoreB++}>+</Button>
							</ButtonGroup.Root>
						</div>
					</div>
					<Drawer.Footer class="mx-auto max-w-120">
						<Button
							onclick={() => {
								isOTP = true;
							}}
						>
							Mettre le score
						</Button>
						<Drawer.Close>Annuler</Drawer.Close>
					</Drawer.Footer>
				{/if}
			</Drawer.Content>
		</Drawer.Root>
	{/if}

	{#if isOTP_good}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<Alert.Root
				class="animate-pop pointer-events-auto flex w-[95%] flex-col items-center rounded-xl bg-white p-10 text-center shadow-2xl sm:max-w-[50%]"
			>
				<div class="mb-4 text-6xl">🎉</div>
				<Alert.Title class="text-xl font-bold sm:text-3xl">Merci pour l'arbitrage !</Alert.Title>
			</Alert.Root>
		</div>
	{/if}

	{#if isOTP_bad}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<Alert.Root
				variant="destructive"
				class="animate-pop pointer-events-auto flex  w-[95%] flex-col items-center rounded-xl bg-white p-10 text-center shadow-2xl sm:max-w-[50%]"
			>
				<div class="mb-4 text-6xl">😢</div>
				<Alert.Title class="text-xl font-bold sm:text-3xl">Code incorrect !</Alert.Title>
				<p class="mt-2 sm:text-lg">Veuillez réessayer.</p>
			</Alert.Root>
		</div>
	{/if}
</div>
