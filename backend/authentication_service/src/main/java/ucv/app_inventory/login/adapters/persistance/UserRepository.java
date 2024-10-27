package ucv.app_inventory.login.adapters.persistance;

import ucv.app_inventory.login.domain.model.Usuario;
import ucv.app_inventory.login.domain.repository.IUsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository implements IUsuarioRepositorio {

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
    public List<Usuario> findByStatus(String status) {
        return jpaUsuarioRepositorio.findByStatus(status);
    }

    @Override
    public List<Usuario> findByFullname(String fullname) {
        return jpaUsuarioRepositorio.findByFullname(fullname);
    }

    @Override
    public List<Usuario> findByRole(String role) {
        return jpaUsuarioRepositorio.findByRole(role);
    }

    @Override
    public long countByStatus(String status) {
        return jpaUsuarioRepositorio.countByStatus(status);
    }

    @Override
    public Optional<Usuario> findByEmailAndStatus(String email, String status) {
        return jpaUsuarioRepositorio.findByEmailAndStatus(email, status);
    }

    @Override
    public List<Usuario> findByCreatedAtAfter(LocalDateTime date) {
        return jpaUsuarioRepositorio.findByCreatedAtAfter(date);
    }
}
