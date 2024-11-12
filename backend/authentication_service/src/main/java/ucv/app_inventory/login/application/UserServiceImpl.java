package ucv.app_inventory.login.application;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.login.adapters.persistance.JpaUserRepository;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;

@Service
public class UserServiceImpl implements UserService{

    private final JpaUserRepository jpaUsuarioRepositorio;

    @Autowired
    public UserServiceImpl (JpaUserRepository jpaUsuarioRepositorio) {
        this.jpaUsuarioRepositorio = jpaUsuarioRepositorio;
    }

    public Optional<User> findByEmail(String email) {
        return jpaUsuarioRepositorio.findByEmail(email);
    }

    public List<User> findByStatus(Status status) {
        return jpaUsuarioRepositorio.findByStatus(status);
    }

    /*public List<User> findByFullname(String fullname) {
        return jpaUsuarioRepositorio.findByFullname(fullname);
    }*/

    public List<User> findByRoles_Name(String name) {
        return jpaUsuarioRepositorio.findByRoles_Name(name);
    }

    public long countByStatus(Status status) {
        return jpaUsuarioRepositorio.countByStatus(status);
    }

    public Optional<User> findByEmailAndStatus(String email, Status status) {
        return jpaUsuarioRepositorio.findByEmailAndStatus(email, status);
    }

    public List<User> findByCreatedAtAfter(LocalDateTime date) {
        return jpaUsuarioRepositorio.findByCreatedAtAfter(date);
    }

    @Transactional
    public void invalidateRefreshTokenByEmail(String email) {
        jpaUsuarioRepositorio.invalidateRefreshTokenByEmail(email);
    }
}
