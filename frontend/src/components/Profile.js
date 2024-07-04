import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, setUser } from '../actions/authActions';
import { userApi } from '../api/api';
import { BsPencil } from "react-icons/bs";

const Profile = ({ closeProfile }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.profile?.bio || '');
    const [location, setLocation] = useState(user?.profile?.location || '');
    const [website, setWebsite] = useState(user?.profile?.website || '');
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [tempPicture, setTempPicture] = useState(user?.profile?.image || null);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        }
    }, [dispatch, user]);

    // Update local state when user object changes
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setBio(user.profile?.bio || '');
            setLocation(user.profile?.location || '');
            setWebsite(user.profile?.website || '');
            setTempPicture(user.profile?.image || null);
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        const updatedProfile = { bio, location, website, image: tempPicture };
        const updatedUser = { name, profile: updatedProfile };
        console.log("Sending update request:", updatedUser);
        try {
            await userApi.updateProfile(updatedUser);
            dispatch(setUser({ ...user, name, profile: updatedProfile }));
            setSuccessMessage('Profile saved successfully.');
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

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
                setTempPicture(data.url.toString());
                localStorage.getItem("token");
                data.url.toString();
                dispatch(setUser({ ...user, profile: { ...user.profile, image: data.url.toString() } }));
            });
    };

    return (
        <div className="p-4 bg-gray-900 text-white h-full">
            <div className="flex justify-end">
                <button onClick={closeProfile} className="text-lg font-bold">X</button>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 relative">
                    {tempPicture ? (
                        <img
                            src={tempPicture}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <BsPencil className="text-2xl text-gray-400" />
                        </div>
                    )}
                    {isEditing && (
                        <label htmlFor="imgInput" className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gray-700 bg-opacity-50 rounded-full">
                            <BsPencil className="text-2xl text-white" />
                            <input
                                type="file"
                                id="imgInput"
                                className="hidden"
                                onChange={(e) => uploadToCloudinary(e.target.files[0])}
                            />
                        </label>
                    )}
                </div>
                <h2 className="text-xl font-bold">{name || 'John Doe'}</h2>
                <p className="text-gray-400">{user?.status || 'Available'}</p>
            </div>
            {successMessage && (
                <div className="text-green-500 text-center mb-4">
                    {successMessage}
                </div>
            )}
            {isEditing ? (
                <form className="mt-4 space-y-4" onSubmit={handleSave}>
                    <div>
                        <label className="block text-sm">Name</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Bio</label>
                        <textarea
                            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Location</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Website</label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400">Cancel</button>
                        <button type="submit" className="text-white">Save</button>
                    </div>
                </form>
            ) : (
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm">Name</label>
                        <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{name}</p>
                    </div>
                    <div>
                        <label className="block text-sm">Bio</label>
                        <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{bio}</p>
                    </div>
                    <div>
                        <label className="block text-sm">Location</label>
                        <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{location}</p>
                    </div>
                    <div>
                        <label className="block text-sm">Website</label>
                        <p className="w-full p-2 bg-gray-800 text-white rounded-lg">{website}</p>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setIsEditing(true)} className="text-white">Edit Profile</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
