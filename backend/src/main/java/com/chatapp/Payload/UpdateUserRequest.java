package com.chatapp.Payload;

import com.chatapp.Model.Profile;

public class UpdateUserRequest {

    private String name;
    private Profile profile;

    public UpdateUserRequest() {
    }

    public UpdateUserRequest(String name, Profile profile) {
        this.name = name;
        this.profile = profile;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    @Override
    public String toString() {
        return "UpdateUserRequest [name=" + name + ", profile=" + profile + "]";
    }
}
