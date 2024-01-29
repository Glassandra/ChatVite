import { useState, useEffect } from "react";
import { db } from "../firebase.jsx";
import { doc, getDoc, onSnapshot, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

/**
 * Renders a component that displays the friend list, friend requests, and search functionality to add friends.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.userId - The ID of the current user.
 * @param {Function} props.onFriendClick - The function to handle when a friend is clicked.
 * @returns {JSX.Element} The rendered FriendBox component.
 */
function FriendBox({ userId, onFriendClick }) {
    const [friendNames, setFriendNames] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [searchFriends, setSearchFriends] = useState("");

    const handleSearchChange = (event) => {
        setSearchFriends(event.target.value);
    };

    // Handler for searching for friends
    const handleSearchSubmit = async (event) => {
        event.preventDefault();

        const userRef = collection(db, "users");
        const queryRef = query(userRef, where("email", "==", searchFriends));

        const querySnapshot = await getDocs(queryRef);
        const userDoc = querySnapshot.docs[0];

        if (userDoc) {
            const currentUserRef = doc(db, "users", userId);
            const friendUserRef = doc(db, "users", userDoc.id);

            await updateDoc(currentUserRef, {
                sentRequests: arrayUnion(friendUserRef.id),
            });

            await updateDoc(friendUserRef, {
                recievedRequests: arrayUnion(currentUserRef.id),
            });
            setSearchFriends("");
        }
        else {
            alert("User not found");
        }
    };

    useEffect(() => {
        const userRef = doc(db, "users", userId);
        const unsubscribe = onSnapshot(userRef, async (docSnapShot) => {
            const userData = docSnapShot.data();
            const friendsIds = userData.friends;
            const sentRequestsIds = userData.sentRequests;
            const recievedRequestsIds = userData.recievedRequests;

            const newFriendNames = await Promise.all(
                friendsIds.map(async (friendId) => {
                    const friendRef = doc(db, "users", friendId);
                    const friendDoc = await getDoc(friendRef);
                    const friendData = friendDoc.data();
                    return { id: friendId, name: friendData.displayName, friendPhoto: friendData.photoURL };
                })
            );
            setFriendNames(newFriendNames);

            const newSentRequests = await Promise.all(
                sentRequestsIds.map(async (friendId) => {
                    const friendRef = doc(db, "users", friendId);
                    const friendDoc = await getDoc(friendRef);
                    const friendData = friendDoc.data();
                    return { id: friendId, name: friendData.displayName, friendPhoto: friendData.photoURL };
                })
            );
            setSentRequests(newSentRequests);

            const newRecievedRequests = await Promise.all(
                recievedRequestsIds.map(async (friendId) => {
                    const friendRef = doc(db, "users", friendId);
                    const friendDoc = await getDoc(friendRef);
                    const friendData = friendDoc.data();
                    return { id: friendId, name: friendData.displayName, friendPhoto: friendData.photoURL };
                })
            );
            setFriendRequests(newRecievedRequests);
        });
        return () => unsubscribe();
    }, []);

    const handleNameClick = (friend) => {
        setSelectedFriend(friend.id);
        onFriendClick(friend);
    };

    const handleAccept = async (friend) => {
        const currentUserRef = doc(db, "users", userId);
        const friendUserRef = doc(db, "users", friend.id);

        await updateDoc(currentUserRef, {
            friends: arrayUnion(friendUserRef.id),
            recievedRequests: arrayRemove(friendUserRef.id),
        });

        await updateDoc(friendUserRef, {
            friends: arrayUnion(currentUserRef.id),
            sentRequests: arrayRemove(currentUserRef.id),
        });
    };


    return (
        <div className="w-1/2 m-auto mt-14 flex flex-col justify-center bg-red-50 p-4">
            <h2 className="text-lg font-bold">Friends</h2>
            {friendNames.map((friend, index) => (
                <p key={index}
                    onClick={() => handleNameClick(friend)}
                    className="ml-4 hover:bg-green-100"
                >
                    {friend.name}
                </p>
            ))}
            <h2 className="text-lg font-bold">Friend Requests</h2>
            {friendRequests.map((friend, index) => (
                <p key={index} className="ml-4 hover:bg-green-100" onClick={() => handleAccept(friend)}>
                    {friend.name}
                </p>
            ))}
            <h2 className="text-lg font-bold">Sent Requests</h2>
            {sentRequests.map((friend, index) => (
                <p key={index} className="ml-4 hover:bg-green-100">
                    {friend.name}
                </p>
            ))}
            <form className=" border-2 p-2" onSubmit={handleSearchSubmit}>
                <input
                    className="pl-2"
                    id="friend-search"
                    type="email"
                    placeholder="Search for friends"
                    value={searchFriends}
                    onChange={handleSearchChange}
                />
                <button className="ml-4 hover:bg-green-100 p-2" type="submit" >Add Friend</button>
            </form>
        </div>
    );
}

export default FriendBox;