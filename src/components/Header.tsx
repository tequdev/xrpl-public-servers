import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";

export default function Header() {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit text-2xl text-center">XRPL Public Servers</p>
      </NavbarBrand>
      <NavbarContent></NavbarContent>
    </Navbar>
  )
}
