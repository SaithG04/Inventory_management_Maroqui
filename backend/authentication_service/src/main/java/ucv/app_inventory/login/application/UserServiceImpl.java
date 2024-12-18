package ucv.app_inventory.login.application;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ucv.app_inventory.login.adapters.controller.dto.UserDto;
import ucv.app_inventory.login.adapters.controller.dto.UserRegistration;
import ucv.app_inventory.login.domain.exception.EmailAlreadyExistsException;
import ucv.app_inventory.login.domain.exception.RoleNotFoundException;
import ucv.app_inventory.login.adapters.persistence.JpaUserRepository;
import ucv.app_inventory.login.adapters.persistence.RoleRepository;
import ucv.app_inventory.login.domain.model.*;

@Service
public class UserServiceImpl implements UserService {

    private final JpaUserRepository jpaUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserServiceImpl(JpaUserRepository jpaUserRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.jpaUserRepository = jpaUserRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> findByRoles_Name(String name) {
        return jpaUserRepository.findByRoles_Name(name);
    }

    @Override
    public long countByStatus(Status status) {
        return jpaUserRepository.countByStatus(status);
    }

    @Override
    public Optional<User> findByEmailAndStatus(String email, Status status) {
        return jpaUserRepository.findByEmailAndStatus(email, status);
    }

    @Override
    public List<User> findByCreatedAtAfter(LocalDateTime date) {
        return jpaUserRepository.findByCreatedAtAfter(date);
    }

    @Override
    public void invalidateRefreshTokenByEmail(String email) {
        Optional<User> userOptional = jpaUserRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setRefreshToken(null);
            jpaUserRepository.save(user);
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public UserDto registerUser(UserRegistration userRegistration) {
        // Verificar si el email ya existe
        if (jpaUserRepository.findByEmail(userRegistration.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El email ya está registrado");
        }

        // Crear User y UserProfile
        User user = createUserFromRegistration(userRegistration);

        // Asignar rol proporcionado
        assignRole(user, userRegistration.getRoleName());

        // Guardar usuario (cascadeará al perfil)
        jpaUserRepository.save(user);

        // Convertir a UserDto
        return UserMapper.toUserDto(user);
    }

    private User createUserFromRegistration(UserRegistration userRegistration) {
        UserProfile userProfile = new UserProfile();
        userProfile.setDni(userRegistration.getDni());
        userProfile.setFirstName(userRegistration.getFirstName());
        userProfile.setLastName(userRegistration.getLastName());
        userProfile.setAge(userRegistration.getAge());
        userProfile.setBirthDate(userRegistration.getBirthDate());
        userProfile.setAddress(userRegistration.getAddress());
        userProfile.setPhone(userRegistration.getPhone());
        userProfile.setSex(userRegistration.getSex());
        userProfile.setMaritalStatus(userRegistration.getMaritalStatus());

        User user = new User();
        user.setEmail(userRegistration.getEmail());
        user.setPassword(passwordEncoder.encode(userRegistration.getPassword()));
        user.setStatus(Status.ACTIVE);
        user.setUserProfile(userProfile);
        userProfile.setUser(user);

        return user;
    }

    private void assignRole(User user, String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RoleNotFoundException("Rol " + roleName + " no encontrado"));
        user.setRoles(Set.of(role));
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = jpaUserRepository.findAll();
        return users.stream()
                .map(UserMapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto updatedUser) {
        User user = jpaUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        updateUserFields(user, updatedUser);
        updateProfileFields(user.getUserProfile(), updatedUser);

        if (updatedUser.getRoles() != null && !updatedUser.getRoles().isEmpty()) {
            user.setRoles(getRolesFromNames(updatedUser.getRoles()));
        }

        jpaUserRepository.save(user);
        return UserMapper.toUserDto(user);
    }

    @Override
    @Transactional
    public UserDto updateUserProfile(String email, UserDto updatedProfile) {
        User user = jpaUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        updateProfileFields(user.getUserProfile(), updatedProfile);

        jpaUserRepository.save(user);
        return UserMapper.toUserDto(user);
    }

    private void updateUserFields(User user, UserDto dto) {
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getStatus() != null) user.setStatus(Status.valueOf(dto.getStatus()));
    }

    private void updateProfileFields(UserProfile profile, UserDto dto) {
        if (dto.getDni() != null) profile.setDni(dto.getDni());
        if (dto.getFirstName() != null) profile.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) profile.setLastName(dto.getLastName());
        if (dto.getAge() != null) profile.setAge(dto.getAge());
        if (dto.getBirthDate() != null) profile.setBirthDate(dto.getBirthDate());
        if (dto.getAddress() != null) profile.setAddress(dto.getAddress());
        if (dto.getPhone() != null) profile.setPhone(dto.getPhone());
        if (dto.getSex() != null) profile.setSex(Sex.valueOf(dto.getSex()));
        if (dto.getMaritalStatus() != null) profile.setMaritalStatus(MaritalStatus.valueOf(dto.getMaritalStatus()));
    }

    private Set<Role> getRolesFromNames(Set<String> roleNames) {
        return roleNames.stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + roleName)))
                .collect(Collectors.toSet());
    }


    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!jpaUserRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        jpaUserRepository.deleteById(id);
    }

    @Override
    @Transactional
    public UserDto assignRoleToUser(Long id, String roleName) {
        User user = jpaUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rol " + roleName + " no encontrado"));
        user.setRoles(Set.of(role));
        jpaUserRepository.save(user);

        return UserMapper.toUserDto(user);
    }


    @Override
    public UserDto getUserProfile(String email) {
        User user = jpaUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return UserMapper.toUserDto(user);
    }

    @Override
    @Transactional
    public void setActiveStatus(Long id, boolean isActive) {
        User user = jpaUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setStatus(isActive ? Status.ACTIVE : Status.INACTIVE);
        jpaUserRepository.save(user);
    }

    @Override
    public List<String> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }
}
