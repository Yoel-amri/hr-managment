import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Navigate} from 'react-router-dom'
import Search from '../../Components/Search/Search';
import RegisterCompnay from '../../Components/company/RegisterCompnay';
import InviteEmployee from '../../Components/employee/InviteEmployee';
import axios from 'axios';
import EditOwnCompany from '../../Components/company/EditOwnCompany';
import ShowCompany from '../../Components/company/ShowCompany';
import EmployeeEdit from '../../Components/employee/EmployeeEdit';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DomainAddRoundedIcon from '@mui/icons-material/DomainAddRounded';
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';


const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [section, setSection] = React.useState('search')

  const me = props.user;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logOut = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`, {}, {withCredentials:true})
    .then((res) => {
      localStorage.setItem('user_id','')
      localStorage.setItem('email','')
      localStorage.setItem('role','')
      props.setUser({
        user_id: '',
        email: '',
        role: ''
      })
    })
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
                 <SearchRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"Search"} />
            </ListItem>
          }
          { me.role === 'SYSTEM_ADMIN' &&
            <ListItem onClick={()=> setSection('register_company')} button key="Register Company">
              <ListItemIcon>
                <DomainAddRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"Register company"} />
            </ListItem>
          }
          { (me.role === 'SYSTEM_ADMIN' || me.role === 'ADMIN') &&
            <ListItem onClick={()=> setSection('invite_employee')} button key="Invite employee">
              <ListItemIcon>
                <ContactMailRoundedIcon /> 
              </ListItemIcon>
              <ListItemText primary={"Invite employee"} />
            </ListItem>
          }
          { me.role === 'ADMIN' &&
            <ListItem onClick={()=> setSection('edit_company')} button key="edit company">
              <ListItemIcon>
                <EditRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"Edit your company"} />
            </ListItem>
          }
          {me.role === 'EMPLOYEE' &&
            <ListItem onClick={() => setSection('company_info')} button key="company info">
              <ListItemIcon>
                <CorporateFareRoundedIcon /> 
              </ListItemIcon>
              <ListItemText primary={"Company info"} />
            </ListItem>
          }
          {me.role === 'EMPLOYEE' &&
            <ListItem onClick={() => setSection('update_profile')} button key="update info">
              <ListItemIcon>
                <AccountCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"Update info"} />
            </ListItem>
          }
          {
            <ListItem onClick={logOut} button key="Log out">
              <ListItemIcon>
                <LogoutRoundedIcon /> 
              </ListItemIcon>
              <ListItemText primary={"Log out"} />
            </ListItem>
          }
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  if (!props.user.user_id)
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
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
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
        {(me.role === 'ADMIN') && section === 'edit_company' && <EditOwnCompany /> }
        {me.role === 'EMPLOYEE' && section === 'company_info' && <ShowCompany me={me} />}
        {me.role === 'EMPLOYEE' && section === 'update_profile' && <EmployeeEdit role={me.role} user_id={me.user_id}/>}
      </Box>
    </Box>
  );
}
export default function Dashboard({user, setUser}) {
  return <ResponsiveDrawer user={user} setUser={setUser} />
}