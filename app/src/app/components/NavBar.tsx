"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { ThemeChanger } from "../ThemeChanger";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <Navbar shouldHideOnScroll isBordered isBlurred>
      <NavbarBrand>
        <Link
          href='/'
          as={NextLink}
          className='flex gap-2 items-center'
          color='foreground'
        >
          <p className='text-2xl'>🎨</p>
          <p className='text-xl font-bold'>瓷盘图像修复平台</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify='end'>
        <NavbarItem>
          {/* <Link href='/result' as={NextLink} isBlock>
            我的文件
          </Link> */}
        </NavbarItem>
        <NavbarItem>
          <ThemeChanger />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
