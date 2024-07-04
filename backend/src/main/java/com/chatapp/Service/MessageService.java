package com.chatapp.Service;

import com.chatapp.Exception.ChatException;
import com.chatapp.Exception.MessageException;
import com.chatapp.Exception.UserException;
import com.chatapp.Model.Message;
import com.chatapp.Model.User;
import com.chatapp.Payload.SendMessageRequest;

import java.util.List;

public interface MessageService {

    public Message sendMessage(SendMessageRequest req) throws UserException, ChatException;

    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException;

    public Message findMessageById(Integer messageId) throws MessageException;

    public void deleteMessage(Integer messageId, User reqUser) throws MessageException;

}