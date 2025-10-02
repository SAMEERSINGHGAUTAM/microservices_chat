import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { getConversations, getMessages, sendMessage } from '../services/chat.service';
import { uploadMedia } from '../services/media.service';

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [media, setMedia] = useState(null);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
        if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    };

    loadConversations();

    // Initialize socket connection
    socket.current = io('http://localhost:3000');

    socket.current.on('connect', () => {
      console.log('Connected to socket');
    });

    socket.current.on('message', (message) => {
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        try {
          const data = await getMessages(selectedConversation._id);
          setMessages(data);
        } catch (err) {
          console.error('Failed to load messages:', err);
        }
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!selectedConversation || (!newMessage.trim() && !media)) return;

    try {
      // If media is selected, upload it first
      if (media) {
        const mediaResponse = await uploadMedia(media, selectedConversation._id);
        console.log('Media uploaded:', mediaResponse);
        setMedia(null);
      }

      // Send message
      if (newMessage.trim()) {
        const message = await sendMessage(selectedConversation._id, newMessage);
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        
        // Emit message to socket
        socket.current.emit('message', message);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleMediaUpload = (e) => {
    if (e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  return (
    <div className="chat-page">
      <div className="conversations-list">
        <h3>Conversations</h3>
        {conversations.map(conversation => (
          <div 
            key={conversation._id} 
            className={`conversation-item ${selectedConversation?._id === conversation._id ? 'selected' : ''}`}
            onClick={() => setSelectedConversation(conversation)}
          >
            {conversation.name || conversation.participants.map(p => p.name).join(', ')}
          </div>
        ))}
      </div>
      
      <div className="chat-container">
        {selectedConversation ? (
          <>
            <div className="messages-container">
              <h3>{selectedConversation.name || selectedConversation.participants.map(p => p.name).join(', ')}</h3>
              {messages.map(message => (
                <div key={message._id} className="message">
                  <strong>{message.sender.name}:</strong> {message.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <input
                type="file"
                onChange={handleMediaUpload}
                accept="image/*,video/*,audio/*,.pdf"
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-conversation-selected">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
