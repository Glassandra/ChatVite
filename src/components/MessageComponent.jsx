import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import PropTypes from 'prop-types';

function MessageComponent({ message }) {
    const [user] = useAuthState(auth);

    const date = new Date(message.createdAt*26);
    const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

    return ( <div className="flex flex-row align-baseline w-full p-2 bg-white ">
        {message.uid === user.uid ? (
            <div className="bg-green-100 hover:bg-green-500 hover:text-white mb-2 rounded-l-lg ml-auto p-2 max-w-[70%] shadow-md break-words"  title={`Created at: ${formattedDate}`}>
                <h1>{message.text}</h1>
            </div>
        ) : (
            <div className="bg-red-100 hover:bg-red-400 hover:text-white mb-2 rounded-r-lg mr-auto p-2 max-w-[70%] shadow-md break-words"  title={`Created at: ${formattedDate}`}>
                <h1>{message.text}</h1>
            </div>
        )}
        </div>
    );
}

MessageComponent.propTypes = {
    message: PropTypes.shape({
      uid: PropTypes.string,
      text: PropTypes.string,
      createdAt: PropTypes.number,
    }).isRequired,
  };

export default MessageComponent;