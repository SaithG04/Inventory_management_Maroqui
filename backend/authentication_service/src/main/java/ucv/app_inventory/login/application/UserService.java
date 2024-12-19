package ucv.app_inventory.login.application;

import ucv.app_inventory.login.adapters.controller.dto.UserDto;
import ucv.app_inventory.login.adapters.controller.dto.UserRegistration;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.domain.model.Status;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserService {
    public List<User> findByRoles_Name(String name);

    public long countByStatus(Status status);

    public Optional<User> findByEmailAndStatus(String email, Status status);

    public List<User> findByCreatedAtAfter(LocalDateTime date);

    public void invalidateRefreshTokenByEmail(String email);

    Optional<User> findByEmail(String email);

    UserDto registerUser(UserRegistration userRegistration);

    List<UserDto> getAllUsers();

    UserDto updateUser(Long id, UserDto updatedUser);

    void deleteUser(Long id);

    UserDto assignRoleToUser(Long id, String roleName);

    UserDto getUserProfile(String email);

    UserDto updateUserProfile(String email, UserDto updatedProfile);

    void setActiveStatus(Long id, boolean isActive);

    List<String> getAllRoles();
}
