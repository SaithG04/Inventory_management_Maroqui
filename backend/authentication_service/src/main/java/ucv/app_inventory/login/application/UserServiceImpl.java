package ucv.app_inventory.login.application;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.login.adapters.persistance.JpaUserRepository;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.Usuario;

@Service
public class UserServiceImpl implements UserService{

    private final JpaUserRepository jpaUsuarioRepositorio;

    @Autowired
    public UserServiceImpl (JpaUserRepository jpaUsuarioRepositorio) {
        this.jpaUsuarioRepositorio = jpaUsuarioRepositorio;
    }

    public Optional<Usuario> findByEmail(String email) {
        return jpaUsuarioRepositorio.findByEmail(email);
    }

    public List<Usuario> findByStatus(Status status) {
        return jpaUsuarioRepositorio.findByStatus(status);
    }

    public List<Usuario> findByFullname(String fullname) {
        return jpaUsuarioRepositorio.findByFullname(fullname);
    }

    public List<Usuario> findByRoles_Name(String name) {
        return jpaUsuarioRepositorio.findByRoles_Name(name);
    }

    public long countByStatus(Status status) {
        return jpaUsuarioRepositorio.countByStatus(status);
    }

    public Optional<Usuario> findByEmailAndStatus(String email, Status status) {
        return jpaUsuarioRepositorio.findByEmailAndStatus(email, status);
    }

    public List<Usuario> findByCreatedAtAfter(LocalDateTime date) {
        return jpaUsuarioRepositorio.findByCreatedAtAfter(date);
    }

    @Transactional
    public void invalidateRefreshTokenByEmail(String email) {
        jpaUsuarioRepositorio.invalidateRefreshTokenByEmail(email);
    }
}
