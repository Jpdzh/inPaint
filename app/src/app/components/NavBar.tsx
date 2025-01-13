'use client';

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import NextLink from 'next/link';
import { ThemeChanger } from '../ThemeChanger';

export default function NavBar() {
  return (
    <Navbar
      isBordered
      isBlurred
      className="bg-[url('/assets/navbar.png')] bg-[#1f4a81] bg-cover bg-center"
      height='6rem'
    >
      <NavbarBrand>
        <Link
          href='/'
          as={NextLink}
          className='flex items-start flex-col dark'
          color='foreground'
        >
          <p className='text-4xl font-extrabold font-serif'>
            Blue and White Porcelain Plate
          </p>
          <p className='text-2xl font-extrabold font-serif'>
            　　Image Restoration Visualization System
          </p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify='end'>
        <NavbarItem>
          <ThemeChanger />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
