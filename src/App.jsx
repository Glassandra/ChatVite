import './App.css';
import { useState, useEffect } from 'react';
import StartPage from './components/StartPage.jsx';
import { auth } from './firebase.jsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import InputBox from './components/InputBox.jsx';
import MessageContainer from './components/MessageContainer.jsx';
import FriendBox from './components/FriendBox.jsx';

function App() {
  const [user] = useAuthState(auth);
  const [activeChat, setActiveChat] = useState(null);

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error("Error signing out: ", error);
    });
  }

  useEffect(() => {
    if (user) {
      localStorage.setItem("lastUserId", activeChat);
    }
  }, [activeChat]);

  const handleFriendClick = (friend) => {
    setActiveChat(friend);
  };

  return (
    <div className="bg-pink-50 h-dvh w-screen overflow-hidden font-sans" >
    {user ? (
      <div className="w-full h-full bg-green-50 top-16">
        <div className="w-full h-20 bg-purple-400 flex justify-center sticky top-0 min-w-96">
          <button className="hover:bg-pink-50 mr-8 p-4" onClick={() => setActiveChat(null)}>Home</button>
          {activeChat ? <img src={activeChat.friendPhoto} alt="profile" className="mr-8 rounded-full" /> : <span>  </span>}     
          <button className="hover:bg-pink-50 mr-8 p-4" onClick={handleSignOut}>Sign Out</button>
          <img src={user.photoURL} alt="profile" className="rounded-full" />
        </div>
        {activeChat ? (
          <div id="active-window" className=" h-[calc(100dvh-100px)] m-auto mt-2 flex flex-col items-center bg-purple-50 w-1/2 min-w-96">
            <MessageContainer activeChat={activeChat} userId={user.uid} />
            <InputBox activeChat={activeChat} />
          </div>
        ) : (
          <FriendBox userId={user.uid} onFriendClick={handleFriendClick} />
        )}
      </div>
    ) : (
      <StartPage />
    )}
  </div>
  );
}

export default App;