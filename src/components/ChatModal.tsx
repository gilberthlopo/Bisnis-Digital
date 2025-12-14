import { useState, useRef, useEffect } from 'react';
import { X, Send, User, Store } from 'lucide-react';

export type ChatMessage = {
  id: string;
  orderId: string;
  sender: 'customer' | 'shop';
  text: string;
  timestamp: string;
};

type ChatModalProps = {
  orderId: string;
  shopName: string;
  currentUserRole: 'customer' | 'shop';
  messages: ChatMessage[];
  onSendMessage: (orderId: string, text: string, sender: 'customer' | 'shop') => void;
  onClose: () => void;
};

export function ChatModal({ orderId, shopName, currentUserRole, messages, onSendMessage, onClose }: ChatModalProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for this order
  const orderMessages = messages.filter(msg => msg.orderId === orderId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [orderMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    onSendMessage(orderId, inputText, currentUserRole);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h3 className="text-white mb-1">{shopName}</h3>
            <p className="text-gray-400 text-sm">Order #{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orderMessages.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              <p className="mb-2">💬</p>
              <p>Belum ada pesan. Mulai percakapan!</p>
            </div>
          ) : (
            orderMessages.map((message) => {
              const isCurrentUser = message.sender === currentUserRole;
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'customer'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    }`}
                  >
                    {message.sender === 'customer' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Store className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div className={`flex-1 max-w-md ${isCurrentUser ? 'text-right' : ''}`}>
                    <div className="text-xs text-gray-500 mb-1">
                      {message.sender === 'customer' ? 'Pelanggan' : 'Toko'}
                    </div>
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        isCurrentUser
                          ? currentUserRole === 'customer'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                          : 'bg-gray-800 text-white border border-gray-700'
                      }`}
                    >
                      {message.text}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-800">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`px-6 py-3 bg-gradient-to-r ${
                currentUserRole === 'customer'
                  ? 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              } text-white rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send className="w-5 h-5" />
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
