"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "components/ui/button";

type SidebarItemProps = {
    label: string;
    iconSrc: string;
    href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: SidebarItemProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Button variant={isActive ? "sidebarOutline" : "sidebar"} className="justify-start h-[52px]" asChild>
            <Link
                href={href}
                className={`flex items-center p-2 rounded-md transition-colors duration-200 
                ${isActive ? 'bg-blue-50 bg-opacity-50' : 'hover:bg-gray-100'}`}
            >
                <Image
                    src={iconSrc}
                    alt={label}
                    className="mr-5"
                    height={32}
                    width={32}
                />
                {label}
            </Link>
        </Button>
    );
};
