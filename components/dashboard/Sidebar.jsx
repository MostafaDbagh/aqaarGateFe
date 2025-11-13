"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import FavoritesCount from "@/components/common/FavoritesCount";
import ReviewsCount from "@/components/common/ReviewsCount";
import MessagesCount from "@/components/common/MessagesCount";
import PropertiesCount from "@/components/common/PropertiesCount";
import { useAuthState } from "@/store/hooks/useAuth";
import { authAPI } from "@/apis/auth";
import { DashboardGridIcon, DocumentIcon, PackageBoxIcon, EditIcon, LogoutArrowIcon } from "@/components/icons";

export default function Sidebar() {
  const pathname = usePathname();
  const { isAgent, logout: logoutUser } = useAuthState();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await authAPI.signout();
      logoutUser(); // This will handle the redirect to home page
    } catch (error) {
      // Still logout and redirect even if API call fails
      logoutUser(); // This will handle the redirect to home page
    }
  };
  return (
    <div className="wrap-sidebar">
      <div className="sidebar-menu-dashboard">
        <div className="menu-box">
          <ul className="box-menu-dashboard">
            {/* Dashboard - Only for agents */}
            {isAgent && (
              <li
                className={`nav-menu-item ${
                  pathname == "/dashboard" ? "active" : ""
                } `}
              >
                <Link className="nav-menu-link" href={`/dashboard`}>
                  <DashboardGridIcon />
                  Dashboards
                </Link>
              </li>
            )}
            <li
              className={`nav-menu-item ${
                pathname == "/my-profile" ? "active" : ""
              } `}
            >
              <Link className="nav-menu-link" href={`/my-profile`}>
                <DocumentIcon />
                Profile
              </Link>
            </li>
            {/* My package - Only for agents */}
            {isAgent && (
              <li
                className={`nav-menu-item ${
                  pathname == "/my-package" ? "active" : ""
                } `}
              >
                <Link className="nav-menu-link" href={`/my-package`}>
                  <PackageBoxIcon />
                  My package
                </Link>
              </li>
            )}
            <li
              className={`nav-menu-item ${
                pathname == "/my-favorites" ? "active" : ""
              } `}
            >
              <Link className="nav-menu-link" href={`/my-favorites`}>
                <FavoritesCount />
              </Link>
            </li>
       
            <li
              className={`nav-menu-item ${
                pathname == "/review" ? "active" : ""
              } `}
            >
              <Link className="nav-menu-link" href={`/review`}>
                <ReviewsCount />
              </Link>
            </li>
            {/* Messages - Only for agents */}
            {isAgent && (
              <li
                className={`nav-menu-item ${
                  pathname == "/messages" ? "active" : ""
                } `}
              >
                <Link className="nav-menu-link" href={`/messages`}>
                  <MessagesCount />
                </Link>
              </li>
            )}
            {/* My properties - Only for agents */}
            {isAgent && (
              <li
                className={`nav-menu-item ${
                  pathname == "/my-property" ? "active" : ""
                } `}
              >
                <Link className="nav-menu-link" href={`/my-property`}>
                  <PropertiesCount />
                </Link>
              </li>
            )}
            {/* Add property - Only for agents */}
            {isAgent && (
              <li
                className={`nav-menu-item ${
                  pathname == "/add-property" ? "active" : ""
                } `}
              >
                <Link className="nav-menu-link" href={`/add-property`}>
                  <svg width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                   aria-hidden="true">
                    <path
                      d="M14.9987 4.16663L12.987 2.15496C12.6745 1.84238 12.2507 1.66672 11.8087 1.66663H4.9987C4.55667 1.66663 4.13275 1.84222 3.82019 2.15478C3.50763 2.46734 3.33203 2.89127 3.33203 3.33329V16.6666C3.33203 17.1087 3.50763 17.5326 3.82019 17.8451C4.13275 18.1577 4.55667 18.3333 4.9987 18.3333H14.9987C15.4407 18.3333 15.8646 18.1577 16.1772 17.8451C16.4898 17.5326 16.6654 17.1087 16.6654 16.6666"
                      stroke="#A8ABAE"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.8168 10.5217C18.1487 10.1897 18.3352 9.73947 18.3352 9.27C18.3352 8.80054 18.1487 8.3503 17.8168 8.01834C17.4848 7.68637 17.0346 7.49988 16.5651 7.49988C16.0956 7.49988 15.6454 7.68637 15.3134 8.01834L11.9718 11.3617C11.7736 11.5597 11.6286 11.8044 11.5501 12.0733L10.8526 14.465C10.8317 14.5367 10.8304 14.6127 10.849 14.6851C10.8675 14.7574 10.9052 14.8235 10.958 14.8763C11.0108 14.9291 11.0768 14.9668 11.1492 14.9853C11.2216 15.0038 11.2976 15.0026 11.3693 14.9817L13.7609 14.2842C14.0298 14.2057 14.2746 14.0606 14.4726 13.8625L17.8168 10.5217Z"
                      stroke="#A8ABAE"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.66797 15H7.5013"
                      stroke="#A8ABAE"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add property
                </Link>
              </li>
            )}
            <li className={`nav-menu-item `}>
              <button 
                className="nav-menu-link logout-btn" 
                onClick={handleLogout}
              >
                <LogoutArrowIcon />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
