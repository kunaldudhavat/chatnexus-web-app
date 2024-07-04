package com.chatapp.Repository;

import com.chatapp.Model.Chat;
import com.chatapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Integer> {

    @Query("select c from Chat c join c.users u where u.id=:userId")
    public List<Chat> findChatByUserId(@Param("userId") Integer userId);

    @Query("select c from Chat c where c.isGroup=false and :user member of c.users and :reqUser member of c.users")
    public Chat findSingleChatByUserIds(@Param("user") User user, @Param("reqUser") User reqUser);

    @Query("select c from Chat c where c.isGroup=true and c.chatName like %:query%")
    public List<Chat> searchGroupChats(@Param("query") String query);

    @Query("select c from Chat c where c.id = :chatId and c.isGroup = true")
    public Optional<Chat> findGroupById(@Param("chatId") Integer chatId);
}
