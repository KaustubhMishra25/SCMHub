import Login from './Login/Login'; 
import Main from './Main/Main';
import Signup from './Signup/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function SCMRoutes() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route path="/main" element={<Main />} /> {/* Main route (if applicable) */}
          <Route path="/signup" element={<Signup />} /> 
        </Routes>
      </BrowserRouter>
    );
  }
  
  export default SCMRoutes;
  