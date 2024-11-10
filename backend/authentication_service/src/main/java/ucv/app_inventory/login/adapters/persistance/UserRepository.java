package ucv.app_inventory.login.adapters.persistance;

import ucv.app_inventory.login.domain.model.Usuario;
import ucv.app_inventory.login.domain.model.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import ucv.app_inventory.login.domain.repository.IUserRepository;

@Repository
public class UserRepository implements IUserRepository {

    private final JpaUserRepository jpaUsuarioRepositorio;

    @Autowired
    public UserRepository(JpaUserRepository jpaUsuarioRepositorio) {
        this.jpaUsuarioRepositorio = jpaUsuarioRepositorio;
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return jpaUsuarioRepositorio.findByEmail(email);
    }

    @Override
    public List<Usuario> findByStatus(Status status) {
        return jpaUsuarioRepositorio.findByStatus(status);
    }

    @Override
    public List<Usuario> findByFullname(String fullname) {
        return jpaUsuarioRepositorio.findByFullname(fullname);
    }

    @Override
    public List<Usuario> findByRoles_Name(String name) {
        return jpaUsuarioRepositorio.findByRoles_Name(name);
    }

    @Override
    public long countByStatus(Status status) {
        return jpaUsuarioRepositorio.countByStatus(status);
    }

    @Override
    public Optional<Usuario> findByEmailAndStatus(String email, Status status) {
        return jpaUsuarioRepositorio.findByEmailAndStatus(email, status);
    }

    @Override
    public List<Usuario> findByCreatedAtAfter(LocalDateTime date) {
        return jpaUsuarioRepositorio.findByCreatedAtAfter(date);
    }

    @Override
    @Transactional
    public void invalidateRefreshTokenByEmail(String email) {
        jpaUsuarioRepositorio.invalidateRefreshTokenByEmail(email);
    }
}
