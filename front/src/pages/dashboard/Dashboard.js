import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Navigate} from 'react-router-dom'
import Search from '../../Components/Search/Search';
import RegisterCompnay from '../../Components/company/RegisterCompnay';
import InviteEmployee from '../../Components/employee/InviteEmployee';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [section, setSection] = React.useState('search')

  const me = {
    user_id: localStorage.getItem('user_id'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role')
  }
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logOut = () => {

  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
          {
            (me.role === 'SYSTEM_ADMIN' || me.role === 'ADMIN') && 
            <ListItem onClick={()=> setSection('search')} button key="Search">
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Search"} />
            </ListItem>
          }
          { me.role === 'SYSTEM_ADMIN' &&
            <ListItem onClick={()=> setSection('register_company')} button key="Register Company">
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Register company"} />
            </ListItem>
          }
          { (me.role === 'SYSTEM_ADMIN' || me.role === 'ADMIN') &&
            <ListItem onClick={()=> setSection('invite_employee')} button key="Invite employee">
              <ListItemIcon>
                <InboxIcon /> 
              </ListItemIcon>
              <ListItemText primary={"Invite employee"} />
            </ListItem>
          }
          {
            <ListItem onClick={logOut} button key="Log out">
              <ListItemIcon>
                <InboxIcon /> 
              </ListItemIcon>
              <ListItemText primary={"Log out"} />
            </ListItem>
          }
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  if (!localStorage.getItem('user_id'))
    return <Navigate to='/login'/>

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Employee managment app
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {(me.role === 'SYSTEM_ADMIN' || me.role === 'ADMIN') && section === 'search' && <Search me={me} />}
        {(me.role === 'SYSTEM_ADMIN') && section === 'register_company' && <RegisterCompnay me={me} />}
        {(me.role === 'SYSTEM_ADMIN' || me.role === 'ADMIN') && section === 'invite_employee' && <InviteEmployee me={me}/> }
      </Box>
    </Box>
  );
}
export default function Dashboard() {
  return <ResponsiveDrawer />;
}