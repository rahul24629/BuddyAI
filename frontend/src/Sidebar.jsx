import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
import { useAuth } from "@clerk/react"; // ✅ যোগ হলো


function Sidebar({ isLight }) {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const { getToken } = useAuth(); // ✅ যোগ হলো

  const getAllThreads = async () => {
    try {
      const token = await getToken(); // ✅ যোগ হলো
      const response = await fetch("https://buddyai-4.onrender.com/api/thread", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ যোগ হলো
      });
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const token = await getToken(); // ✅ যোগ হলো
      const response = await fetch(
        `https://buddyai-4.onrender.com/api/thread/${newThreadId}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ যোগ হলো
        }
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const token = await getToken(); // ✅ যোগ হলো
      const response = await fetch(
        `https://buddyai-4.onrender.com/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }, // ✅ যোগ হলো
        }
      );
      const res = await response.json();
      console.log(res);
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={isLight ? "sidebarLight" : "sidebar"}>
      <div className="container">
        <button onClick={createNewChat}>
          <div className="col-2 logoBrand">
            <img
              src="/logo.png"
              alt="BuddyAI logo"
              className="logo"
            />
          </div>
          <div className="col-5">
            <i className="fa-solid fa-pen-to-square"></i>
          </div>
        </button>
      </div>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash-can"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By BuddyAI &hearts;</p>
      </div>
    </div>
  );
}

export default Sidebar;