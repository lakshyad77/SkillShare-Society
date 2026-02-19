import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user) {
            const newSocket = io('http://localhost:5000');

            newSocket.emit('join_room', user._id); // Assuming user._id is the ID

            setSocket(newSocket);

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
