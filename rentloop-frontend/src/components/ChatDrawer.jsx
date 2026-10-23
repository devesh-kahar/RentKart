import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, MessageSquare, Clock } from 'lucide-react';
import { chatApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ChatDrawer = ({ context, onClose }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  const bookingId = context?.bookingId || context?.id || 201;
  const targetEmail = context?.ownerEmail || context?.renterEmail || 'sarah.owner@university.edu';
  const targetName = context?.ownerName || context?.renterName || 'Sarah Chen';
  const listingTitle = context?.listingTitle || context?.title || 'Rental Item';

  useEffect(() => {
    loadChatHistory();
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    const list = await chatApi.getHistory(bookingId);
    setMessages(list);
  };

  const handleSend = async (textToSend) => {
    const content = textToSend || inputVal;
    if (!content.trim()) return;

    const saved = await chatApi.sendMessage(
      bookingId,
      currentUser.email,
      currentUser.name,
      targetEmail,
      content.trim()
    );

    setMessages(prev => [...prev, saved]);
    setInputVal('');

    // If simulating conversation, trigger a realistic reply after 1.5 seconds if talking to another user
    if (targetEmail !== currentUser.email && messages.length <= 4) {
      setTimeout(async () => {
        const reply = await chatApi.sendMessage(
          bookingId,
          targetEmail,
          targetName,
          currentUser.email,
          "Great! That works for me. Looking forward to meeting at campus for the handover."
        );
        setMessages(prev => [...prev, reply]);
      }, 1500);
    }
  };

  const quickChips = [
    "Is this still available?",
    "Can we meet at Library lobby at 10 AM?",
    "Does it come with the original charger/cables?",
    "Can you do a multi-day discount?"
  ];

  return (
    <div id="chat-drawer-container" className="chat-drawer">
      {/* Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{targetName}</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
              Re: {listingTitle}
            </div>
          </div>
        </div>
        <button id="btn-close-chat" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--slate-400)', margin: 'auto', fontSize: '0.85rem' }}>
            <MessageSquare size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
            Start the negotiation! Agree on campus meeting location and handover time.
          </div>
        ) : (
          messages.map(m => {
            const isMine = m.senderEmail === currentUser?.email;
            return (
              <div 
                key={m.id} 
                className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}
              >
                {!isMine && (
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.15rem' }}>
                    {m.senderName || targetName}
                  </div>
                )}
                <div>{m.content}</div>
                <div className="chat-bubble-time">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      <div style={{ 
        padding: '0.4rem 0.6rem', 
        background: 'white', 
        borderTop: '1px solid var(--slate-100)',
        display: 'flex', 
        gap: '0.35rem', 
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              background: 'var(--slate-100)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--slate-700)',
              flexShrink: 0
            }}
            onClick={() => handleSend(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <input
          id="input-chat-message"
          type="text"
          className="form-input"
          style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
          placeholder="Type message or offer..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          id="btn-send-chat-message"
          className="brand-icon-wrapper"
          style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '50%' }}
          onClick={() => handleSend()}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};
