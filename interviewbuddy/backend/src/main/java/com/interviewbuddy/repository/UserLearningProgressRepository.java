package com.interviewbuddy.repository;

import com.interviewbuddy.entity.UserLearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserLearningProgressRepository extends JpaRepository<UserLearningProgress, Long> {
    List<UserLearningProgress> findByUserId(Long userId);
    Optional<UserLearningProgress> findByUserIdAndResourceId(Long userId, Long resourceId);
    long countByUserIdAndCompletedTrue(Long userId);
}
