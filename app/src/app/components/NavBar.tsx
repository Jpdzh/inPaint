'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@nextui-org/react';
import { ThemeChanger } from '../ThemeChanger';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <Navbar
      isBordered
      isBlurred
      className="bg-[url('/assets/navbar.png')] bg-[#1f4a81] bg-cover bg-center"
    >
      <NavbarBrand>
        <Link
          href='/'
          as={NextLink}
          className='flex items-start flex-col dark'
          color='foreground'
        >
          <p className='text-2xl font-bold'>青花瓷盘</p>
          <p className='text-xl font-bold'>　　图像修复可视化系统</p>
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
