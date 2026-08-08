package com.bookmanager.controllers;

import com.bookmanager.dto.LoginRequestDTO;
import com.bookmanager.dto.LoginResponseDTO;
import com.bookmanager.dto.RegisterUserRequestDTO;
import com.bookmanager.dto.UserResponseDTO;
import com.bookmanager.entities.User;
import com.bookmanager.services.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @Valid @RequestBody RegisterUserRequestDTO request
    ) {

        User user = authService.register(request);

        UserResponseDTO response = new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request
    ) {
        String token = authService.login(request);

        return ResponseEntity.ok(
                new LoginResponseDTO(token)
        );
    }
}
