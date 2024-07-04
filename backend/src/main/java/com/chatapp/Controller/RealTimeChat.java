package com.chatapp.Controller;

import com.chatapp.DTO.MessageDTO;
import com.chatapp.Mapper.MessageMapper;
import com.chatapp.Model.Message;
import com.chatapp.Payload.SendMessageRequest;
import com.chatapp.ServiceImpl.MessageServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class RealTimeChat {

    private static final Logger logger = LoggerFactory.getLogger(RealTimeChat.class);

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageServiceImpl messageService;

    public RealTimeChat(SimpMessagingTemplate simpMessagingTemplate, MessageServiceImpl messageService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/message")
    @SendTo("/group/public")
    public MessageDTO receiveMessage(@Payload SendMessageRequest sendMessageRequest) throws Exception {
        logger.info("Received SendMessageRequest: userId={}, chatId={}, content={}",
                sendMessageRequest.getUserId(), sendMessageRequest.getChatId(), sendMessageRequest.getContent());

        if (sendMessageRequest.getUserId() == null || sendMessageRequest.getChatId() == null) {
            logger.error("Invalid message data: userId or chatId is null");
            throw new IllegalArgumentException("userId and chatId must not be null");
        }

        // Save the message using the service
        Message savedMessage = messageService.sendMessage(sendMessageRequest);

        // Convert the saved message to DTO
        MessageDTO messageDTO = MessageMapper.toDTO(savedMessage);

        // Broadcast the saved message
        simpMessagingTemplate.convertAndSend("/group/" + savedMessage.getChat().getId(), messageDTO);
        logger.info("Broadcasted message to /group/{}", savedMessage.getChat().getId());

        return messageDTO;
    }
}
