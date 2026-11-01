package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.TaskStatsResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(Long userId, TaskStatus status) {
        List<Task> tasks;
        if (userId != null && status != null) {
            tasks = taskRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        } else if (userId != null) {
            tasks = taskRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else if (status != null) {
            tasks = taskRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            tasks = taskRepository.findAllByOrderByCreatedAtDesc();
        }
        return tasks.stream().map(TaskResponse::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return new TaskResponse(task);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }

        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setPriority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setUser(user);

        Task saved = taskRepository.save(task);
        return new TaskResponse(saved);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            task.setUser(user);
        }

        Task updated = taskRepository.save(task);
        return new TaskResponse(updated);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setStatus(status);
        Task updated = taskRepository.save(task);
        return new TaskResponse(updated);
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public TaskStatsResponse getStats(Long userId) {
        if (userId != null) {
            long total = taskRepository.countByUserId(userId);
            long todo = taskRepository.countByUserIdAndStatus(userId, TaskStatus.TODO);
            long inProgress = taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);
            long completed = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
            return new TaskStatsResponse(total, todo, inProgress, completed);
        } else {
            long total = taskRepository.count();
            long todo = taskRepository.countByStatus(TaskStatus.TODO);
            long inProgress = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
            long completed = taskRepository.countByStatus(TaskStatus.COMPLETED);
            return new TaskStatsResponse(total, todo, inProgress, completed);
        }
    }
}
