import React from 'react';

interface SidebarProps {
  setMainContent: (content: string) => void;
}

const Sidebar = ({ setMainContent }: SidebarProps) => {
  const handleClick = (content: string) => () => {
    setMainContent(content);
  };

  return (
    <div className='sidebar'>
      <h1 style={{ fontFamily: 'Arial, sans-serif' }}>Inflect</h1>
      <div className='sidebar-links'>
        <a onClick={handleClick('connections')}>Connections</a>
        <a onClick={handleClick('new-connection')}>Add New Connection</a>
      </div>
    </div>
  );
};

export default Sidebar;
