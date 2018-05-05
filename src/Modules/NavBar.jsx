import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Header, Icon, Button } from 'semantic-ui-react';
import logo2 from './logo2.png';

class NavBar extends Component {
  render() {
    return (
      <Menu>
          <Menu.Item>
              <img src={logo2} /> HOLD
          </Menu.Item>

          <Menu.Item>
            <Button> Log Out</Button>
          </Menu.Item>
      </Menu>
    );
  }
}

export default NavBar;
