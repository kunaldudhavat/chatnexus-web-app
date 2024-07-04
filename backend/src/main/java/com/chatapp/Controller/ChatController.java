package com.chatapp.Controller;

import com.chatapp.Exception.ChatException;
import com.chatapp.Exception.UserException;
import com.chatapp.Model.Chat;
import com.chatapp.Model.User;
import com.chatapp.Payload.ApiResponse;
import com.chatapp.Payload.GroupChatRequest;
import com.chatapp.Payload.SingleChatRequest;
import com.chatapp.ServiceImpl.ChatServiceImpl;
import com.chatapp.ServiceImpl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatServiceImpl chatService;

    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/single")
    public ResponseEntity<Chat> createChatHandler(@RequestBody SingleChatRequest singleChatRequest,
                                                  @RequestHeader("Authorization") String jwt) throws UserException {

        User reqUser = this.userService.findUserProfile(jwt);

        Chat chat = this.chatService.createChat(reqUser, singleChatRequest.getUserId());

        return new ResponseEntity<Chat>(chat, HttpStatus.CREATED);
    }

    @PostMapping("/group")
    public ResponseEntity<Chat> createGroupHandler(@RequestBody GroupChatRequest groupChatRequest,
                                                   @RequestHeader("Authorization") String jwt) throws UserException {
        System.out.println(groupChatRequest);
        User reqUser = this.userService.findUserProfile(jwt);

        Chat chat = this.chatService.createGroup(groupChatRequest, reqUser);

        return new ResponseEntity<Chat>(chat, HttpStatus.CREATED);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> findChatByIdHandler(@PathVariable int chatId) throws ChatException {

        Chat chat = this.chatService.findChatById(chatId);

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Chat>> findChatByUserIdHandler(@RequestHeader("Authorization") String jwt) throws UserException{

        User reqUser = this.userService.findUserProfile(jwt);

        List<Chat> chats = this.chatService.findAllChatByUserId(reqUser.getId());

        return new ResponseEntity<List<Chat>>(chats, HttpStatus.OK);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<Chat> getGroupProfile(@PathVariable Integer groupId) throws ChatException {
        Chat group = this.chatService.findChatById(groupId);
        if (!group.isGroup()) {
            throw new ChatException("The requested chat is not a group");
        }
        return new ResponseEntity<>(group, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUserToGroupHandler(@PathVariable Integer chatId,
                                                      @PathVariable Integer userId, @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = this.userService.findUserProfile(jwt);

        Chat chat = this.chatService.addUserToGroup(userId, chatId, reqUser);

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<Chat> removeUserFromGroupHandler(@PathVariable Integer chatId,
                                                           @PathVariable Integer userId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = this.userService.findUserProfile(jwt);

        Chat chat = this.chatService.removeFromGroup(userId, chatId, reqUser);

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<ApiResponse> deleteChatHandler(@PathVariable Integer chatId,
                                                         @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = this.userService.findUserProfile(jwt);

        this.chatService.deleteChat(chatId, reqUser.getId());

        ApiResponse res = new ApiResponse("Chat deleted successfully...", false);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("/update-group/{chatId}")
    public ResponseEntity<ApiResponse> updateGroupHandler(@PathVariable Integer chatId,
                                                          @RequestBody GroupChatRequest groupChatRequest,
                                                          @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = this.userService.findUserProfile(jwt);
        this.chatService.updateGroup(chatId, groupChatRequest, reqUser);

        ApiResponse response = new ApiResponse("Group details updated successfully.", true);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

}
