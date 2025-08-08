package ec.notificaciones.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz.anyRequest().permitAll())
            .cors(cors -> cors.configurationSource(request -> {
                var c = new org.springframework.web.cors.CorsConfiguration();
                c.addAllowedOriginPattern("*");
                c.addAllowedHeader("*");
                c.addAllowedMethod("*");
                c.setAllowCredentials(true);
                return c;
            }));
        return http.build();
    }
}
