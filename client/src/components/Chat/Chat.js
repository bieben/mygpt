import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../../contexts/context';
import { db } from '../../firebase/firebaseConfig';
import AppLogo from '../../svg/openai_logo.svg';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Header from './Header';
import ChatMessage from './ChatMessage';
import '../../styles/Chat.css';
import '../../styles/normal.css';
import sendSvg from '../../svg/send_icon.svg';

function Chat() {
  const [{ conversations, user }, dispatch] = useStateValue();
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "How can I help you today?"
  }]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();



  // Clears the chat log and resets the conversation ID
  function clearChat() {
    setChatLog([{
      user: "gpt",
      message: "How can I help you today?"
    }]);
    setCurrentConversationId(null);
  }

  // Handles form submission and updates chat log
  async function handleSubmit(e) {
    e.preventDefault();
    const updatedChatLog = [...chatLog, { user: "me", message: input }];
    setInput("");
    setChatLog(updatedChatLog);
    setLoading(true);

    // Reset textarea height after submitting
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const messages = updatedChatLog.map((msg) => msg.message).join("\n");

    try {
      const response = await fetch("https://my-gpt-server-8a49a44d5273.herokuapp.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messages }),
      });
      const data = await response.json();
      const newChatLog = [...updatedChatLog, { user: "gpt", message: data.message }];
      setChatLog(newChatLog);
      setLoading(false);

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
            },
          });
        }
      }


    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  // Deletes a conversation from the database and updates the state
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

  // Fetches conversations from the database on component mount
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

  // Handles conversation click to load messages
  const handleConversationClick = (conversation) => {
    setChatLog(conversation.messages);
    setCurrentConversationId(conversation.id);
  };

  // Truncates text to a specified length
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Adjust height of textarea when typing
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Navigate to admin page if have permission
  const jumpToAdmin = () => {
    navigate('/admin');
  }

  return (
    <div className="main">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="conversations-list">
          {conversations.map(conversation => (
            <div key={conversation.id} className={`conversation-item ${conversation.id === currentConversationId ? 'active' : ''}`}>
              <button onClick={() => handleConversationClick(conversation)} className='conversation-item-button'>
                <span className="conversation-item-text">
                  {truncateText(conversation.messages[1]?.message || conversation.messages[0]?.message, 14)}
                </span>
              </button>
              <button onClick={() => handleDeleteConversation(conversation.id)}>Delete</button>
            </div>
          ))}
        </div>
        <div className="admin-button">
          <button onClick={jumpToAdmin}>
            Admin
          </button>
        </div>
      </aside>
      <section className="chatbox">
        <Header />
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {loading && (
            <div className='chat-message chatgpt'>
              <div className="chat-message-center">
                <div className='avatar chatgpt'>
                  <img className="avatar-img" src={AppLogo} alt="OpenAI Logo" />
                </div>
                <div className="message">
                  Loading...
                </div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="textarea-container">
            <textarea
              ref={textareaRef}
              value={input}
              placeholder="Message ChatGPT"
              onChange={(e) => { setInput(e.target.value); adjustTextareaHeight(); }}
              className="chat-input-textarea"
              rows="1"
            />
            <button type="submit" className="chat-submit-button">
              <img src={sendSvg} alt="Send" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Chat;
