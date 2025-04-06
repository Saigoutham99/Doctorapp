import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Badge, message } from 'antd';
import { adminMenu, userMenu } from '../Data/data'; // Import the admin and user menus
import '../styles/LayoutStyles.css'; // Import your CSS styles

const Layout = ({ children }) => {
  // Redux state to fetch the user data
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Logout handler to clear local storage and navigate to login page
  const handleLogout = () => {
    localStorage.clear();
    message.success('Logout Successfully');
    navigate('/login');
  };


//*** Doctor menu ***/
const doctorMenu = [
  {
    name: 'Home',
    path: '/',
    icon: 'fa-solid fa-house',
  },
  {
    name: 'Appointments',
    path: '/appointments',
    icon: 'fa-solid fa-list',
  },
  {
    name: 'Profile',
    path: `/doctor/profile/${user?._id}`,  
    icon: 'fa-solid fa-user',
  },
];

  // Decide menu based on user role (admin or regular user)
  const SidebarMenu =  user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;

  return (
    <div className="main">
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <h6>Doctor App</h6>
            <hr />
          </div>

          <div className="menu">Menu</div>

          {/* Loop through menu items */}
          {SidebarMenu.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <div key={index} className={`menu-item ${isActive ? 'active' : ''}`}>
                <i className={menu.icon}></i>
                <Link to={menu.path}>{menu.name}</Link>
              </div>
            );
          })}

          {/* Logout Button - universal for all users */}
          <div className={`menu-item`} onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="content">
          <div className="header">
            <div className="header-content" style={{cursor:"pointer"}}>
              {/* Notification badge */}
              <Badge count={user && user.notification.length} 
              onClick={() =>{
                navigate('/notification');
                }}
                >
                <i className="fa-solid fa-bell"></i>
              </Badge>

              {/* User Profile link */}
              <Link to="/profile">{user?.name || 'User'}</Link>
            </div>
          </div>

          {/* Main content */}
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
