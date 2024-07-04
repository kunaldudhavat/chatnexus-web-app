package com.chatapp.Mapper;

import com.chatapp.DTO.MessageDTO;
import com.chatapp.Model.Message;

public class MessageMapper {
    public static MessageDTO toDTO(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getChat().getId(),
                message.getUser().getId(),
                message.getContent(),
                message.getTimestamp()
        );
    }
}
