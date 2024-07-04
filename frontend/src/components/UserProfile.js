import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile, fetchCommonGroups } from '../actions/userActions';
import { setCurrentChat } from '../actions/chatActions';
import { BsArrowLeft } from 'react-icons/bs';
import { FiUser, FiUsers } from 'react-icons/fi';

const UserProfile = ({ userId, onClose }) => {
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.auth.userProfile);
    const commonGroups = useSelector((state) => state.auth.commonGroups);
    const profileRef = useRef(null);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserProfile(userId));
            dispatch(fetchCommonGroups(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        console.log("Common Groups between users:", commonGroups);
    }, [commonGroups]);

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

    const handleGroupClick = (groupId) => {
        dispatch(setCurrentChat(groupId));
        onClose();
    };

    if (!userProfile) {
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
                <button onClick={onClose} className="text-lg font-bold">
                    <BsArrowLeft />
                </button>
                <h2 className="text-xl font-bold ml-2">Contact info</h2>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mb-4">
                    {userProfile.profile?.image ? (
                        <img
                            src={userProfile.profile.image}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <FiUser className="text-2xl text-gray-400" />
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-bold">{userProfile.name}</h2>
                <p className="text-gray-400">{userProfile.status || 'Available'}</p>
            </div>
            <div className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm">Name</label>
                    <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{userProfile.name}</p>
                </div>
                <div>
                    <label className="block text-sm">Bio</label>
                    <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{userProfile.profile?.bio || 'No bio available'}</p>
                </div>
                <div>
                    <label className="block text-sm">Location</label>
                    <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{userProfile.profile?.location || 'Not specified'}</p>
                </div>
                <div>
                    <label className="block text-sm">Website</label>
                    <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{userProfile.profile?.website || 'Not specified'}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mt-4">Common Groups</h3>
                    {Array.isArray(commonGroups) && commonGroups.length > 0 ? (
                        commonGroups.map((group) => (
                            <div
                                key={group.id}
                                className="p-2 bg-gray-800 rounded-lg mb-2 flex items-center cursor-pointer hover:bg-gray-700"
                                onClick={() => handleGroupClick(group.id)}
                            >
                                <div className="w-10 h-10 mr-3 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                    {group.chatImage ? (
                                        <img src={group.chatImage} alt={group.chatName} className="w-full h-full object-cover" />
                                    ) : (
                                        <FiUsers className="text-xl text-gray-400" />
                                    )}
                                </div>
                                <span>{group.chatName}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No common groups</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
