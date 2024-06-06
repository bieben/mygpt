import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';
import '../../styles/Admin.css'; // Assuming you create a CSS file for styling

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [messageCounts, setMessageCounts] = useState([]);
    const [alertShown, setAlertShown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    navigate('/chat');
                } else {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().isAdmin) {
                        fetchUsers();
                    } else if (!alertShown) {
                        setAlertShown(true);
                        alert('You have no permission to access this page!');
                        navigate('/chat');
                    }
                }
            });
        };

        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);

                if (usersSnapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }

                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    email: doc.data().email,
                }));

                setUsers(usersList);
                loadMessageCounts(usersList);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching users:', err);
            }
        };

        const loadMessageCounts = async (usersList) => {
            const updatedUsers = await Promise.all(usersList.map(async (user) => {
                const conversationsCollection = collection(db, 'users', user.id, 'conversations');
                const conversationsSnapshot = await getDocs(conversationsCollection);

                let totalMessages = 0;
                for (const conversationDoc of conversationsSnapshot.docs) {
                    const conversationData = conversationDoc.data();
                    const messages = conversationData.messages || [];
                    totalMessages += messages.length;
                }

                return { ...user, messageCount: totalMessages };
            }));

            setUsers(updatedUsers);
            setMessageCounts(updatedUsers.map(user => user.messageCount));
            setLoading(false);
        };

        checkAuth();
    }, [alertShown, navigate]);

    const data = users.map(user => ({
        email: user.email,
        messageCount: user.messageCount
    }));

    return (
        <div className="admin-dashboard">
            <h1 className='admin-title'>Admin Dashboard</h1>
            <button className="go-to-chat-button" onClick={() => navigate('/chat')}>Go to Chat</button>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {error && <p className="error">{error}</p>}
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="email" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="messageCount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;