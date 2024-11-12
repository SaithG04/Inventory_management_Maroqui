package ucv.app_inventory.login.application;

import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.domain.model.Status;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserService {

    public Optional<User> findByEmail(String email);

    public List<User> findByStatus(Status status);

    //public List<User> findByFullname(String fullname);

    public List<User> findByRoles_Name(String name);

    public long countByStatus(Status status);

    public Optional<User> findByEmailAndStatus(String email, Status status);

    public List<User> findByCreatedAtAfter(LocalDateTime date);

    public void invalidateRefreshTokenByEmail(String email);
}
