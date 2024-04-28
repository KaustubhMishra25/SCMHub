import { Context } from "../../context/Context";
import { useContext } from "react";
import Login from "../Login/Login";
import Main from "../Main/Main";
import Sidebar from "../SideBar/Sidebar";


const Home = () => {
    const { isLoggedIn } = useContext(Context); // Assuming you have an AuthContext with an `isLoggedIn` state

    return (
        <div className='main'>
            <div className="nav">
                {/* Render different content based on authentication state */}
                {isLoggedIn ? (
                    <>
                    <Sidebar />
                    <Main />
                    </>
                ): <Login />}
            </div>
        </div>
    );
}

export default Home;