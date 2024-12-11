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
import ucv.app_inventory.login.adapters.persistance.JpaUserRepository;
import ucv.app_inventory.login.adapters.persistance.RoleRepository;
import ucv.app_inventory.login.domain.model.Role;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.domain.model.UserProfile;

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
        return List.of();
    }

    @Override
    public long countByStatus(Status status) {
        return 0;
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
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear UserProfile
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

        // Crear User
        User user = new User();
        user.setEmail(userRegistration.getEmail());
        user.setPassword(passwordEncoder.encode(userRegistration.getPassword()));
        user.setStatus(Status.ACTIVE);
        user.setUserProfile(userProfile);
        userProfile.setUser(user); // Establecer la relación bidireccional

        // Asignar rol por defecto (por ejemplo, "WAREHOUSE CLERK")
        Role defaultRole = roleRepository.findByName("WAREHOUSE CLERK")
                .orElseThrow(() -> new RuntimeException("Rol WAREHOUSE CLERK no encontrado"));
        user.setRoles(Set.of(defaultRole));

        // Guardar usuario (cascadeará al perfil)
        jpaUserRepository.save(user);

        // Utilizar UserMapper para convertir a UserDto
        return UserMapper.toUserDto(user);
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

        // Actualizar campos
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }

        if(updatedUser.getStatus() != null) {
            user.setStatus(Status.valueOf(updatedUser.getStatus()));
        }

        // Actualizar UserProfile
        UserProfile profile = user.getUserProfile();
        if (updatedUser.getFirstName() != null) {
            profile.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            profile.setLastName(updatedUser.getLastName());
        }

        // Actualizar roles si es necesario
        if (updatedUser.getRoles() != null && !updatedUser.getRoles().isEmpty()) {
            Set<Role> roles = updatedUser.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new RuntimeException("Rol " + roleName + " no encontrado")))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        jpaUserRepository.save(user);
        return UserMapper.toUserDto(user);
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

        user.getRoles().add(role);
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
    public UserDto updateUserProfile(String email, UserDto updatedProfile) {
        User user = jpaUserRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar UserProfile
        UserProfile profile = user.getUserProfile();
        if (updatedProfile.getFirstName() != null) {
            profile.setFirstName(updatedProfile.getFirstName());
        }
        if (updatedProfile.getLastName() != null) {
            profile.setLastName(updatedProfile.getLastName());
        }

        jpaUserRepository.save(user);
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
