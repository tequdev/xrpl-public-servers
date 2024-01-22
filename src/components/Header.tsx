'use client'
import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname()
  
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit text-2xl text-center">XRPL Public Servers</p>
      </NavbarBrand>
      {/* <NavbarContent>
        <NavbarItem>
          <Link color={pathname==='/'?'primary': 'foreground'} href="/">
            Specific
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color={pathname==='/list'?'primary': 'foreground'} href="/list" >
            All
          </Link>
        </NavbarItem>
      </NavbarContent> */}
    </Navbar>
  )
}
