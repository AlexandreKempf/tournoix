import type { ColumnDef } from "@tanstack/table-core";
import type { Team } from "$lib/components/schemas";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: "Nom de l'équipe",
      cell: ({ row }) => {
        const TeamCellSnippet = createRawSnippet<[{}]>(
          () => {
            let name = row.original.name
            const span_neutral = `<span class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 text-small">`

              return {
                render: () =>
                  `<span class="font-bold">${span_neutral}${name}</span></span>`,
              };
            }
        );
    
        return renderSnippet(TeamCellSnippet, {});
    },
  },
  {
    accessorKey: "city",
    header: "Ville",
  },
];