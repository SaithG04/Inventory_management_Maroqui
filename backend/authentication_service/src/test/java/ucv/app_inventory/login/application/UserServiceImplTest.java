/*package ucv.app_inventory.login.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import ucv.app_inventory.login.adapters.controller.dto.UserDto;
import ucv.app_inventory.login.adapters.controller.dto.UserRegistration;
import ucv.app_inventory.login.adapters.persistence.JpaUserRepository;
import ucv.app_inventory.login.adapters.persistence.RoleRepository;
import ucv.app_inventory.login.domain.model.*;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private JpaUserRepository jpaUserRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUser_Success() {
        // Datos de entrada
        UserRegistration registration = new UserRegistration();
        registration.setFirstName("Juan");
        registration.setLastName("Pérez");
        registration.setEmail("juan.perez@example.com");
        registration.setPassword("securePassword");
        registration.setDni("12345678A");
        registration.setAge(30);
        registration.setBirthDate(LocalDate.of(1994, 5, 20));
        registration.setAddress("Calle Falsa 123");
        registration.setPhone("555-1234");
        registration.setSex(Sex.MASCULINO);
        registration.setMaritalStatus(MaritalStatus.SOLTERO);

        // Mocking: Email no existe
        when(jpaUserRepository.findByEmail(registration.getEmail())).thenReturn(Optional.empty());

        // Mocking: Password encoding
        when(passwordEncoder.encode(registration.getPassword())).thenReturn("encodedPassword");

        // Mocking: Rol por defecto
        Role defaultRole = new Role();
        defaultRole.setIdRole(1L);
        defaultRole.setName("WAREHOUSE CLERK");
        when(roleRepository.findByName("WAREHOUSE CLERK")).thenReturn(Optional.of(defaultRole));

        // Mocking: Save user
        User savedUser = new User();
        savedUser.setIdUser(1L);
        savedUser.setEmail(registration.getEmail());
        savedUser.setPassword("encodedPassword");
        savedUser.setStatus(Status.ACTIVE);
        UserProfile profile = new UserProfile();
        profile.setFirstName(registration.getFirstName());
        profile.setLastName(registration.getLastName());
        profile.setDni(registration.getDni());
        profile.setAge(registration.getAge());
        profile.setBirthDate(registration.getBirthDate());
        profile.setAddress(registration.getAddress());
        profile.setPhone(registration.getPhone());
        profile.setSex(registration.getSex());
        profile.setMaritalStatus(registration.getMaritalStatus());
        profile.setUser(savedUser);
        savedUser.setUserProfile(profile);
        savedUser.setRoles(Set.of(defaultRole));

        when(jpaUserRepository.save(any(User.class))).thenReturn(savedUser);

        // Ejecutar el método a probar
        UserDto userDto = userService.registerUser(registration);

        // Verificar los resultados
        assertNotNull(userDto);
        assertEquals(1L, userDto.getIdUser());
        assertEquals("juan.perez@example.com", userDto.getEmail());
        assertEquals("Juan", userDto.getFirstName());
        assertEquals("Pérez", userDto.getLastName());
        assertTrue(userDto.getRoles().contains("WAREHOUSE CLERK"));
        assertEquals("ACTIVE", userDto.getStatus());

        // Verificar las interacciones
        verify(jpaUserRepository, times(1)).findByEmail(registration.getEmail());
        verify(passwordEncoder, times(1)).encode(registration.getPassword());
        verify(roleRepository, times(1)).findByName("WAREHOUSE CLERK");
        verify(jpaUserRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_EmailAlreadyExists() {
        // Datos de entrada
        UserRegistration registration = new UserRegistration();
        registration.setEmail("existing@example.com");
        // Otros campos pueden ser omitidos ya que la validación falla primero

        // Mocking: Email ya existe
        when(jpaUserRepository.findByEmail(registration.getEmail())).thenReturn(Optional.of(new User()));

        // Ejecutar y verificar excepciones
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(registration);
        });

        assertEquals("El email ya está registrado", exception.getMessage());

        // Verificar las interacciones
        verify(jpaUserRepository, times(1)).findByEmail(registration.getEmail());
        verify(passwordEncoder, never()).encode(anyString());
        verify(roleRepository, never()).findByName(anyString());
        verify(jpaUserRepository, never()).save(any());
    }

    @Test
    void registerUser_RoleNotFound() {
        // Datos de entrada
        UserRegistration registration = new UserRegistration();
        registration.setFirstName("Ana");
        registration.setLastName("García");
        registration.setEmail("ana.garcia@example.com");
        registration.setPassword("securePassword");
        registration.setDni("87654321B");
        registration.setAge(25);
        registration.setBirthDate(LocalDate.of(1999, 8, 15));
        registration.setAddress("Avenida Siempre Viva 456");
        registration.setPhone("555-5678");
        registration.setSex(Sex.FEMENINO);
        registration.setMaritalStatus(MaritalStatus.CASADO);

        // Mocking: Email no existe
        when(jpaUserRepository.findByEmail(registration.getEmail())).thenReturn(Optional.empty());

        // Mocking: Password encoding
        when(passwordEncoder.encode(registration.getPassword())).thenReturn("encodedPassword");

        // Mocking: Rol por defecto no encontrado
        when(roleRepository.findByName("WAREHOUSE CLERK")).thenReturn(Optional.empty());

        // Ejecutar y verificar excepciones
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(registration);
        });

        assertEquals("Rol WAREHOUSE CLERK no encontrado", exception.getMessage());

        // Verificar las interacciones
        verify(jpaUserRepository, times(1)).findByEmail(registration.getEmail());
        verify(passwordEncoder, times(1)).encode(registration.getPassword());
        verify(roleRepository, times(1)).findByName("WAREHOUSE CLERK");
        verify(jpaUserRepository, never()).save(any());
    }
    @Test
    void updateUser_Success() {
        Long userId = 1L;
        UserDto updatedUserDto = new UserDto();
        updatedUserDto.setEmail("new.email@example.com");
        updatedUserDto.setStatus("INACTIVE");
        updatedUserDto.setFirstName("NuevoNombre");
        updatedUserDto.setLastName("NuevoApellido");
        updatedUserDto.setRoles(Set.of("ADMIN"));

        // Usuario existente en la base de datos
        User existingUser = new User();
        existingUser.setIdUser(userId);
        existingUser.setEmail("old.email@example.com");
        existingUser.setStatus(Status.ACTIVE);
        UserProfile profile = new UserProfile();
        profile.setFirstName("OldName");
        profile.setLastName("OldLastName");
        existingUser.setUserProfile(profile);

        // Mocking: findById
        when(jpaUserRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        // Mocking: findByName para rol "ADMIN"
        Role adminRole = new Role();
        adminRole.setIdRole(2L);
        adminRole.setName("ADMIN");
        when(roleRepository.findByName("ADMIN")).thenReturn(Optional.of(adminRole));

        // Mocking: save
        when(jpaUserRepository.save(existingUser)).thenReturn(existingUser);

        // Ejecutar el método a probar
        UserDto result = userService.updateUser(userId, updatedUserDto);

        // Verificar los resultados
        assertNotNull(result);
        assertEquals("new.email@example.com", result.getEmail());
        assertEquals("INACTIVE", result.getStatus());
        assertEquals("NuevoNombre", result.getFirstName());
        assertEquals("NuevoApellido", result.getLastName());
        assertTrue(result.getRoles().contains("ADMIN"));

        // Verificar las interacciones
        verify(jpaUserRepository, times(1)).findById(userId);
        verify(roleRepository, times(1)).findByName("ADMIN");
        verify(jpaUserRepository, times(1)).save(existingUser);
    }

}*/