package ucv.app_inventory.login.application;

import ucv.app_inventory.login.domain.model.Usuario;
import ucv.app_inventory.login.domain.model.Status;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserService {

    public Optional<Usuario> findByEmail(String email);

    public List<Usuario> findByStatus(Status status);

    public List<Usuario> findByFullname(String fullname);

    public List<Usuario> findByRoles_Name(String name);

    public long countByStatus(Status status);

    public Optional<Usuario> findByEmailAndStatus(String email, Status status);

    public List<Usuario> findByCreatedAtAfter(LocalDateTime date);

    public void invalidateRefreshTokenByEmail(String email);
}
