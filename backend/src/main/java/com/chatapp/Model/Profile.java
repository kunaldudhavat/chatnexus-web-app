package com.chatapp.Model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Profile {

    private String bio;
    private String location;
    private String website;
    private String image;

    public Profile() {
    }

    public Profile(String bio, String location, String website, String image) {
        this.bio = bio;
        this.location = location;
        this.website = website;
        this.image = image;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public String toString() {
        return "Profile [bio=" + bio + ", location=" + location + ", website=" + website + "]";
    }
}
