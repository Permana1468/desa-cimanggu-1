import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Plus, Send, MoreVertical, Phone, Video, 
    Smile, Paperclip, ChevronLeft, Check, CheckCheck, Clock 
} from 'lucide-react';

const Messages = () => {
    // ── Mock Data ────────────────────────────────────────────────────────
    const [conversations] = useState([
        { id: 1, name: 'Siti Rahayu', role: 'Sekretaris Desa', lastMsg: 'Sudah saya kirim laporannya pak.', time: '09:41', unread: 2, online: true, avatar: '/images/avatar-1.jpg' },
        { id: 2, name: 'Budi Santoso', role: 'Kaur Keuangan', lastMsg: 'Anggaran Q1 sudah cair.', time: 'Yesterday', unread: 0, online: false, avatar: '' },
        { id: 3, name: 'Kader Posyandu', role: 'Staff Kesehatan', lastMsg: 'Jadwal imunisasi besok jam 8.', time: 'Monday', unread: 0, online: true, avatar: '' },
        { id: 4, name: 'LPM Cimanggu', role: 'Organisasi Desa', lastMsg: 'Foto proyek fisik sudah diupload.', time: '12/04', unread: 0, online: false, avatar: '' },
    ]);

    const [mockMessages, setMockMessages] = useState([
        { id: 1, sender: 'them', text: 'Selamat pagi pak kades.', time: '08:00', status: 'read' },
        { id: 2, sender: 'me', text: 'Pagi bu Siti. Ada yang bisa dibantu?', time: '08:05', status: 'read' },
        { id: 3, sender: 'them', text: 'Ini terkait laporan inventaris desa bulan maret.', time: '08:10', status: 'read' },
        { id: 4, sender: 'them', text: 'Sudah saya kirim laporannya pak. Silahkan dicek di dashboard.', time: '09:41', status: 'delivered' },
    ]);

    // ── UI States ────────────────────────────────────────────────────────
    const [selectedId, setSelectedId] = useState(null);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mockMessages]);

    const handleSelectChat = (id) => {
        setSelectedId(id);
        setIsMobileChatOpen(true);
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        setMockMessages([...mockMessages, {
            id: Date.now(),
            sender: 'me',
            text: inputText,
            time: timeStr,
            status: 'sent'
        }]);
        setInputText('');
    };

    const activeChat = conversations.find(c => c.id === selectedId);

    return (
        <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] bg-dark-panel backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
            
            {/* ── LEFT PANEL: CHAT LIST ────────────────────────────────────── */}
            <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-white/5 flex flex-col bg-white/[0.02]
                            ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
                
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-white tracking-tight">Pesan Digital</h2>
                        <button className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20 hover:scale-105 transition-all">
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Cari percakapan..."
                            className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.08] transition-all placeholder:text-text-faint"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
                    {conversations.map((chat) => (
                        <div 
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 mb-1 group
                                       ${selectedId === chat.id 
                                            ? 'bg-blue-600/15 border border-blue-500/20' 
                                            : 'hover:bg-white/[0.05] border border-transparent'}`}
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-lg text-white shadow-xl overflow-hidden">
                                    {chat.avatar ? <img src={chat.avatar} className="w-full h-full object-cover" /> : chat.name.charAt(0)}
                                </div>
                                {chat.online && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-dark-panel rounded-full shadow-glow" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className={`text-[13.5px] font-black tracking-tight truncate ${selectedId === chat.id ? 'text-blue-400' : 'text-white'}`}>
                                        {chat.name}
                                    </h4>
                                    <span className="text-[10px] text-text-faint font-bold uppercase tracking-tighter shrink-0">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[11.5px] text-text-muted truncate leading-normal pr-4">{chat.lastMsg}</p>
                                    {chat.unread > 0 && (
                                        <div className="bg-blue-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center shadow-lg">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT PANEL: CHAT WINDOW ─────────────────────────────────── */}
            <div className={`flex-1 flex flex-col bg-white/[0.01] overflow-hidden
                            ${!isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
                
                {selectedId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:px-8 md:py-5 border-b border-white/5 flex items-center justify-between bg-dark-overlay backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setIsMobileChatOpen(false)}
                                    className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white mr-1"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                
                                <div className="relative">
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg overflow-hidden">
                                        {activeChat.avatar ? <img src={activeChat.avatar} className="w-full h-full object-cover" /> : activeChat.name.charAt(0)}
                                    </div>
                                    {activeChat.online && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-dark-panel rounded-full shadow-glow" />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-[14px] md:text-[15px] font-black text-white truncate leading-none mb-1">{activeChat.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${activeChat.online ? 'text-green-500' : 'text-text-muted'}`}>
                                            {activeChat.online ? 'Sedang Aktif' : 'Terakhir dilihat 2jam lalu'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-4 text-white/40">
                                <button className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-all hidden sm:block"><Phone size={18} /></button>
                                <button className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-all hidden sm:block"><Video size={18} /></button>
                                <button className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-all"><MoreVertical size={18} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6">
                            {mockMessages.map((msg, idx) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-3xl relative
                                                   ${msg.sender === 'me' 
                                                        ? 'bg-blue-600 border border-blue-500 text-white rounded-tr-none shadow-[0_10px_25px_-5px_rgba(59,130,246,0.3)]' 
                                                        : 'bg-white/[0.05] border border-white/5 text-text-main rounded-tl-none'}`}>
                                        <p className="text-[13px] md:text-[14px] leading-relaxed font-medium">
                                            {msg.text}
                                        </p>
                                        
                                        <div className={`mt-2 flex items-center justify-end gap-1.5 opacity-60`}>
                                            <span className="text-[8.5px] font-black uppercase tracking-tighter">
                                                {msg.time}
                                            </span>
                                            {msg.sender === 'me' && (
                                                <span className="text-white">
                                                    {msg.status === 'read' ? <CheckCheck size={10} /> : <Check size={10} />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Sub-label for sender name only for groups, skip for direct */}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:p-6 border-t border-white/5 bg-dark-overlay backdrop-blur-xl">
                            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/5 rounded-[24px] p-2 pr-2.5 focus-within:border-blue-500/30 focus-within:bg-white/[0.08] transition-all">
                                <button className="p-2.5 text-text-muted hover:text-blue-400 rounded-full transition-colors"><Smile size={20} /></button>
                                <button className="p-2.5 text-text-muted hover:text-blue-400 rounded-full transition-colors"><Paperclip size={20} /></button>
                                
                                <input 
                                    type="text" 
                                    placeholder="Ketik pesan anda..."
                                    className="flex-1 bg-transparent border-none focus:outline-none text-[13.5px] text-white py-2"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />

                                <button 
                                    onClick={handleSendMessage}
                                    className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300
                                               ${inputText.trim() ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-text-faint'}`}
                                >
                                    <Send size={18} className={inputText.trim() ? 'translate-x-[2px]' : ''} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                        <div className="w-24 h-24 rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                             <MessageSquare className="w-10 h-10 text-blue-500 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Selamat Datang di Hub Komunikasi</h3>
                        <p className="text-sm text-text-muted max-w-sm leading-relaxed">
                            Hubungkan koordinasi antar perangkat desa Cimanggu I dalam satu platform manajemen digital yang terintegrasi.
                        </p>
                        <div className="mt-8 px-5 py-2 rounded-full border border-white/5 text-[10px] uppercase font-black tracking-widest text-[#3b82f6]">
                           <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-ping" />
                           Platform Aman & Terenkripsi
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
