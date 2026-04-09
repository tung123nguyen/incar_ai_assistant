import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, CarFront, User, Loader2 } from 'lucide-react';
import { useStore } from '../store';

const ChatPanel = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { chatHistory, sendMessage, isAgentTyping } = useStore();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAgentTyping]);

  // Sinh thẻ xử lý Web Speech API
  let recognition = null;
  if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'vi-VN';
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText(transcript);
      setIsListening(false);
      // Gửi luôn lập tức
      sendMessage(transcript);
      setText('');
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden border-white/20 relative">
      <div className="bg-white/10 p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-vinfast-blue flex items-center justify-center flex-shrink-0 shadow-lg shadow-vinfast-blue/30">
          <CarFront className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">VinFast Assistant</h2>
          <div className="text-xs text-vinfast-accent/80 flex items-center gap-1.5 font-medium">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Always Real-time
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-8 space-y-6">
        {chatHistory.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1.5 opacity-60">
                 {m.role === 'agent' ? <CarFront size={12}/> : <User size={12}/>}
                 <span className="text-[10px] uppercase font-bold tracking-wider">{m.role === 'agent' ? 'ViVi' : 'You'}</span>
              </div>
              <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-md ${
                m.role === 'user' 
                  ? 'bg-vinfast-blue text-white rounded-br-sm' 
                  : 'bg-white/10 text-white border border-white/10 rounded-bl-sm backdrop-blur-md'
              }`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isAgentTyping && (
          <div className="flex items-center gap-2 text-vinfast-accent opacity-80 pt-2 px-2">
            <Loader2 className="animate-spin w-4 h-4"/>
            <span className="text-sm font-medium">Đang xử lý thông tin...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2 bg-black/40 rounded-full p-2 border border-white/10 focus-within:border-vinfast-accent/50 transition-colors">
          <button 
            onClick={toggleListen}
            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-gray-400'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nói hoặc nhập lệnh thoại (VD: Bật điều hòa)" 
            className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30 text-[15px]" 
          />
          
          <button 
            onClick={handleSend}
            disabled={!text.trim() || isAgentTyping}
            className="p-2.5 rounded-full bg-vinfast-blue hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-vinfast-blue flex items-center justify-center shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
