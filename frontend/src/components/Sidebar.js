import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiBot, BiPlus, BiDotsVerticalRounded, BiSearch, BiArrowBack } from 'react-icons/bi';
import { FiUser, FiUsers } from 'react-icons/fi';
import { Menu } from '@headlessui/react';
import { ResizableBox } from 'react-resizable';
import { HiChat } from "react-icons/hi";
import { fetchChats, createChat, setCurrentChat, createGroupChat } from '../actions/chatActions';
import { userApi } from '../api/api';
import { logout } from '../actions/authActions';
import Profile from './Profile';
import AddGroupMembers from './AddGroupMembers';
import GroupDetails from './GroupDetails';
import 'react-resizable/css/styles.css';

const Sidebar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [setIsCreatingGroup] = useState(false);
    const [groupMembers, setGroupMembers] = useState([]);
    const [setGroupDetails] = useState(null);
    const [currentView, setCurrentView] = useState('chats');

    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);
    const currentUser = useSelector((state) => state.auth.user);
    const currentChat = useSelector((state) => state.chat.currentChat);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedChats = await dispatch(fetchChats());
            console.log('Fetched chats in Sidebar:', fetchedChats);
            const storedChatId = localStorage.getItem('currentChatId');
            if (storedChatId && fetchedChats.length > 0) {
                dispatch(setCurrentChat(parseInt(storedChatId)));
            }
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (currentChat) {
            localStorage.setItem('currentChatId', currentChat.id);
        }
    }, [currentChat]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('currentChatId');
    };

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 0) {
            try {
                const response = await userApi.searchUsers(query);
                if (Array.isArray(response)) {
                    const filteredResults = response.filter(result => {
                        if (result.isGroup) {
                            return result.users.some(user => user.id === currentUser.id);
                        }
                        return result.id !== currentUser.id;
                    });
                    setSearchResults(filteredResults);
                } else {
                    console.error('Unexpected response format:', response);
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Error searching users:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleResultClick = async (result) => {
        try {
            if (result.isGroup) {
                dispatch(setCurrentChat(result.id));
            } else {
                const existingChat = chats.find(chat =>
                    chat.users.some(user => user.id === result.id) && !chat.isGroup
                );

                if (existingChat) {
                    dispatch(setCurrentChat(existingChat.id));
                } else {
                    const newChat = await dispatch(createChat(result.id));
                    dispatch(setCurrentChat(newChat.id));
                }
            }

            setSearchQuery('');
            setSearchResults([]);
            setCurrentView('chats');
        } catch (error) {
            console.error('Error creating or fetching chat:', error);
        }
    };

    const handleChatClick = (chatId) => {
        dispatch(setCurrentChat(chatId));
    };
    const addGroupMember = (member) => {
        setGroupMembers(prev => [...prev, member]);
    };

    const proceedToGroupDetails = () => {
        setCurrentView('groupDetails');
    };
    const createGroup = async (details) => {
        try {
            const payload = {
                userIds: groupMembers.map(user => user.id),
                chatName: details.name,
                chatImage: details.image,
            };
            await dispatch(createGroupChat(payload));
            setGroupMembers([]);
            setGroupDetails(null);
            setIsCreatingGroup(false);
            setCurrentView('chats');
        } catch (error) {
            console.error('Error creating group chat:', error);
        }
    };

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <ResizableBox
            width={400}
            height={Infinity}
            minConstraints={[300, Infinity]}
            maxConstraints={[600, Infinity]}
            axis="x"
            resizeHandles={['e']}
            className="bg-gray-900 text-white flex flex-col"
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                        <HiChat className="text-3xl" />
                        <h2 className="text-xl font-bold">ChatNexus</h2>
                    </div>
                    <div className="flex space-x-3">
                        <BiBot className="text-2xl cursor-pointer" />
                        <BiPlus className="text-2xl cursor-pointer" onClick={() => setCurrentView('newChat')} />
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="inline-flex justify-center w-full text-sm font-medium text-white">
                                    <BiDotsVerticalRounded className="text-2xl cursor-pointer" />
                                </Menu.Button>
                            </div>
                            <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-gray-800 border border-gray-700 divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => setShowProfile(true)}
                                                className={`${
                                                    active ? 'bg-gray-700 text-white' : 'text-gray-300'
                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                            >
                                                Profile
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`${
                                                    active ? 'bg-gray-700 text-white' : 'text-gray-300'
                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                            >
                                                Log out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
                {showProfile ? (
                    <Profile closeProfile={() => setShowProfile(false)} />
                ) : currentView === 'newChat' ? (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-gray-700 flex items-center">
                            <BiArrowBack className="text-2xl cursor-pointer mr-4" onClick={() => setCurrentView('chats')} />
                            <h2 className="text-xl font-bold text-white">New Chat</h2>
                        </div>
                        <div className="p-4">
                            <div className="relative">
                                <BiSearch className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for users or groups"
                                    className="w-full bg-gray-800 rounded-full p-2 pl-10 text-white focus:outline-none"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="p-4">
                            <button
                                className="w-full bg-green-600 text-white rounded-full p-2 flex items-center justify-center"
                                onClick={() => setCurrentView('addGroupMembers')}
                            >
                                <FiUsers className="text-2xl mr-2" />
                                New Group
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800"
                                    onClick={() => handleResultClick(result)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
                                            {result.profile && result.profile.image ? (
                                                <img
                                                    src={result.profile.image}
                                                    alt="Profile"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : result.isGroup ? (
                                                result.chatImage ? (
                                                    <img
                                                        src={result.chatImage}
                                                        alt="Group"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <FiUsers className="text-2xl text-gray-400" />
                                                )
                                            ) : (
                                                <FiUser className="text-2xl text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{result.isGroup ? result.chatName : result.name}</h3>
                                            <p className="text-sm text-gray-400">{result.email || (result.isGroup ? 'Group' : '')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : currentView === 'addGroupMembers' ? (
                    <AddGroupMembers
                        onAddMember={addGroupMember}
                        onNext={proceedToGroupDetails}
                        onBack={() => setCurrentView('newChat')}
                        currentUser={currentUser}
                    />
                ) : currentView === 'groupDetails' ? (
                    <GroupDetails onCreateGroup={createGroup} onBack={() => setCurrentView('addGroupMembers')} />
                ) : (
                    <>
                        <div className="p-4 border-b border-gray-700">
                            <div className="relative">
                                <BiSearch className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search or start new chat"
                                    className="w-full bg-gray-800 rounded-full p-2 pl-10 text-white focus:outline-none"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className={`p-4 flex items-center justify-between cursor-pointer ${
                                            currentChat && currentChat.users.some(u => u.id === result.id)
                                                ? 'bg-gray-700'
                                                : 'hover:bg-gray-800'
                                        }`}
                                        onClick={() => handleResultClick(result)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
                                                {result.profile && result.profile.image ? (
                                                    <img
                                                        src={result.profile.image}
                                                        alt="Profile"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : result.isGroup ? (
                                                    result.chatImage ? (
                                                        <img
                                                            src={result.chatImage}
                                                            alt="Group"
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <FiUsers className="text-2xl text-gray-400" />
                                                    )
                                                ) : (
                                                    <FiUser className="text-2xl text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{result.isGroup ? result.chatName : result.name}</h3>
                                                <p className="text-sm text-gray-400">{result.email || (result.isGroup ? 'Group' : '')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : chats.length > 0 ? (
                                chats.map((chat) => {
                                    console.log('Rendering chat:', chat);
                                    const chatName = chat.isGroup
                                        ? chat.chatName
                                        : chat.users.find(user => user.id !== currentUser.id)?.name || 'User';
                                    const profileImage = chat.isGroup
                                        ? chat.chatImage
                                        : chat.users.find(user => user.id !== currentUser.id)?.profile?.image;
                                    return (
                                        <div
                                            key={chat.id}
                                            className={`p-4 flex items-center justify-between cursor-pointer ${
                                                currentChat && currentChat.id === chat.id ? 'bg-gray-700' : 'hover:bg-gray-800'
                                            }`}
                                            onClick={() => handleChatClick(chat.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
                                                    {chat.isGroup ? (
                                                        profileImage ? (
                                                            <img
                                                                src={profileImage}
                                                                alt="Group"
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <FiUsers className="text-2xl text-gray-400" />
                                                        )
                                                    ) : profileImage ? (
                                                        <img
                                                            src={profileImage}
                                                            alt="Profile"
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <FiUser className="text-2xl text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">{chatName}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        {chat.latestMessage
                                                            ? `${chat.latestMessage.content.substring(0, 30)}${chat.latestMessage.content.length > 30 ? '...' : ''} - ${new Date(chat.latestMessage.timestamp).toLocaleTimeString()}`
                                                            : 'No messages yet'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No chats available
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </ResizableBox>
    );
};

export default Sidebar;
