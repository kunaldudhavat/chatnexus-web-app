import React, { useState } from 'react';
import { BiSearch, BiArrowBack } from 'react-icons/bi';
import { FiUser } from 'react-icons/fi';
import { userApi } from '../api/api';

const AddGroupMembers = ({ onAddMember, onNext, onBack, currentUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupDescription] = useState('');

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 0) {
            try {
                const response = await userApi.searchUsers(query);
                if (response && Array.isArray(response)) {
                    const filteredResults = response.filter(user => user.id !== currentUser.id && !user.group);
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

    const handleUserSelect = (user) => {
        if (!selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
            onAddMember(user);
            setSearchResults([]);
            setSearchQuery('');
        }
    };

    const handleUserRemove = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    const handleNext = () => {
        onNext(groupDescription);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex items-center">
                <BiArrowBack className="text-2xl cursor-pointer mr-4" onClick={onBack} />
                <h2 className="text-xl font-bold text-white">Add Group Members</h2>
            </div>
            <div className="p-4 border-b border-gray-700">
                <div className="relative">
                    <BiSearch className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for members"
                        className="w-full bg-gray-800 rounded-full p-2 pl-10 text-white focus:outline-none"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <div className="p-4 flex flex-wrap">
                {selectedUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-2 m-2 bg-gray-700 p-2 rounded-full">
                        <FiUser className="text-2xl text-gray-400" />
                        <span className="text-white">{user.name}</span>
                        <button onClick={() => handleUserRemove(user.id)} className="text-red-500">x</button>
                    </div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto">
                {searchResults.map((user) => (
                    <div
                        key={user.id}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800"
                        onClick={() => handleUserSelect(user)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
                                <FiUser className="text-2xl text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{user.name}</h3>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4">
                {selectedUsers.length > 0 && (
                    <button
                        className="w-full bg-green-600 text-white rounded-full p-2"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddGroupMembers;
