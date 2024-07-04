package com.chatapp.DTO;

import java.time.LocalDateTime;

public class MessageDTO {
    private Integer id;
    private Integer chatId;
    private Integer userId;
    private String content;
    private LocalDateTime timestamp;

    // Default constructor
    public MessageDTO() {
    }

    // Parameterized constructor
    public MessageDTO(Integer id, Integer chatId, Integer userId, String content, LocalDateTime timestamp) {
        this.id = id;
        this.chatId = chatId;
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "MessageDTO{" +
                "id=" + id +
                ", chatId=" + chatId +
                ", userId=" + userId +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
