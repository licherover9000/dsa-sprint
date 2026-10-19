package com.dsasprint.service;

import com.dsasprint.domain.User;
import com.dsasprint.dto.AuthRequest;
import com.dsasprint.dto.AuthResponse;
import com.dsasprint.repository.UserRepository;
import com.dsasprint.security.JwtService;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(AuthRequest request) {
        String username = normalize(request.username());
        if (users.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That username is already taken");
        }
        User user = users.save(new User(username, passwordEncoder.encode(request.password())));
        return response(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        String username = normalize(request.username());
        User user = users.findByUsername(username)
                .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Username or password is incorrect"));
        return response(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse.UserProfile profile(String username) {
        return users.findByUsername(normalize(username))
                .map(user -> new AuthResponse.UserProfile(user.getId(), user.getUsername(), user.getRole()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found"));
    }

    private AuthResponse response(User user) {
        return new AuthResponse(jwtService.issue(user.getUsername()),
                new AuthResponse.UserProfile(user.getId(), user.getUsername(), user.getRole()));
    }

    private String normalize(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }
}
