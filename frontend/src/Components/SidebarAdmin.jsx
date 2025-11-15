import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { HiChartPie, HiShoppingBag } from "react-icons/hi";
import { IoFastFood } from "react-icons/io5";
import { Link } from "react-router";

const SidebarAdmin = () => {
  return (
    <Sidebar
      aria-label="Default sidebar example"
      className="fixed left-0 top-0 h-screen overflow-y-auto border-r bg-white text-gray-900"
    >
      <SidebarItems>
        <div className="flex items-center gap-2 px-4 py-6">
          <img src="./img/logo.png" alt="LOGO" className="w-12" />
          <h1 className="font-milonga text-3xl text-gray-900">RungJa</h1>
        </div>

        <SidebarItemGroup>
          <Link to="/admin">
            <SidebarItem icon={HiChartPie}>Dashboard</SidebarItem>
          </Link>

          <Link to="/store">
            <SidebarItem icon={IoFastFood}>Storefront</SidebarItem>
          </Link>

          <Link to="/orders">
            <SidebarItem icon={HiShoppingBag}>Order History</SidebarItem>
          </Link>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default SidebarAdmin;
