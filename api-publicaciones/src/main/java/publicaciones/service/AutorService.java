package publicaciones.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import publicaciones.dto.AutorDto;
import publicaciones.dto.ResponseDto;
import publicaciones.model.Autor;
import publicaciones.producer.NotificacionProducer;
import publicaciones.repository.AutorRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AutorService {

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private NotificacionProducer notificacionProducer;

    //create
    public ResponseDto crearAutor(AutorDto dto) {
        Autor autor = new Autor();
        autor.setNombre(dto.getNombre());
        autor.setApellido(dto.getApellido());
        autor.setEmail(dto.getEmail());
        autor.setNacionalidad(dto.getNacionalidad());
        autor.setInstitucion(dto.getInstitucion());
        autor.setOrcid(dto.getOrcid());

        notificacionProducer.enviarNotificacion(
                "Nuevo autor registrado"+dto.getNombre(),
                "nuevo autor"
        );

        return new ResponseDto(
                "Autor registrado exitosamente",
                autorRepository.save(autor));
    }

    public List<ResponseDto> listarAutores() {
        return autorRepository.findAll().stream()
                .map(autor -> new ResponseDto("Autor: " + autor.getApellido(), autor))
                .collect(Collectors.toList());
    }

    public List<Autor> autores() {
        return autorRepository.findAll();
    }

    public ResponseDto autorPorId(Long id) {
        Autor autor = autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el autor con id: " + id));
        return new ResponseDto("Autor con id " + autor.getId(), autor);
    }

    public ResponseDto actualizarAutor(Long id, AutorDto dto) {
        Autor autor = autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el autor con id: " + id));

        autor.setNombre(dto.getNombre());
        autor.setApellido(dto.getApellido());
        autor.setEmail(dto.getEmail());
        autor.setNacionalidad(dto.getNacionalidad());
        autor.setInstitucion(dto.getInstitucion());
        autor.setOrcid(dto.getOrcid());

        return new ResponseDto(
                "Autor actualizado exitosamente",
                autorRepository.save(autor));
    }


}
