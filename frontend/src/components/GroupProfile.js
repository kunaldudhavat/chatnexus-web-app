import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroupProfile, updateGroupProfile } from '../actions/groupActions';
import { BsArrowLeft, BsPencil, BsCheck } from 'react-icons/bs';
import {FiUser, FiUsers} from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

const GroupProfile = ({ groupId, onClose, onUserProfileClick }) => {
    const dispatch = useDispatch();
    const groupProfile = useSelector((state) => state.group.groupProfile);
    const [tempGroupImage, setTempGroupImage] = useState(groupProfile?.chatImage || null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [groupName, setGroupName] = useState(groupProfile?.chatName || '');
    const [groupDescription, setGroupDescription] = useState(groupProfile?.description || '');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        if (groupId) {
            dispatch(fetchGroupProfile(groupId));
        }
    }, [dispatch, groupId]);

    useEffect(() => {
        if (groupProfile) {
            setTempGroupImage(groupProfile.chatImage || null);
            setGroupName(groupProfile.chatName || '');
            setGroupDescription(groupProfile.description || '');
        }
    }, [groupProfile]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const uploadToCloudinary = (pics) => {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chatapp");
        data.append("cloud_name", "dhuitsl8d");
        fetch("https://api.cloudinary.com/v1_1/dhuitsl8d/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setTempGroupImage(data.url.toString());
                const updatedGroup = {
                    chatId: groupId,
                    chatImage: data.url.toString(),
                };
                dispatch(updateGroupProfile(groupId, updatedGroup));
            });
    };

    const handleSave = () => {
        const updatedGroup = {
            chatId: groupId,
            chatName: groupName,
            chatImage: tempGroupImage,
            description: groupDescription
        };
        dispatch(updateGroupProfile(groupId, updatedGroup));
        setIsEditingName(false);
        setIsEditingDescription(false);
    };

    const onEmojiClick = (emojiObject) => {
        setGroupDescription(prevDescription => prevDescription + emojiObject.emoji);
    };

    if (!groupProfile) {
        return (
            <div className="p-4 bg-gray-900 text-white h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div ref={profileRef} className="p-4 bg-gray-900 text-white h-full max-h-screen overflow-y-auto">
            <div className="flex items-center mb-4">
                <button onClick={onClose} className="text-lg font-bold mr-2">
                    <BsArrowLeft />
                </button>
                <h2 className="text-xl font-bold">Group Info</h2>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 relative">
                    {tempGroupImage ? (
                        <img
                            src={tempGroupImage}
                            alt="Group"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <FiUsers className="text-2xl text-gray-400" />
                        </div>
                    )}
                    <label htmlFor="imgInput" className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gray-700 bg-opacity-50 rounded-full">
                        <BsPencil className="text-2xl text-white" />
                        <input
                            type="file"
                            id="imgInput"
                            className="hidden"
                            onChange={(e) => uploadToCloudinary(e.target.files[0])}
                        />
                    </label>
                </div>
                {isEditingName ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            className="bg-gray-800 rounded p-2 text-white"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <BsCheck className="ml-2 cursor-pointer" onClick={handleSave} />
                    </div>
                ) : (
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold">{groupName}</h2>
                        <BsPencil className="ml-2 cursor-pointer" onClick={() => setIsEditingName(true)} />
                    </div>
                )}
                <p className="text-gray-400 mt-1">Group</p>
            </div>
            <div className="mt-4 space-y-4 w-full">
                {isEditingDescription ? (
                    <div className="flex flex-col items-start">
                        <div className="flex items-center w-full">
                            <input
                                type="text"
                                className="bg-gray-800 rounded p-2 text-white w-full"
                                value={groupDescription}
                                onChange={(e) => setGroupDescription(e.target.value)}
                            />
                            <BsCheck className="ml-2 cursor-pointer" onClick={handleSave} />
                        </div>
                        <button
                            className="mt-2 text-blue-500"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            {showEmojiPicker ? 'Hide Emojis' : 'Add Emoji'}
                        </button>
                        {showEmojiPicker && (
                            <div className="mt-2">
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center">
                        <p className="w-full">{groupDescription || 'Add group description'}</p>
                        <BsPencil className="ml-2 cursor-pointer" onClick={() => setIsEditingDescription(true)} />
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-semibold mt-4">Members</h3>
                    {groupProfile.users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center p-2 bg-gray-800 rounded-lg mb-2 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => onUserProfileClick(user.id)}
                        >
                            <div className="w-10 h-10 bg-gray-700 rounded-full mr-4 flex items-center justify-center overflow-hidden">
                                {user.profile?.image ? (
                                    <img
                                        src={user.profile.image}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FiUser className="text-2xl text-gray-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-white">{user.name}</p>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupProfile;
