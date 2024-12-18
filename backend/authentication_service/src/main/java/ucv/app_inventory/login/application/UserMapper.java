package ucv.app_inventory.login.application;

import ucv.app_inventory.login.adapters.controller.dto.UserDto;
import ucv.app_inventory.login.domain.model.MaritalStatus;
import ucv.app_inventory.login.domain.model.Role;
import ucv.app_inventory.login.domain.model.Sex;
import ucv.app_inventory.login.domain.model.User;

import java.util.Set;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserDto toUserDto(User user) {
        if (user == null || user.getUserProfile() == null) {
            return null;
        }

        UserDto userDto = new UserDto();
        userDto.setIdUser(user.getIdUser());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getUserProfile().getFirstName());
        userDto.setLastName(user.getUserProfile().getLastName());
        userDto.setDni(user.getUserProfile().getDni());
        userDto.setAge(user.getUserProfile().getAge());
        userDto.setBirthDate(user.getUserProfile().getBirthDate());
        userDto.setAddress(user.getUserProfile().getAddress());
        userDto.setPhone(user.getUserProfile().getPhone());
        userDto.setSex(String.valueOf(user.getUserProfile().getSex()));
        userDto.setMaritalStatus(String.valueOf(user.getUserProfile().getMaritalStatus()));
        userDto.setRoles(extractRoleNames(user.getRoles()));
        userDto.setStatus(user.getStatus().toString());
        return userDto;
    }

    public static User toUser(UserDto userDto, User user) {
        if (userDto == null || user == null) {
            return null;
        }

        user.setEmail(userDto.getEmail());
        if (user.getUserProfile() != null) {
            user.getUserProfile().setFirstName(userDto.getFirstName());
            user.getUserProfile().setLastName(userDto.getLastName());
            user.getUserProfile().setDni(userDto.getDni());
            user.getUserProfile().setAge(userDto.getAge());
            user.getUserProfile().setBirthDate(userDto.getBirthDate());
            user.getUserProfile().setAddress(userDto.getAddress());
            user.getUserProfile().setPhone(userDto.getPhone());
            user.getUserProfile().setSex(Sex.valueOf(userDto.getSex()));
            user.getUserProfile().setMaritalStatus(MaritalStatus.valueOf(userDto.getMaritalStatus()));
        }
        return user;
    }

    private static Set<String> extractRoleNames(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
}