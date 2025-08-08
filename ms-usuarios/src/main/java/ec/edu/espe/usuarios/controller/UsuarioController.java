package ec.edu.espe.usuarios.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private static final List<Map<String, String>> usuarios = new ArrayList<>();

    @GetMapping
    public List<Map<String, String>> getUsuarios() {
        return usuarios;
    }

    @PostMapping
    public Map<String, String> crearUsuario(@RequestBody Map<String, String> usuario) {
        usuarios.add(usuario);
        return usuario;
    }
}

