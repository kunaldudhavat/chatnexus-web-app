import React, { useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';

const GroupDetails = ({ onCreateGroup, onBack }) => {
    const [groupName, setGroupName] = useState('');
    const [groupImage, setGroupImage] = useState(null);
    const [description, setDescription] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleGroupImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "chatapp");
            data.append("cloud_name", "dhuitsl8d");

            fetch("https://api.cloudinary.com/v1_1/dhuitsl8d/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setGroupImage(data.url.toString());
                })
                .catch((err) => {
                    console.error("Error uploading image:", err);
                });
        }
    };

    const handleSubmit = () => {
        onCreateGroup({ name: groupName, image: groupImage, description });
    };

    const onEmojiClick = (emojiObject) => {
        setDescription((prevDescription) => prevDescription + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex items-center">
                <BiArrowBack className="text-2xl cursor-pointer mr-4" onClick={onBack} />
                <h2 className="text-xl font-bold text-white">Create Group</h2>
            </div>
            <div className="p-4 flex flex-col items-center">
                <label className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleGroupImageChange}
                    />
                    {groupImage ? (
                        <img
                            src={groupImage}
                            alt="Group"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-400">Add Group Image</span>
                    )}
                </label>
                <input
                    type="text"
                    placeholder="Group Name"
                    className="mt-4 bg-gray-800 rounded-full p-2 text-white focus:outline-none w-full"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <div className="relative w-full mt-4">
                    <input
                        type="text"
                        placeholder="Group Description"
                        className="w-full bg-gray-800 rounded-full p-2 text-white"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <BsEmojiSmile
                        className="absolute right-4 top-2 text-2xl text-gray-400 cursor-pointer"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                    {showEmojiPicker && (
                        <div className="absolute right-0 mt-2">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4">
                <button
                    className="w-full bg-green-600 text-white rounded-full p-2"
                    onClick={handleSubmit}
                >
                    Create Group
                </button>
            </div>
        </div>
    );
};

export default GroupDetails;
