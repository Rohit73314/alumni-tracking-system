import { useState, useEffect, useRef } from "react";
import { Search, Send } from "lucide-react";
import Navigation from "../components/Navigation";

const initialConversations = [
  {
    id: '1',
    participantId: '1',
    participantName: 'Sarah Chen',
    participantImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    participantPosition: 'Senior Software Engineer',
    participantCompany: 'Google',
    lastMessage: 'That sounds great! I\'d be happy to share some insights about the tech industry.',
    lastMessageTime: '2024-05-08T14:30:00',
    unreadCount: 2
  },
  {
    id: '2',
    participantId: '2',
    participantName: 'Michael Rodriguez',
    participantImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    participantPosition: 'Investment Analyst',
    participantCompany: 'Goldman Sachs',
    lastMessage: 'Thanks for reaching out! Let\'s schedule a call next week.',
    lastMessageTime: '2024-05-07T16:20:00',
    unreadCount: 0
  },
  {
    id: '3',
    participantId: '4',
    participantName: 'David Kumar',
    participantImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    participantPosition: 'Product Manager',
    participantCompany: 'Tesla',
    lastMessage: 'I saw your profile and would love to connect about product management opportunities.',
    lastMessageTime: '2024-05-06T10:15:00',
    unreadCount: 1
  }
];

const initialMessages = {
  '1': [
    {
      id: '1',
      sender: 'user',
      text: 'Hi Sarah! I saw your profile and I\'m really interested in learning more about your work in AI and machine learning.',
      timestamp: '2024-05-08T14:00:00'
    },
    {
      id: '2',
      sender: 'other',
      text: 'Hi! Thanks for reaching out. I\'d be happy to chat about my experience.',
      timestamp: '2024-05-08T14:15:00'
    },
    {
      id: '3',
      sender: 'user',
      text: 'That would be wonderful! What are some of the most exciting projects you\'re working on at Google?',
      timestamp: '2024-05-08T14:20:00'
    },
    {
      id: '4',
      sender: 'other',
      text: 'That sounds great! I\'d be happy to share some insights about the tech industry.',
      timestamp: '2024-05-08T14:30:00'
    }
  ],
  '2': [
    {
      id: '1',
      sender: 'user',
      text: 'Hello Michael! I\'m interested in learning about investment banking. Would you be open to a quick chat?',
      timestamp: '2024-05-07T15:00:00'
    },
    {
      id: '2',
      sender: 'other',
      text: 'Thanks for reaching out! Let\'s schedule a call next week.',
      timestamp: '2024-05-07T16:20:00'
    }
  ],
  '3': [
    {
      id: '1',
      sender: 'other',
      text: 'I saw your profile and would love to connect about product management opportunities.',
      timestamp: '2024-05-06T10:15:00'
    }
  ]
};

export default function Network() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load from localStorage or use initial data
    const savedConversations = localStorage.getItem('conversations');
    const savedMessages = localStorage.getItem('messages');
    
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      setSelectedConversation(parsed[0]);
    } else {
      setConversations(initialConversations);
      setSelectedConversation(initialConversations[0]);
      localStorage.setItem('conversations', JSON.stringify(initialConversations));
    }
    
    if (savedMessages) {
      setAllMessages(JSON.parse(savedMessages));
    } else {
      setAllMessages(initialMessages);
      localStorage.setItem('messages', JSON.stringify(initialMessages));
    }
  }, []);

  // Scroll to bottom when messages change or conversation changes
  useEffect(() => {
    scrollToBottom();
  }, [allMessages, selectedConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString()
    };

    // Update messages
    const updatedMessages = {
      ...allMessages,
      [selectedConversation.id]: [
        ...(allMessages[selectedConversation.id] || []),
        newMessage
      ]
    };
    setAllMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));

    // Update conversation's last message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: messageText,
          lastMessageTime: new Date().toISOString()
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));

    // Update selected conversation
    setSelectedConversation({
      ...selectedConversation,
      lastMessage: messageText,
      lastMessageTime: new Date().toISOString()
    });

    setMessageText("");
  };

  const handleSelectConversation = (conversation) => {
    // Mark as read
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversation.id) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    });
    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    
    setSelectedConversation({ ...conversation, unreadCount: 0 });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participantCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = selectedConversation ? (allMessages[selectedConversation.id] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
          <div className="grid grid-cols-12 h-full">
            {/* Conversations sidebar */}
            <div className="col-span-4 border-r border-gray-200 flex flex-col">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex-shrink-0">
                <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-300" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-4 border-b border-gray-200 cursor-pointer transition-all hover:bg-indigo-50 ${
                      selectedConversation?.id === conversation.id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={conversation.participantImage}
                        alt={conversation.participantName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{conversation.participantName}</h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1 truncate">
                          {conversation.participantPosition} • {conversation.participantCompany}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate flex-1">{conversation.lastMessage}</p>
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{formatTimestamp(conversation.lastMessageTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Messages area */}
            <div className="col-span-8 flex flex-col h-full">
              {selectedConversation ? (
                <>
                  <div className="bg-white border-b border-gray-200 p-6 shadow-sm flex-shrink-0">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedConversation.participantImage}
                        alt={selectedConversation.participantName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.participantName}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.participantPosition} at {selectedConversation.participantCompany}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4"
                    style={{ maxHeight: 'calc(100vh - 380px)' }}
                  >
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender !== "user" && (
                          <img
                            src={selectedConversation.participantImage}
                            alt={selectedConversation.participantName}
                            className="w-8 h-8 rounded-full object-cover mr-3 mt-1 flex-shrink-0"
                          />
                        )}
                        <div
                          className={`max-w-md px-4 py-3 rounded-2xl ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="break-words">{message.text}</p>
                          <div className="flex items-center justify-end mt-1 space-x-2">
                            <span className={`text-xs ${message.sender === "user" ? "text-indigo-200" : "text-gray-500"}`}>
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                        {message.sender === "user" && (
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                            alt="You"
                            className="w-8 h-8 rounded-full object-cover ml-3 mt-1 flex-shrink-0"
                          />
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all flex-shrink-0"
                      >
                        <Send className="h-5 w-5" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-xl">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}