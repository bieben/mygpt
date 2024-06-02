import './Chat.css';
import '../../normal.css';
import { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { useStateValue } from '../../StateProvider'
import App_Logo from '../../openai_logo.svg'
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Header from './Header';

function Chat() {
  const [{ conversations, user }, dispatch] = useStateValue();
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "How can I help you today?"
  }]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  function clearChat() {
    setChatLog([{
      user: "gpt",
      message: "How can I help you today?"
    }]);
    setCurrentConversationId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);
    const messages = chatLogNew.map((message) => message.message).join("\n");

    const response = await fetch("http://localhost:3080", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages
      })
    });
    const data = await response.json();
    const newChatLog = [...chatLogNew, { user: "gpt", message: `${data.message}` }];
    setChatLog(newChatLog);

    if (user) {
      if (currentConversationId) {
        const conversationRef = doc(db, 'users', user.uid, 'conversations', currentConversationId);
        await updateDoc(conversationRef, {
          messages: newChatLog,
          timestamp: serverTimestamp(),
        });
      } else {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'conversations'), {
          messages: newChatLog,
          timestamp: serverTimestamp(),
        });
        setCurrentConversationId(docRef.id);
        dispatch({
          type: 'ADD_CONVERSATION',
          conversation: {
            id: docRef.id,
            messages: newChatLog,
          }
        });
      }
    }
  }

  async function handleDeleteConversation(conversationId) {
    if (user) {
      const conversationRef = doc(db, 'users', user.uid, 'conversations', conversationId);
      await deleteDoc(conversationRef);
      dispatch({
        type: 'DELETE_CONVERSATION',
        id: conversationId,
      });
      if (conversationId === currentConversationId) {
        clearChat();
      }
    }
  }

  useEffect(() => {
    if (user) {
      const fetchConversations = async () => {
        const conversationsRef = collection(db, 'users', user.uid, 'conversations');
        const q = query(conversationsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const conversationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({
          type: 'SET_CONVERSATIONS',
          conversations: conversationsData,
        });
      };
      fetchConversations();
    }
  }, [user, dispatch]);

  const handleConversationClick = (conversation) => {
    setChatLog(conversation.messages);
    setCurrentConversationId(conversation.id);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="main">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="conversations-list">
          {conversations.map(conversation => (
            <div key={conversation.id} className="conversation-item">
              <button onClick={() => handleConversationClick(conversation)}>
                <span className='conversation-item-text'>
                {truncateText(conversation.messages[1]?.message || conversation.messages[0]?.message, 17)}
                </span>
              </button>
              <button onClick={() => handleDeleteConversation(conversation.id)}>Delete</button>
            </div>
          ))}
        </div>
      </aside>
      <section className="chatbox">
        <Navbar>
          <Header />
        </Navbar>
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <Navbar>
          <div className="chat-input-holder">
            <form onSubmit={handleSubmit}>
              <input value={input}
                placeholder='Message ChatGPT'
                onChange={(e) => setInput(e.target.value)}
                className="chat-input-textarea"></input>
            </form>
          </div>
        </Navbar>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
          {message.user === "gpt" ?
            (<img className='icon-md' src={App_Logo} alt='openai-logo' />) : (
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" className="icon-md" alt='user-logo' />
            )
          }
        </div>
        <div className="message">
          {message.message}
        </div>
      </div>
    </div>
  );
}

export default Chat;
