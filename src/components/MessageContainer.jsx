import { useEffect, useRef, useState } from "react";
import { query, collection, orderBy, onSnapshot, limit, doc } from "firebase/firestore";
import { db, auth } from "../firebase.jsx";
import MessageComponent from './MessageComponent.jsx';
import { generateChatId } from "./InputBox.jsx"
import { useAuthState } from 'react-firebase-hooks/auth';

function MessageContainer({ activeChat, uid }) {
  const [user] = useAuthState(auth);
    const messagesEndRef = useRef(null); 
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (activeChat && user.uid) {
          const chatId = generateChatId(user.uid, activeChat.id);
          const chatRef = doc(db, 'chats', chatId);
          const messagesCollectionRef = collection(chatRef, 'messages');
    
          const q = query(
            messagesCollectionRef,
            orderBy('createdAt', 'asc'),
            limit(50)
          );
    
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = [];
            querySnapshot.forEach((doc) => {
              fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort((a, b) => a.createdAt - b.createdAt);
            setMessages(sortedMessages);
          });
    
          return () => unsubscribe();
        }
      }, [activeChat, user.uid]);
    
      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

    return (
        <div className="w-full h-5/6 overflow-y-auto backdrop-blur-md backdrop-filter bg-opacity-0">
            {messages.map((message) => (
                <MessageComponent
                    key={message.id}
                    message={message}
                    activeChat={activeChat}a
                />
            ))}
            <div ref={messagesEndRef} />
            {/* <SendMessage scroll={scroll} /> */}
        </div>
    )
}


export default MessageContainer;