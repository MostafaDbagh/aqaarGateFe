"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import ReviewsCount from "@/components/common/ReviewsCount";
import PropertiesCount from "@/components/common/PropertiesCount";
import { useAuthState } from "@/store/hooks/useAuth";
import { authAPI } from "@/apis/auth";
import { userAPI } from "@/apis/user";
import { getAddPropertyWhatsAppUrl } from "@/constants/contactWhatsApp";
import { DashboardGridIcon, DocumentIcon, PackageBoxIcon, EditIcon, LogoutArrowIcon, UserIcon } from "@/components/icons";
import { useAdminTab, TABS } from "@/components/admin/AdminDashboardMain";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal";
import Toast from "@/components/common/Toast";
import styles from "./Sidebar.module.css";
import { useTranslations } from 'next-intl';
import NotificationBell from "@/components/common/NotificationBell";

export default function Sidebar() {
  // Fallback translations for static generation
  const fallbackTranslations = {
    'dashboards': 'Dashboards',
    'myPackage': 'My package',
    'myProfile': 'My Profile',
    'myFavorites': 'My favorites',
    'reviews': 'Reviews',
    'messages': 'Messages',
    'notifications': 'Notifications',
    'myProperties': 'My properties',
    'addProperty': 'Add property',
    'logout': 'Logout',
    'deleteMyAccount': 'Delete My Account'
  };

  let t;
  try {
    const sidebarT = useTranslations('agent.sidebar');
    t = (key) => {
      try {
        return sidebarT(key);
      } catch (e) {
        return fallbackTranslations[key] || key;
      }
    };
  } catch (error) {
    // Fallback for static generation
    t = (key) => fallbackTranslations[key] || key;
  }
  const pathname = usePathname();
  const router = useRouter();
  const { isAgent, logout: logoutUser, user } = useAuthState();
  const isAdmin = user?.role === 'admin';
  const [deleteAccountModal, setDeleteAccountModal] = useState({ isOpen: false });
  const [toast, setToast] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get admin tab context if available (only works when inside AdminDashboardMain)
  const adminTabContext = useAdminTab(); // This will return null if not in context

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

  const handleDeleteAccount = async () => {
    if (!user?._id) {
      setToast({ type: 'error', message: 'User information not found.' });
      setDeleteAccountModal({ isOpen: false });
      return;
    }

    setIsDeleting(true);
    try {
      await userAPI.deleteAccount(user._id);
      setToast({ type: 'success', message: 'Your account has been deleted successfully.' });
      // Clear local storage and logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        logoutUser(); // This will redirect to home page
      }, 1500);
    } catch (error) {
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to delete account. Please try again.';
      setToast({ type: 'error', message: errorMessage });
      setIsDeleting(false);
      setDeleteAccountModal({ isOpen: false });
    }
  };
  return (
    <div className="wrap-sidebar">
      <div className="sidebar-menu-dashboard">
        <div className="menu-box">
          <ul className="box-menu-dashboard">
            {/* Admin Menu Items */}
            {isAdmin ? (
              <>
                {/* Admin Dashboard */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.OVERVIEW ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.OVERVIEW);
                        router.replace('/en/admin/overview');
                      } else {
                        router.push('/en/admin/overview');
                      }
                    }}
                  >
                    <DashboardGridIcon />
                    <span>Admin Dashboard</span>
                  </button>
                </li>

                {/* Properties */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.PROPERTIES ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.PROPERTIES);
                        router.replace('/en/admin/properties');
                      } else {
                        router.push('/en/admin/properties');
                      }
                    }}
                  >
                    <i className="icon-home" />
                    <span>Properties</span>
                  </button>
                </li>

                {/* Properties by Admin */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.PROPERTIES_BY_ADMIN ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.PROPERTIES_BY_ADMIN);
                        router.replace('/en/admin/properties-by-admin');
                      } else {
                        router.push('/en/admin/properties-by-admin');
                      }
                    }}
                  >
                    <i className="icon-home" />
                    <span>Properties by Admin</span>
                  </button>
                </li>

                {/* Add Property */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.ADD_PROPERTY ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.ADD_PROPERTY);
                        router.replace('/en/admin/add-property');
                      } else {
                        router.push('/en/admin/add-property');
                      }
                    }}
                  >
                    <i className="icon-plus" />
                    <span>Add Property</span>
                  </button>
                </li>

                {/* Sold Properties */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.SOLD_PROPERTIES ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.SOLD_PROPERTIES);
                        router.replace('/en/admin/sold-properties');
                      } else {
                        router.push('/en/admin/sold-properties');
                      }
                    }}
                  >
                    <i className="icon-check" />
                    <span>Sold Properties</span>
                  </button>
                </li>

                {/* Deleted Properties */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.DELETED_PROPERTIES ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.DELETED_PROPERTIES);
                        router.replace('/en/admin/deleted-properties');
                      } else {
                        router.push('/en/admin/deleted-properties');
                      }
                    }}
                  >
                    <i className="icon-trashcan" />
                    <span>Deleted Properties</span>
                  </button>
                </li>

                {/* Agents */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.AGENTS ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.AGENTS);
                        router.replace('/en/admin/agents');
                      } else {
                        router.push('/en/admin/agents');
                      }
                    }}
                  >
                    <UserIcon stroke="currentColor" />
                    <span>Agents</span>
                  </button>
                </li>

                {/* Users */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.USERS ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.USERS);
                        router.replace('/en/admin/users');
                      } else {
                        router.push('/en/admin/users');
                      }
                    }}
                  >
                    <i className="icon-user" />
                    <span>Users</span>
                  </button>
                </li>

                {/* Rental Services */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.RENTAL_SERVICES ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.RENTAL_SERVICES);
                        router.replace('/en/admin/rental-services');
                      } else {
                        router.push('/en/admin/rental-services');
                      }
                    }}
                  >
                    <i className="icon-home" />
                    <span>Rental Services</span>
                  </button>
                </li>

                {/* Contact Us */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.CONTACTS ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.CONTACTS);
                        router.replace('/en/admin/contacts');
                      } else {
                        router.push('/en/admin/contacts');
                      }
                    }}
                  >
                    <i className="icon-mail" />
                    <span>Contact Us</span>
                  </button>
                </li>

                {/* Careers */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.CAREERS ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.CAREERS);
                        router.replace('/en/admin/careers');
                      } else {
                        router.push('/en/admin/careers');
                      }
                    }}
                  >
                    <i className="icon-bag" />
                    <span>Careers</span>
                  </button>
                </li>

                {/* Reviews */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.REVIEWS ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.REVIEWS);
                        router.replace('/en/admin/reviews');
                      } else {
                        router.push('/en/admin/reviews');
                      }
                    }}
                  >
                    <i className="icon-star" />
                    <span>Reviews</span>
                  </button>
                </li>

                {/* Future Buyers */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.FUTURE_BUYERS ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.FUTURE_BUYERS);
                        router.replace('/en/admin/future-buyers');
                      } else {
                        router.push('/en/admin/future-buyers');
                      }
                    }}
                  >
                    <i className="icon-user" />
                    <span>Future Buyers</span>
                  </button>
                </li>

                {/* Messages */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.MESSAGES ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.MESSAGES);
                        router.replace('/en/admin/messages');
                      } else {
                        router.push('/en/admin/messages');
                      }
                    }}
                  >
                    <i className="icon-message" />
                    <span>Messages</span>
                  </button>
                </li>

                {/* Notifications - For admin only */}
                {isAdmin && (
                  <li className={`nav-menu-item ${pathname?.includes('/notifications') ? 'active' : ''}`}>
                    <div 
                      className={`nav-menu-link ${styles.adminButton}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Only navigate if not clicking on the bell icon
                        if (!e.target.closest('.notificationBellContainer')) {
                          router.push('/notifications');
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!e.target.closest('.notificationBellContainer')) {
                            router.push('/notifications');
                          }
                        }
                      }}
                    >
                      <NotificationBell />
                      <span>{t('notifications') || 'Notifications'}</span>
                    </div>
                  </li>
                )}

                {/* Create Admin */}
                <li
                  className={`nav-menu-item ${
                    adminTabContext?.activeTab === TABS.CREATE_ADMIN ? "active" : ""
                  }`}
                >
                  <button 
                    type="button"
                    className={`nav-menu-link ${styles.adminButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (adminTabContext) {
                        adminTabContext.setActiveTab(TABS.CREATE_ADMIN);
                        router.replace('/en/admin/create-admin');
                      } else {
                        router.push('/en/admin/create-admin');
                      }
                    }}
                  >
                    <UserIcon />
                    <span>Create Admin</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Dashboard - Only for agents */}
                {isAgent && (
                  <li
                    className={`nav-menu-item ${
                      pathname == "/dashboard" ? "active" : ""
                    } `}
                  >
                    <Link className="nav-menu-link" href={`/dashboard`}>
                      <DashboardGridIcon />
                      {t('dashboards')}
                    </Link>
                  </li>
                )}
                {/* My package - Only for agents */}
                {isAgent && (
                  <li
                    className={`nav-menu-item ${
                      pathname == "/my-package" ? "active" : ""
                    } `}
                  >
                    <Link className="nav-menu-link" href={`/my-package`}>
                      <PackageBoxIcon />
                      {t('myPackage')}
                    </Link>
                  </li>
                )}
                {/* My Profile - For all users and agents */}
                <li
                  className={`nav-menu-item ${
                    pathname == "/my-profile" ? "active" : ""
                  } `}
                >
                  <Link className="nav-menu-link" href={`/my-profile`}>
                    <UserIcon />
                    {t('myProfile')}
                  </Link>
                </li>

                <li
                  className={`nav-menu-item ${
                    pathname == "/my-favorites" ? "active" : ""
                  } `}
                >
                  <Link className="nav-menu-link" href={`/my-favorites`}>
                    <i className="icon-bookmark" />
                    {t('myFavorites')}
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
                      <i className="icon-message" />
                      {t('messages')}
                    </Link>
                  </li>
                )}
                {/* Notifications - For agents */}
                {isAgent && (
                  <li className={`nav-menu-item ${pathname?.includes('/notifications') ? 'active' : ''}`}>
                    <div 
                      className="nav-menu-link"
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Only navigate if not clicking on the bell icon
                        if (!e.target.closest('.notificationBellContainer')) {
                          router.push('/notifications');
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!e.target.closest('.notificationBellContainer')) {
                            router.push('/notifications');
                          }
                        }
                      }}
                    >
                      <NotificationBell />
                      <span>{t('notifications') || 'Notifications'}</span>
                    </div>
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
                {/* Add property - Visible for agents (link) and users (WhatsApp) */}
                {isAgent ? (
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
                      {t('addProperty')}
                    </Link>
                  </li>
                ) : (
                  <li className="nav-menu-item">
                    <a
                      className={`nav-menu-link ${styles.addPropertyWhatsAppLink}`}
                      href={getAddPropertyWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                      {t('addProperty')}
                    </a>
                  </li>
                )}
              </>
            )}
            <li className={`nav-menu-item `}>
              <button 
                className="nav-menu-link logout-btn" 
                onClick={handleLogout}
              >
                <LogoutArrowIcon />
                {t('logout')}
              </button>
            </li>
            {/* Delete My Account - For agent (after Logout) and user (last tab) */}
            {!isAdmin && (
              <li className={` ${styles.deleteAccountItem}`}>
                <button 
                  className={`nav-menu-link ${styles.deleteAccountButton}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteAccountModal({ isOpen: true });
                  }}
                >
                  <i className="icon-trash" />
                  {t('deleteMyAccount')}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={deleteAccountModal.isOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteAccountModal({ isOpen: false });
          }
        }}
        onConfirm={handleDeleteAccount}
        loading={isDeleting}
        userRole={isAgent ? 'agent' : 'user'}
      />
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
