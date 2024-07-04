package com.chatapp.ServiceImpl;

import com.chatapp.Exception.ChatException;
import com.chatapp.Exception.UserException;
import com.chatapp.Model.Chat;
import com.chatapp.Model.Message;
import com.chatapp.Model.User;
import com.chatapp.Payload.GroupChatRequest;
import com.chatapp.Repository.ChatRepository;
import com.chatapp.Repository.MessageRepository;
import com.chatapp.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Override
    public Chat createChat(User reqUser, Integer userId) throws UserException {

        User user = this.userService.findUserById(userId);

        Chat isChatExist = this.chatRepository.findSingleChatByUserIds(user, reqUser);

        System.out.println(isChatExist);
        if(isChatExist != null) {
            return isChatExist;
        }

        Chat chat = new Chat();
        chat.setCreatedBy(reqUser);
        chat.getUsers().add(user);
        chat.getUsers().add(reqUser);
        chat.setGroup(false);

        return this.chatRepository.save(chat);
    }

    @Override
    public Chat findChatById(Integer chatId) throws ChatException {
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The requested chat is not found"));
        List<Message> messages = this.messageRepository.findByChatId(chatId);
        chat.setMessages(messages);
        return chat;
    }

    @Override
    public List<Chat> findAllChatByUserId(Integer userId) throws UserException {
        User user = this.userService.findUserById(userId);

        List<Chat> chats = this.chatRepository.findChatByUserId(user.getId());

        chats.forEach(chat -> {
            List<Message> messages = this.messageRepository.findByChatId(chat.getId());
            chat.setMessages(messages);
        });

        return chats;
    }

    @Override
    public Chat createGroup(GroupChatRequest req, User reqUser) throws UserException {
        Chat group = new Chat();
        group.setGroup(true);
        group.setChatImage(req.getChatImage());
        group.setChatName(req.getChatName());
        group.setCreatedBy(reqUser);
        group.getAdmins().add(reqUser);

        for (Integer userId : req.getUserIds()) {
            User user = this.userService.findUserById(userId);
            group.getUsers().add(user);
        }
        return this.chatRepository.save(group);
    }

    @Override
    public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException {
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The expected chat is not found"));

        User user = this.userService.findUserById(userId);

        if (chat.getAdmins().contains((reqUser))) {
            chat.getUsers().add(user);
            return chat;
        } else {
            throw new UserException("You don't have permission to add a user");
        }
    }

    @Override
    public Chat renameGroup(Integer chatId, String groupName, User reqUser) throws  ChatException, UserException {
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The expected chat is not found"));

        if (chat.getUsers().contains(reqUser)) {
            chat.setChatName(groupName);
            return this.chatRepository.save(chat);
        } else {
            throw new UserException("You are not a group member");
        }
    }

    @Override
    public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException {
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The expected chat is not found"));
        User user = this.userService.findUserById(userId);

        if (chat.getAdmins().contains(reqUser)) {
            chat.getUsers().remove(user);
            return chat;
        } else if (chat.getUsers().contains(reqUser)) {
            if (user.getId() == reqUser.getId()) {
                chat.getUsers().remove(user);
                return this.chatRepository.save(chat);
            }
        }
        throw new UserException("You don't have access to remove the user");
    }

    @Override
    public void deleteChat(Integer chatId, Integer userId) throws ChatException, UserException {
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The chat you're trying to delete is not found"));
        this.chatRepository.delete(chat);
    }

    @Override
    public Chat findGroupById(Integer chatId) throws ChatException {
        return this.chatRepository.findGroupById(chatId)
                .orElseThrow(() -> new ChatException("The requested group is not found"));
    }

    @Override
    public Chat updateGroup(Integer chatId, GroupChatRequest req, User reqUser) throws ChatException, UserException {
        Chat chat = this.chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatException("The expected chat is not found"));

        if (!chat.isGroup()) {
            throw new ChatException("The expected chat is not a group");
        }

        if (!chat.getUsers().contains(reqUser)) {
            throw new UserException("You don't have permission to update the group");
        }

        if (req.getChatName() != null) {
            chat.setChatName(req.getChatName());
        }

        if (req.getChatImage() != null) {
            chat.setChatImage(req.getChatImage());
        }

        if (req.getDescription() != null) {
            chat.setDescription(req.getDescription());
        }

        return this.chatRepository.save(chat);
    }


}
