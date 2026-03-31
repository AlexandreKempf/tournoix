import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActionsScore from "$lib/components/row-actions-score.svelte";
import type { Match } from "$lib/components/schemas";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";
import {myTeam} from '../store.svelte';

export const columns: ColumnDef<Match>[] = [
  {
    accessorKey: "teams",
    header: "Match",
    cell: ({ row }) => {
      const matchCellSnippet = createRawSnippet<[{}]>(
        () => {
          let isMyTeamA = myTeam.name===row.original.teamA ? 'text-green-500 border-green-500': "border-0"
          let isMyTeamB = myTeam.name===row.original.teamB ? 'text-green-500 border-green-500': "border-0"
          let teamA = row.original.teamA.length > 21 ? row.original.teamA.slice(0, 21) + '...' : row.original.teamA
          let teamB = row.original.teamB.length > 21 ? row.original.teamB.slice(0, 21) + '...' : row.original.teamB

          const scoreA = row.original.scoreA
          const scoreB = row.original.scoreB

          const span = (color:string, bold:string) => `<span class="${color} ${bold} focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 py-0.5 text-xs transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 text-small">`

          if (scoreA !==0 || scoreB!==0) {
            let winner = scoreA > scoreB ?  `${span(isMyTeamA, 'font-medium')}${teamA}` : `${span(isMyTeamB, 'font-medium')}${teamB}`
            let loser = scoreB > scoreA ?  `${span(isMyTeamA)}${teamA}` : `${span(isMyTeamB)}${teamB}`
            let winScore = scoreA > scoreB? scoreA : scoreB
            let loseScore = scoreB > scoreA? scoreA : scoreB
            return {
              render: () =>
                `<div class="flex flex-col gap-1"><p><span class="mx-2 font-medium">${winScore}</span> 🏆${winner}</p><p><span class="mx-2 font-normal">${loseScore}</span> 💀${loser}</p></div>`,
            };
          } else {
            teamA = `${span(isMyTeamA)}${teamA}</span>`
            teamB = `${span(isMyTeamB)}${teamB}</span>`
            return {
              render: () => `<div class="flex flex-col gap-1 ml-4"><p>${teamA}</p><p>${teamB}</p></div>`
            };
          }
        }
      );
 
      return renderSnippet(matchCellSnippet, {});
  }},
  // {
  //   accessorKey: "referee",
  //   header: "Arbitre",

  //   cell: ({ row }) => {
  //     return renderComponent(DataTableActionsScore, { row: row.original });
  //   },
  //   cell: ({ row }) => {
  //     const RefereeCellSnippet = createRawSnippet<[{}]>(
  //       () => {
          
  //         }
  //     );
 
  //     return renderSnippet(RefereeCellSnippet, {});
  // }},
  {
    header: "Arbitre",
    cell: ({ row }) => {
      return renderComponent(DataTableActionsScore, { row: row.original });
    },
  },
];