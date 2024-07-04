package com.chatapp.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String content;
    private LocalDateTime timestamp;

    @ManyToOne
    @JsonBackReference
    private Chat chat;

    @ManyToOne
    private User user;

    // Default constructor
    public Message() {
    }

    // Parameterized constructor
    public Message(Integer id, String content, LocalDateTime timestamp, Chat chat, User user) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
        this.chat = chat;
        this.user = user;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Message [id=" + id + ", content=" + content + ", timestamp=" + timestamp + ", chat=" + chat + ", user="
                + user + "]";
    }
}
