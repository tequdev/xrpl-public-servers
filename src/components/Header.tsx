import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";

export default function Header() {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit text-2xl text-center">XRPL Public Servers</p>
      </NavbarBrand>
      <NavbarContent>
        <NavbarItem>
          <Link color="foreground" href="/">
            Specific
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/list" >
            All
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
