"use client";

import { ColumnDef } from "@tanstack/react-table"
import ColorCell from "./ColorCell";


export type ColorColumn = {
    id: string
    name: string;
    value: string;
    createdAt: string;
}

export const columns: ColumnDef<ColorColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                {row.original.value}
                <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: row.original.value }} />
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <ColorCell color={row.original} />
    }
];