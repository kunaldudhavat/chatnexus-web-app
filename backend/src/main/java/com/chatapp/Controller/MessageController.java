package com.chatapp.Controller;

import com.chatapp.Exception.ChatException;
import com.chatapp.Exception.MessageException;
import com.chatapp.Exception.UserException;
import com.chatapp.Model.Message;
import com.chatapp.Model.User;
import com.chatapp.Payload.ApiResponse;
import com.chatapp.Payload.SendMessageRequest;
import com.chatapp.ServiceImpl.MessageServiceImpl;
import com.chatapp.ServiceImpl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageServiceImpl messageService;

    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/create")
    public ResponseEntity<Message> sendMessageHandler(@RequestBody SendMessageRequest sendMessageRequest,
                                                      @RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User user = this.userService.findUserProfile(jwt);

        sendMessageRequest.setUserId(user.getId());

        Message message = this.messageService.sendMessage(sendMessageRequest);

        return new ResponseEntity<Message>(message, HttpStatus.OK);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<List<Message>> getChatMessageHandler(@PathVariable Integer chatId,
                                                         @RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User user = this.userService.findUserProfile(jwt);

        List<Message> messages = this.messageService.getChatsMessages(chatId, user);

        return new ResponseEntity<List<Message>>(messages, HttpStatus.OK);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandler(@PathVariable Integer messageId,
                                                            @RequestHeader("Authorization") String jwt) throws UserException, ChatException, MessageException {
        User user = this.userService.findUserProfile(jwt);

        this.messageService.deleteMessage(messageId, user);

        ApiResponse res = new ApiResponse("Message deleted successfully...", false);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
