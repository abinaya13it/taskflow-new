package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Task> findAllByOrderByCreatedAtDesc();
    List<Task> findByStatusOrderByCreatedAtDesc(TaskStatus status);
    List<Task> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, TaskStatus status);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, TaskStatus status);
    long countByStatus(TaskStatus status);
}
