import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn";
import { useNavigate } from "react-router-dom";
import { Container } from "../index";
import { Logo } from "../index";




import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "../../utils/cn"



function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "Profile",
      slug: "/Profile",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];
 const [active, setActive] = useState(authStatus)
  return (
    // <header className="py-3 shadow bg-gray-500">
    //   <Container>
    //     <nav className="flex">
    //       <div className="mr-4">
    //         <Link to="/">
    //           <Logo width="70px" />
    //         </Link>
    //       </div>
    //       <ul className="flex ml-auto">
    //         {navItems.map((item) =>
    //           item.active ? (
    //             <li key={item.name}>
    //               <button
    //                 onClick={() => navigate(item.slug)}
    //                 className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
    //               >
    //                 {item.name}
    //               </button>
    //             </li>
    //           ) : null
    //         )}
    //         {authStatus && (
    //           <li>
    //             <LogoutBtn />
    //           </li>
    //         )}
    //       </ul>
    //     </nav>
    //   </Container>
    // </header>
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50")}>
      <Menu setActive={setActive}>
       

        {navItems.map((item) =>
          item.active ? (
            <Link key={item.name} to={item.slug}>
              <MenuItem
                setActive={setActive}
                active={active}
                item={item.name}
              ></MenuItem>
            </Link>
          ) : // <li key={item.name}>
          //   <button
          //     onClick={() => navigate(item.slug)}
          //     className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
          //   >
          //     {item.name}
          //   </button>
          // </li>
          null
        )}
        <div className="text-white flex items-center absolute right-7 top-4 ">
          {authStatus && <LogoutBtn />}
        </div>
      </Menu>
    </div>
  );
}

export default Header;
