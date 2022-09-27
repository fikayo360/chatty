
import Login from './pages/login/login';
import Register from './pages/register/register';
import Home from './pages/home/home';
import Finduser from './pages/findfriend/findfriend';
import Profile from './pages/profile/profile';
import Editprofile from './pages/editprofile/edit'
import Notification from './pages/notifications/notifications';
import { BrowserRouter as Router,Route,Routes,Navigate} from "react-router-dom";
import Notfound from './pages/notfound/notfound';
import {useSelector } from "react-redux";

function App() {
    const user = useSelector((state)=>state.user.username)
  return (
   <>
     <Router>
      <Routes>
        <Route index element={<Register/>} />
        <Route path="login" element={<Login/>} />
        <Route path="home" element={
          !user ? (
          <Navigate replace to="/login" />
        ) : (
          <Home />
        )
        } 
        />
        <Route path="notifications" element={
        !user ? (
          <Navigate replace to="/login" />
        ) : (
          <Notification />
        )
        } />

        <Route path="findfriend" element={
         !user ? (
          <Navigate replace to="/login" />
        ) : (
          <Finduser />
        )
        } />

        <Route path="profile" element={
         !user ? (
          <Navigate replace to="/login" />
        ) : (
          <Profile />
        )
        } />

        <Route path="edit" element={
         !user ? (
          <Navigate replace to="/login" />
        ) : (
          <Editprofile />
        )
        } />

        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router> 
   </>
  );
}

export default App;
