package com.example.InfoByte.service;

import com.example.InfoByte.model.Notification;
import com.example.InfoByte.model.User;
import com.example.InfoByte.repository.NotificationRepository;
import com.example.InfoByte.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    
    public void createNotificationForCategory(String category, String articleTitle, String articleId) {
        // Find all users interested in this category
        List<User> interestedUsers = userRepository.findAll().stream()
            .filter(user -> user.getInterests() != null && user.getInterests().contains(category))
            .toList();
        
        for (User user : interestedUsers) {
            Notification notification = new Notification();
            notification.setUserId(user.getId());
            notification.setType("NEW_ARTICLE");
            notification.setTitle("New " + category + " Article");
            notification.setMessage("New article: " + articleTitle);
            notification.setArticleId(articleId);
            notification.setCategory(category);
            notificationRepository.save(notification);
        }
    }
    
    public Page<Notification> getUserNotifications(String userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
    
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
    
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}