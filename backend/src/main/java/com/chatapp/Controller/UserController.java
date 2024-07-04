package com.chatapp.Controller;

import com.chatapp.Exception.UserException;
import com.chatapp.Model.Chat;
import com.chatapp.Payload.ApiResponse;
import com.chatapp.Payload.UpdateUserRequest;
import com.chatapp.ServiceImpl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.chatapp.Model.User;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = Logger.getLogger(UserController.class.getName());

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String token) throws UserException {
        logger.info("Fetching profile for token: " + token);
        User user = this.userService.findUserProfile(token);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<User> getUserProfileByIdHandler(@PathVariable Integer userId) throws UserException {
        logger.info("Fetching profile for user ID: " + userId);
        User user = this.userService.findUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/common-groups/{userId}")
    public ResponseEntity<List<Chat>> getCommonGroupsHandler(@PathVariable Integer userId, @RequestHeader("Authorization") String token) throws UserException {
        logger.info("Fetching common groups for user ID: " + userId);
        User currentUser = this.userService.findUserProfile(token);
        List<Chat> commonGroups = this.userService.findCommonGroups(currentUser.getId(), userId);
        return new ResponseEntity<>(commonGroups, HttpStatus.OK);
    }

    @GetMapping("/{query}")
    public ResponseEntity<List<Object>> searchUserHandler(@PathVariable("query") String query) {
        logger.info("Searching for users and groups with query: " + query);
        List<Object> usersAndGroups = this.userService.searchUser(query);
        return new ResponseEntity<>(usersAndGroups, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateUserHandler(@RequestBody UpdateUserRequest request, @RequestHeader("Authorization") String token) throws UserException {
        logger.info("Received update request: " + request.toString());
        User user = this.userService.findUserProfile(token);
        this.userService.updateUser(user.getId(), request);

        ApiResponse response = new ApiResponse();
        response.setMessage("User details updated successfully.");
        response.setStatus(true);

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }
}
