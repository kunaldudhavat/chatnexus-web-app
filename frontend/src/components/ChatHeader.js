import React from 'react';
import { useSelector } from 'react-redux';
import { BiVideo, BiPhone, BiSearch } from 'react-icons/bi';
import { FiUser, FiUsers } from 'react-icons/fi';

const ChatHeader = ({ onSearchClick, onProfileClick, onGroupProfileClick }) => {
    const currentChat = useSelector((state) => state.chat.currentChat);
    const currentUser = useSelector((state) => state.auth.user);

    if (!currentChat || !currentUser) return null;

    const chatName = currentChat.isGroup
        ? currentChat.chatName
        : currentChat.users.find(user => user.id !== currentUser.id)?.name || 'User';

    const profileImage = currentChat.isGroup ? currentChat.chatImage : currentChat.users.find(user => user.id !== currentUser.id)?.profile?.image;

    const handleProfileClick = () => {
        if (currentChat.isGroup) {
            onGroupProfileClick(currentChat.id);
        } else {
            onProfileClick(currentChat.users.find(user => user.id !== currentUser.id)?.id);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 h-16 bg-gray-700 text-white border-b border-gray-700">
            <div className="flex items-center space-x-4">
                <div
                    className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                    onClick={handleProfileClick}
                >
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : currentChat.isGroup ? (
                        <FiUsers className="text-2xl text-gray-400" />
                    ) : (
                        <FiUser className="text-2xl text-gray-400" />
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{chatName}</h3>
                    <p className="text-sm text-gray-400">{currentChat.isGroup ? 'Group' : 'Online'}</p>
                </div>
            </div>
            <div className="flex space-x-4">
                <BiVideo className="text-2xl cursor-pointer" />
                <BiPhone className="text-2xl cursor-pointer" />
                <BiSearch className="text-2xl cursor-pointer" onClick={onSearchClick} />
            </div>
        </div>
    );
};

export default ChatHeader;