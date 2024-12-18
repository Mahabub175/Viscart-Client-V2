"use client";

import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Drawer, Popover } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import LandingTopHeader from "./LandingTopHeader";
import { GiCancel } from "react-icons/gi";
import { FaSquareXTwitter } from "react-icons/fa6";
import CategoryNavigation from "./CategoryNavigation";
import BottomNavigation from "./BottomNavigation";
import Image from "next/image";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const LandingHeader = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const { data } = useGetSingleUserQuery(user?._id);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  const links = {
    Dashboard: `/${data?.role}/dashboard`,
    Order: `/${data?.role}/orders/order`,
    Profile: `/${data?.role}/account-setting`,
    Wishlist: `/${data?.role}/orders/wishlist`,
    Cart: `/${data?.role}/orders/cart`,
  };

  const content = (
    <div>
      <div className="rounded-md px-16 py-3">
        <div className="flex flex-col items-start gap-4 text-md">
          {["Dashboard", "Order", "Profile", "Wishlist", "Cart"].map(
            (item, index) => (
              <Link
                key={index}
                href={links[item]}
                className={`gap-2 font-bold duration-300 ${
                  pathname === links[item]
                    ? "text-primary hover:text-primary"
                    : "text-black hover:text-primary"
                }`}
              >
                {item}
              </Link>
            )
          )}
        </div>
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button
          onClick={handleLogout}
          className={`w-full font-bold`}
          size="large"
          type="primary"
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const top = (
    <div className="bg-grey">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-5 py-2">
        <Link href={"/"}>Hotline: {globalData?.results?.businessWhatsapp}</Link>
        <div className="flex items-center gap-4">
          <Link href={"/contact"}>Contact Us</Link>
          <div>|</div>
          <div className="flex items-center gap-4">
            <Link
              href={globalData?.results?.businessFacebook ?? "/"}
              target="_blank"
            >
              <FaFacebook className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessLinkedin ?? "/"}
              target="_blank"
            >
              <FaLinkedin className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessInstagram ?? "/"}
              target="_blank"
            >
              <FaInstagram className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
            <Link
              href={globalData?.results?.businessTwitter ?? "/"}
              target="_blank"
            >
              <FaSquareXTwitter className="text-2xl rounded-full text-primary hover:scale-110 duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="mb-5 relative">
      {isMobile ? (
        <>
          {top}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                type="primary"
                icon={<MenuOutlined />}
                onClick={showDrawer}
                style={{ margin: 16 }}
              />
            </div>
            <Link href={"/"}>
              <Image
                src={globalData?.results?.logo}
                alt="logo"
                width={80}
                height={50}
              />
            </Link>
            <div className="md:flex items-center gap-4 ">
              {user?._id ? (
                <>
                  {" "}
                  <div className="flex items-center gap-2">
                    <Popover
                      placement="bottomRight"
                      content={content}
                      className="cursor-pointer flex items-center gap-1"
                    >
                      {data?.profile_image ? (
                        <Image
                          src={data?.profile_image}
                          alt="profile"
                          height={40}
                          width={40}
                          className="rounded-full w-[40px] h-[40px] border-2 border-primary"
                        />
                      ) : (
                        <Avatar
                          className=""
                          size={40}
                          icon={<UserOutlined />}
                        />
                      )}
                      <h2 className="font-semibold">{data?.name ?? "User"}</h2>
                      <IoMdArrowDropdown />
                    </Popover>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href={"/sign-in"}
                    className="flex items-center gap-2 text-primary"
                  >
                    <Button type="primary" className="font-bold mr-2">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <Drawer
              title="Menu"
              placement="left"
              onClose={onClose}
              open={drawerVisible}
            >
              <div className="flex items-center justify-between gap-4 mb-10">
                <Link href={"/"}>
                  <Image
                    src={globalData?.results?.logo}
                    alt="logo"
                    width={50}
                    height={50}
                  />
                </Link>
                <button
                  className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
                  onClick={onClose}
                >
                  <GiCancel className="text-xl text-gray-700" />
                </button>
              </div>
              <CategoryNavigation onClose={onClose} />
            </Drawer>
            <BottomNavigation />
          </div>
        </>
      ) : (
        <div className="!sticky top-0 z-50 bg-white">
          {top}
          <LandingTopHeader />
          <CategoryNavigation />
        </div>
      )}
    </nav>
  );
};

export default LandingHeader;
