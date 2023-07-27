"use client"

import { cn } from "@/lib"
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/Button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/Command"
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/Dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover"
import { usePathname, useRouter } from "next/navigation"
import CreateStore from "./CreateStore"


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    stores: Record<string, any>[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({
    className,
    stores = [],
}) => {

    const [open, setOpen] = React.useState(false)
    const [showStoreDialog, setShowStoreDialog] = React.useState(false);

    const pathname = usePathname();

    const storeId = pathname.split('/')[1];

    const router = useRouter();

    const formattedStore = stores.map((store) => ({
        label: store.name,
        value: store.id,
    }));

    const currentStore = formattedStore.find((store) => store.value === storeId);

    const handleStoreChange = (store: { value: string, label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    };

    return (
        <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        size="button"
                        aria-expanded={open}
                        aria-label="Select a store"
                        className={cn("w-[200px] flex items-center justify-between text-sm !py-1.5 px-3", className)}
                    >
                        <Store className="mr-2 h-4 w-4" />
                        {currentStore?.label}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search store..." />
                            <CommandEmpty>No store found.</CommandEmpty>
                            <CommandGroup heading="Stores">
                                {formattedStore?.map((store) => (
                                    <CommandItem
                                        key={store.value}
                                        onSelect={() => handleStoreChange(store)}
                                        className="text-sm"
                                    >
                                        <Store className="mr-2 h-4 w-4" />
                                        {store.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                currentStore?.value === store.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <DialogTrigger asChild>
                                    <CommandItem
                                        onSelect={() => {
                                            setOpen(false)
                                            setShowStoreDialog(true)
                                        }}
                                    >
                                        <PlusCircle strokeWidth={1.8} className="mr-2 h-5 w-5" />
                                        Create Store
                                    </CommandItem>
                                </DialogTrigger>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <DialogContent className="max-w-md">
                <CreateStore open={showStoreDialog} setOpen={setShowStoreDialog} storeId={currentStore?.value} />
            </DialogContent>
        </Dialog>
    )
}

export default StoreSwitcher
