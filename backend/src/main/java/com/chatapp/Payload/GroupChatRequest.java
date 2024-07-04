package com.chatapp.Payload;

import java.util.List;

public class GroupChatRequest {

    private List<Integer> userIds;
    private String chatName;
    private String chatImage;
    private String description;  // Add this line

    public List<Integer> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Integer> userIds) {
        this.userIds = userIds;
    }

    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public String getChatImage() {
        return chatImage;
    }

    public void setChatImage(String chatImage) {
        this.chatImage = chatImage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public GroupChatRequest() {
    }

    public GroupChatRequest(List<Integer> userIds, String chatName, String chatImage, String description) {
        this.userIds = userIds;
        this.chatName = chatName;
        this.chatImage = chatImage;
        this.description = description;
    }

    @Override
    public String toString() {
        return "GroupChatRequest [userIds=" + userIds + ", chatName=" + chatName + ", chatImage=" + chatImage + ", description=" + description + "]";
    }
}
