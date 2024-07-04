package com.chatapp.ServiceImpl;

import com.chatapp.Exception.ChatException;
import com.chatapp.Exception.MessageException;
import com.chatapp.Exception.UserException;
import com.chatapp.Model.Chat;
import com.chatapp.Model.Message;
import com.chatapp.Model.User;
import com.chatapp.Payload.SendMessageRequest;
import com.chatapp.Repository.MessageRepository;
import com.chatapp.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private ChatServiceImpl chatService;

    @Override
    public Message sendMessage(SendMessageRequest req) throws UserException, ChatException {
        User user = this.userService.findUserById(req.getUserId());
        Chat chat = this.chatService.findChatById(req.getChatId());

        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimestamp(LocalDateTime.now());

        return this.messageRepository.save(message);
    }

    @Override
    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException {

        Chat chat = this.chatService.findChatById(chatId);

        if (!chat.getUsers().contains(reqUser)) {
            throw new UserException("You are not authorized to take part in this chat");
        }

        return this.messageRepository.findByChatId(chat.getId());
    }

    @Override
    public Message findMessageById(Integer messageId) throws MessageException {
        return this.messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageException("The required message is not found"));
    }

    @Override
    public void deleteMessage(Integer messageId, User reqUser) throws MessageException {
        Message message = this.messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageException("The required message is not found"));

        if (message.getUser().getId() == reqUser.getId()) {
            this.messageRepository.delete(message);
        }

        throw new MessageException("You are not authorized for deleting this message");
    }
}