package com.chatapp.Service;

import com.chatapp.Exception.UserException;
import com.chatapp.Model.Chat;
import com.chatapp.Model.User;
import com.chatapp.Payload.UpdateUserRequest;
import java.util.List;

public interface UserService {

    User findUserById(Integer id) throws UserException;

    User findUserProfile(String jwt) throws UserException;

    User updateUser(Integer userId, UpdateUserRequest req) throws UserException;

    List<Object> searchUser(String query);

    List<Chat> findCommonGroups(Integer currentUserId, Integer userId);
}

