package com.bookmanager.services;

import com.bookmanager.dto.RegisterUserRequest;
import com.bookmanager.entities.User;
import com.bookmanager.exceptions.EmailAlreadyExistsException;
import com.bookmanager.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterUserRequest request) {


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
}
