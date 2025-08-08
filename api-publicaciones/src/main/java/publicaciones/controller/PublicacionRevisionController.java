package publicaciones.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

@RestController
public class PublicacionRevisionController {
    @GetMapping("/publicaciones/en-revision")
    public List<Map<String, Object>> getPublicacionesEnRevision() {
        // Respuesta de prueba, puedes reemplazar por lógica real
        return Arrays.asList(
            Map.of(
                "id", 1,
                "titulo", "Ejemplo de publicación en revisión",
                "estado", "EN_REVISION",
                "versionActual", 1,
                "resumen", "Resumen de ejemplo para publicación en revisión."
            )
        );
    }
}

