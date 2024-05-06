/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import runChat from "../config/gemini";
import axios from "axios";

export const Context = createContext();

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPreviousPrompts] = useState([]);
    const [showResult , setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);


    const delayText = (index,nextWord) =>{
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75*index)
    }

    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }
    

    const onSent = async (prompt, jsonData) => {
        setResultData("")
        setLoading(true);
        setShowResult(true);
        let response;
        // if(content !== undefined){
        //     prompt = "\n\nUSER DATA\n"+content+"\n\nUSER QUESTION\n"+prompt;
        // }
        console.log(jsonData);
        const userData = {
            businessName: jsonData.userData.business_details.businessName,
            businessType: jsonData.userData.business_details.businessType,
            businessDescription: jsonData.userData.business_details.businessDescription,
            transportationMethods: jsonData.userData.business_details.transportationMethods,
            constraints: jsonData.userData.business_details.constraints
        };

        if(prompt !== undefined){
            response = await axios.post(`${baseUrl}/ai/get-response/`, { prompt, userData });
            setRecentPrompt(prompt)
        }
        else{
            setPreviousPrompts(prev=>[...prev,input])          
            setRecentPrompt(input)
            response = await axios.post(`${baseUrl}/ai/get-response/`, { input, userData });
        }
        
       
        let responseArray = response.data.message.split("\n");
        let newResponse="";
        for(let i=0; i< responseArray.length; i++){
            if(i==0 || i%2 !==1){
                newResponse += responseArray[i];
            }else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let answer = newResponse2.split(" ");
        for(let i=0; i<answer.length; i++){
            const nextWord = answer[i];
            delayText(i,nextWord + " ")
        }
        setLoading(false);
        setInput("")
    }

    const login = (userData) => {

        setIsLoggedIn(true);
        setUserData(userData);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserData(null);
    };
    const contextValue = {
        prevPrompts,
        setPreviousPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        login,
        logout

    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider