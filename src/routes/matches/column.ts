import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActionsScore from "$lib/components/row-actions-score.svelte";
import type { Match } from "$lib/components/schemas";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";

export const columns: ColumnDef<Match>[] = [
  {
    accessorKey: "teams",
    header: "Match",
    cell: ({ row }) => {
      const matchCellSnippet = createRawSnippet<[{}]>(
        () => {
          let teamA = row.original.teamA.length > 20 ? row.original.teamA.slice(0, 20) + '...' : row.original.teamA
          let teamB = row.original.teamB.length > 20 ? row.original.teamB.slice(0, 20) + '...' : row.original.teamB

          const scoreA = row.original.scoreA
          const scoreB = row.original.scoreB
          const span_neutral = `<span class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 text-small">`
          const span_win = `<span class="bg-primary text-secondary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 text-small">`
          const span_lose = `<span class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 text-small">`
          
          if (scoreA !==0 || scoreB!==0) {
            teamA = scoreA > scoreB?`${span_win}${teamA}</span>` : `${span_lose}${teamA}</span>` 
            teamB = scoreB > scoreA?`${span_win}${teamB}</span>` : `${span_lose}${teamB}</span>` 
            return {
              render: () =>
                `<div class="font-medium">${teamA} ${scoreA} - ${scoreB} ${teamB}</div>`,
            };
          } else {
            teamA = `${span_neutral}${teamA}</span>`
            teamB = `${span_neutral}${teamB}</span>`
            return {
              render: () =>
                `<div class="font-medium">${teamA} <span class="font-normal text-xs">vs</span> ${teamB}</div>`,
            };
          }
        }
      );
 
      return renderSnippet(matchCellSnippet, {});
  }},
  {
    accessorKey: "referee",
    header: "Arbitre",
    cell: ({ row }) => {
      const RefereeCellSnippet = createRawSnippet<[{}]>(
        () => {
          let referee = row.original.referee.length > 20 ? row.original.referee.slice(0, 20) + '...' : row.original.referee
            return {
              render: () =>
                `<span class="text-xs">${referee}</span>`,
            };
          }
      );
 
      return renderSnippet(RefereeCellSnippet, {});
  }},
  {
    id: "actions",
    cell: ({ row }) => {
      return renderComponent(DataTableActionsScore, { row: row.original });
    },
  },
];