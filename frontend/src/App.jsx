import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //store all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  //to saved chats in history
  const [allThreads, setAllThreads] = useState([]);

  const [isLight, setIsLight] = useState(false);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar isLight={isLight} />

        <ChatWindow isLight={isLight} setIsLight={setIsLight} />
      </MyContext.Provider>
    </div>
  );
}

export default App;
