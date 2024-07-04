package com.chatapp.ServiceImpl;

import com.chatapp.Exception.UserException;
import com.chatapp.Model.Chat;
import com.chatapp.Model.Profile;
import com.chatapp.Model.User;
import com.chatapp.Payload.UpdateUserRequest;
import com.chatapp.Repository.ChatRepository;
import com.chatapp.Repository.UserRepository;
import com.chatapp.Service.UserService;
import com.chatapp.config.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = Logger.getLogger(UserServiceImpl.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Override
    public User findUserById(Integer id) throws UserException {
        return this.userRepository.findById(id).orElseThrow(() -> new UserException("The requested user is not found"));
    }

    @Override
    public User findUserProfile(String jwt) throws UserException {
        String email = this.tokenProvider.getEmailFromToken(jwt);

        if (email == null) {
            throw new BadCredentialsException("Received invalid token...");
        }

        User user = this.userRepository.findByEmail(email);

        if (user == null) {
            throw new UserException("No user found with the given email");
        }
        return user;
    }

    @Override
    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException {
        logger.info("Updating user with ID: " + userId);
        logger.info("Received update request: " + req.toString());

        User user = this.findUserById(userId);

        if (req.getName() != null) {
            user.setName(req.getName());
        }

        if (req.getProfile() != null) {
            Profile profile = user.getProfile();
            if (profile == null) {
                profile = new Profile();
            }
            Profile reqProfile = req.getProfile();

            if (reqProfile.getBio() != null) {
                profile.setBio(reqProfile.getBio());
            }

            if (reqProfile.getLocation() != null) {
                profile.setLocation(reqProfile.getLocation());
            }

            if (reqProfile.getWebsite() != null) {
                profile.setWebsite(reqProfile.getWebsite());
            }

            if (reqProfile.getImage() != null) {
                profile.setImage(reqProfile.getImage());
            }

            user.setProfile(profile);
        }

        User updatedUser = this.userRepository.save(user);
        logger.info("Updated user: " + updatedUser.toString());
        return updatedUser;
    }

    @Override
    public List<Object> searchUser(String query) {
        List<User> users = this.userRepository.searchUser(query);
        List<Chat> groups = this.chatRepository.searchGroupChats(query);

        List<Object> results = new ArrayList<>();
        results.addAll(users);
        results.addAll(groups);

        return results;
    }

    @Override
    public List<Chat> findCommonGroups(Integer currentUserId, Integer userId) {
        List<Chat> currentUserChats = this.chatRepository.findChatByUserId(currentUserId);
        List<Chat> userChats = this.chatRepository.findChatByUserId(userId);

        // Filter only group chats and find intersection

        return currentUserChats.stream()
                .filter(Chat::isGroup)
                .filter(userChats::contains)
                .collect(Collectors.toList());
    }
}
