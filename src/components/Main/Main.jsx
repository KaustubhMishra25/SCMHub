import { useContext, useState } from 'react';
import "./Main.css";
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';


const Main = () => {
    const [fileContent, setFileContent] = useState('');

    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context)

    const handleClick = (text) => {
        setInput(text);
    };

    const handleDownload = () => {
        const templateUrl = "src/config/user_data_template.txt";
        const link = document.createElement("a");
        link.href = templateUrl;
        link.download = "UserTemplate-SCM"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        console.log(file);

        if (!file) {
            return; // Handle potential user cancellation
        }

        if (file.type !== 'text/plain') {
            alert('Please upload a text file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setFileContent(e.target.result);
            console.log(fileContent);
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            alert('Failed to read file content'); // Inform user about error
        };

        reader.readAsText(file);
    };

    return (
        <div className='main'>
            <div className="nav">


                <p><span style={{ fontSize: "30px", color: "#3103a3" }}>SCM</span> Hub </p>
                <button className="download-button" onClick={handleDownload}>Download Template!</button>

            </div>

            <div className="main-container">

                {!showResult ?
                    <>

                        <div className="greet">
                            <img className='title_logo' src="https://cdn.scite.ai/assets/images/icons/assistant.svg" alt="" />
                            <p><span>Managing Business? EASY!</span></p>


                        </div>



                        <div className="cards">
                            <div className="card" onClick={() => handleClick('How do I manage my inventory better?')}>
                                <p>How do I manage my inventory better?</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleClick('Is this customer demographic relevant to my business?')}>
                                <p>Is this customer demographic relevant to my business?</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleClick('Write a quick summary of my business, for advertising')}>
                                <p>Write a quick summary of my business, for advertising</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleClick('What are the best and worst things about my business?')}>
                                <p>What are the best and worst things about my business?</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>


                    </>

                    :
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>

                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading
                                ?
                                <div className="loading">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                                :
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>

                            }
                        </div>


                    </div>

                }




                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                        <div>

                            {input ? <img onClick={() => onSent(fileContent)} src={assets.send_icon} alt="" /> : null}
                            <label htmlFor="fileInput">
                                <img src={assets.upload} alt="Upload File" />
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                onChange={handleUpload}
                                accept=".txt" // Only allow text files
                                style={{ display: 'none' }} // Hide the file input visually
                            />

                        </div>
                    </div>

                    <p className="bottom-info">
                        This site may display inaccurate info, including about people, so double-check its responses.
                    </p>
                </div>
            </div>


        </div>
    )
}

export default Main