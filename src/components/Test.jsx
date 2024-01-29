import React, { useState } from "react";
import { auth, db } from "../firebase.jsx";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function Test() {
    const handleClick = () => {
        testDataBase();
    };

    const testDataBase = async () => {
        const { uid, displayName, photoURL } = auth.currentUser;
        await addDoc(collection(db, "test"), {
            text: "test",
            name: displayName,
            avatar: photoURL,
            createdAt: serverTimestamp(),
            uid,
        });
    };

    return (
        <div>
            <button onClick={handleClick}></button>
        </div>
    );
}

export default Test;