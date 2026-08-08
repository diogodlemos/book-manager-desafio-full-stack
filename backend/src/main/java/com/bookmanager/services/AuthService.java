package com.bookmanager.services;

import com.bookmanager.dto.LoginRequestDTO;
import com.bookmanager.dto.RegisterUserRequestDTO;
import com.bookmanager.entities.User;
import com.bookmanager.exceptions.EmailAlreadyExistsException;
import com.bookmanager.repositories.UserRepository;
import com.bookmanager.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public User register(RegisterUserRequestDTO request) {


        if(userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyExistsException(
                    "Email já cadastrado"
            );
        }

        User user = new User();

        user.setName(request.name());
        user.setEmail(request.email());

        user.setPassword(
                passwordEncoder.encode(request.password())
        );

        return userRepository.save(user);
    }

    public String login(LoginRequestDTO request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException("Email ou senha inválidos")
                );


        if(!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {
            throw new RuntimeException("Email ou senha inválidos");
        }


        return jwtService.generateToken(user);
    }
}
