"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropDownMenu";
import { User as UserProps } from "@prisma/client";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import { toast } from "./hooks/use-toast";


interface UserNavProps {
    user: UserProps | null;
}


const UserNav: FC<UserNavProps> = ({ user }) => {

    const { name, image, email, username } = user ?? {};

    const pathname = usePathname();

    const storeId = pathname.split('/')[2];

    const router = useRouter();

    const handleSettingsClick = () => {
        // const { pathname } = router;
        const userId = pathname.split('/')[1]; // Extract the user ID from the pathname

        router.push(`/${userId}/user/settings`);
    };

    const handleSignOut = async () => {
        await signOut()
            .then(() => {
                toast({
                    description: 'You are signed out!',
                })
                router.refresh();
                router.push("/signin");
            })
            .catch(() => {
                toast({
                    title: 'There was a problem',
                    description: 'Could not sign out, please try again later.',
                    variant: 'destructive'
                });
            })
            .finally(() => {
                router.push("/signin");
            })
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={image!} alt={name!} />
                        <AvatarFallback>
                            {name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                            {name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {username ? `@${username}` : email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsClick()}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default UserNav;