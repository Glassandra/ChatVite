import { useState } from "react";
import { auth, db } from "../firebase.jsx";
import { addDoc, collection, serverTimestamp, doc } from "firebase/firestore";
import PropTypes from 'prop-types';

function InputBox({ activeChat }) {
    const [input, setInput] = useState("")
    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") {
            alert("Please enter a message");
            return;
        }
        const { uid } = auth.currentUser;
        const chatId = generateChatId(uid, activeChat.id);
        const chatRef = doc(db, "chats", chatId);
        const messagesCollectionRef = collection(chatRef, "messages");
        const message = {
            text: input,
            createdAt: serverTimestamp(),
            uid,
        };

        await addDoc(messagesCollectionRef, message);
        setInput("");
    }

    return (
        <form className="bg-red-100 mb-auto m-6  p-2" onSubmit={sendMessage}> {/* Wrap the input and button in a form and set the onSubmit event to sendMessage */}
            <input className="m-4 p-4" type="text"
                placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} />

            <button type="submit" className="p-4 m-4 hover:bg-red-500 hover:text-white">Send</button> {/* Remove the onClick event from the button */}
        </form>
    )
}

InputBox.propTypes = {
    activeChat: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  };

export function generateChatId(userId1, userId2) {
    return [userId1, userId2].sort().join("_");
}

export default InputBox;