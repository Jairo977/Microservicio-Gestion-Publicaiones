package ec.edu.espe.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @PersistenceContext
    private EntityManager entityManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Faltan credenciales");
        }
        Query query = entityManager.createNativeQuery("SELECT u.id, u.username, u.password, ur.role_id, r.name FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE u.username = ? AND u.password = ?");
        query.setParameter(1, username);
        query.setParameter(2, password);
        java.util.List<?> result = query.getResultList();
        if (result.isEmpty()) {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
        Object[] row = (Object[]) result.get(0);
        Map<String, Object> response = new HashMap<>();
        response.put("token", "fake-jwt-token"); // Aquí deberías generar un JWT real
        response.put("rol", row[4]); // El nombre del rol
        return ResponseEntity.ok(response);
    }
}
