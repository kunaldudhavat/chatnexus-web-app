import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchResults } from '../actions/searchActions';
import { CgClose } from "react-icons/cg";

const SearchSidebar = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.search.results);
    const messages = useSelector((state) => state.message.messages);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const currentUser = useSelector((state) => state.auth.user);
    const searchInputRef = useRef(null);
    const sidebarRef = useRef(null);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim() !== '') {
            const results = messages.filter((message) =>
                message.content.toLowerCase().includes(e.target.value.toLowerCase())
            );
            dispatch(setSearchResults(results));
        } else {
            dispatch(setSearchResults([]));
        }
    };

    const handleClickOutside = useCallback((event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        searchInputRef.current?.focus();
        return () => {
            dispatch(setSearchResults([]));
        };
    }, [dispatch]);

    return (
        <div ref={sidebarRef} className="h-full w-96 bg-gray-800 text-white flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gray-800 border-gray-700">
                <CgClose className="text-2xl cursor-pointer" onClick={onClose} />
                <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full ml-4 p-2 bg-gray-600 rounded"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                        <div
                            key={result.id}
                            className="p-2 bg-gray-700 mb-2 rounded cursor-pointer hover:bg-gray-800"
                            onClick={() => {
                                onClose();
                                // Scroll to the message in ChatMessages
                                setTimeout(() => {
                                    const messageElement = document.getElementById(`message-${result.id}`);
                                    if (messageElement) {
                                        messageElement.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }, 100);
                            }}
                        >
                            <p>{result.content}</p>
                            <span className="text-xs text-gray-400">{new Date(result.timestamp).toLocaleString()}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-[#667781]">Search for messages with {currentChat.isGroupChat ? currentChat.chatName : currentChat.users.find(user => user.id !== currentUser.id)?.name || 'User'}</p>
                )}
            </div>
        </div>
    );
};

export default SearchSidebar;
