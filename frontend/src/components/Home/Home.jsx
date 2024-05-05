import { Context } from "../../context/Context";
import { useContext, useState } from "react";
import Login from "../Login/Login";
import Main from "../Main/Main";
import Sidebar from "../SideBar/Sidebar";
import "./Home.css";
import Signup from "../Signup/Signup"

const Home = () => {
    const [ isLoggedIn,setIsLoggedIn ] = useState(false); 
    const [userData, setUserData] = useState(null);
    const [signUpMode, setSignUpMode] = useState(false);
    const onLogin = (userData) => {
        if(userData == "User does not exist!")
            setSignUpMode(true);
        else {
            setIsLoggedIn(true);
            setUserData(userData);
        }
    }
    const onSignup = (userData) => {
        setUserData(userData);
        setIsLoggedIn(true);
        setSignUpMode(false);
    }
    return (
            <>
                {/* Render different content based on authentication state */}
                {signUpMode? (
                    <Signup onSignup={onSignup}/>
                ):
                <>
                {isLoggedIn ? (
                    <>
                    <Sidebar />
                    <Main />
                    </>
                ): <Login onLogin={onLogin}/>}
                </>}
            </>
    );
}

export default Home;