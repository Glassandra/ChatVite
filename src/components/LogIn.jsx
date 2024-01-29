import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { signOut } from "firebase/auth";
import googleSignInImg from './web_neutral_rd_SI@2x.png'; // import the image
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase.jsx";



function LogIn() {
    const auth = getAuth();

    const [user, loading, error] = useAuthState(auth);

    const signInWithGoogle = async () => {
        if (!loading && !user) {
            const provider = new GoogleAuthProvider();
            signInWithRedirect(auth, provider).catch((error) => {
                    console.error("Error signing in with Google: ", error);
                });
        }
    };

    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result && result.user) {
                    checkFireStoreUser(result.user);
                }
            })
            .catch((error) => {
                console.error("Error in Redirect Result: ", error);
            });
    }, [auth]);

    const checkFireStoreUser = async (user) => {
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((docSnap) => {
            if (!docSnap.exists()) {
                setDoc(userRef, {
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    email: user.email,
                    friends: [],
                    sentRequests: [],
                    recievedRequests: [],
                    blocked: [],
                });
            }
        });
    }


    const handleSignOut = () => {
        if (user) {
            signOut(auth).catch((error) => {
                console.error("Error signing out: ", error);
            });
        }
    }

    if (loading) {
        return <div className="googleImage">Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="m-auto">
            {user ? (
                <button className="button logInButton" onClick={handleSignOut}>Sign out</button>
            ) : (
                <img src={googleSignInImg} alt="Google Sign In" onClick={signInWithGoogle} />
            )}
        </div>
    )
}

export default LogIn;