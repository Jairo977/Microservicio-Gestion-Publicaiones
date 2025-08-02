package publicaciones.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import publicaciones.dto.LibroDto;
import publicaciones.dto.ResponseDto;
import publicaciones.model.Autor;
import publicaciones.model.Libro;
import publicaciones.producer.NotificacionProducer;
import publicaciones.repository.AutorRepository;
import publicaciones.repository.LibroRepository;

import java.util.List;

@Service
public class LibroService {

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private NotificacionProducer notificacionProducer;

    public ResponseDto crearLibro(LibroDto dto) {
        Autor autor = autorRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new RuntimeException("No existe el autor con id: " + dto.getAutorId()));
        Libro libro = new Libro();
        libro.setAutor(autor);
        libro.setTitulo(dto.getTitulo());
        libro.setGenero(dto.getGenero());
        libro.setIsbn(dto.getIsbn());
        libro.setNumeroPaginas(dto.getNumeroPaginas());
        libro.setEditorial(dto.getEditorial());
        libro.setAnioPublicacion(dto.getAnioPublicacion());
        libro.setResumen(dto.getResumen());

        Libro savedLibro = libroRepository.save(libro);

        notificacionProducer.enviarNotificacion(
                "Libro: "+dto.getTitulo()+" registrado",
                "Nuevo Libro"
        );

        return new ResponseDto(
                "Libro registrado exitosamente",
                savedLibro);
    }

    public List<Libro> listarLibros() {
        return libroRepository.findAll();
    }

}
