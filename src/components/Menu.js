import { useState } from 'react';
import { Menu, Icon } from 'semantic-ui-react';

import './Menu.css';
import farmer from '../farmer.png';

const MainMenu = ({ account }) => {
  const [activeItem, setActiveItem] = useState('starterKit');

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu id='main_menu'>
      <img src={farmer} height='32' alt='' />
      <Menu.Item
        name='Defi Token App'
        active={activeItem === 'starterKit'}
        onClick={handleItemClick}
      />
      <p className='account'>
        <Icon name='user' />
        {account}
      </p>
    </Menu>
  );
};

export default MainMenu;
