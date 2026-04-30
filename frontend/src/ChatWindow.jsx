import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { DotLoader } from "react-spinners";
import { useClerk, UserButton, useUser, useAuth } from "@clerk/react"; // ✅ FIXED


function ChatWindow({ isLight, setIsLight }) {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth(); // ✅ FIXED

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    const token = await getToken(); // ✅ FIXED

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ IMPORTANT
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(
        "https://buddyai-4.onrender.com/api/chat",
        options
      );
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // reply append
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleBrightNess = () => {
    setIsLight(!isLight);
  };

  document.body.className = isLight ? "light" : "dark";

  return (
    <div className="chatWindow">
      <div className="navbar container">
        <span className="col-8" style={{ marginLeft: "300px" }}>
          BuddyAI <i className="fa-solid fa-chevron-down"></i>
        </span>

        <div className="userIconDiv col-2" onClick={handleProfileClick}>
          <span className="userIcon">
            {!user ? (
              <i className="fa-solid fa-user"></i>
            ) : (
              <UserButton />
            )}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className={isLight ? "dropDownWhite" : "dropDown"}>
          <div className="dropDownItem" onClick={handleBrightNess}>
            {isLight ? (
  <span>
    <i className="fa-regular fa-moon"></i> Dark
  </span>
) : (
  <span>
    <i className="fa-solid fa-sun"></i> Light
  </span>
)}
          </div>

          <div className="dropDownItem">Setting</div>

          <div className="dropDownItem">
            {!user ? (
              <i onClick={openSignIn} className="fa-solid fa-circle-user">
                login
              </i>
            ) : (
              <i className="fa-solid fa-arrow-right-from-bracket">
                Log out
              </i>
            )}
          </div>
        </div>
      )}

      <Chat isLight={isLight} />

      <div className="loader">
        <DotLoader
          color={isLight ? "#000" : "#fff"}
          loading={loading}
        />
      </div>

      {
        !user?<div className={isLight?"notLogged":"notLoggedLight"}><i class="fa-regular fa-face-frown"></i>&nbsp;&nbsp;You aren’t logged in</div>:""
        
      }

      {
        !user?"":

      
      <div className="chatInput">
        <div className={isLight ? "inputBoxLight" : "inputBox"}>
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          BuddyAI can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
}
    </div>
  );
}

export default ChatWindow;