import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { IoFastFood } from "react-icons/io5";
import { Link } from "react-router";

const SidebarAdmin = () => {
  return (
    <Sidebar 
      aria-label="Default sidebar example"
      className="fixed top-0 left-0 h-screen bg-black dark:bg-white text-gray-900 border-r overflow-y-auto"
      >

      <SidebarItems>
        <div className='flex flex-row items-center gap-2'>
          <img src="./img/logo.png" alt="LOGO" />
          <h1 className='text-4xl text-white font-milonga'>RungJa</h1>
        </div>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
         <Link to="/menu">
           <SidebarItem href="#" icon={IoFastFood}>
            Menu
          </SidebarItem>
         </Link>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}

export default SidebarAdmin