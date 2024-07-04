package com.chatapp.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class TokenProvider {

    private final SecretKey key;

    @Autowired
    public TokenProvider(JwtConstant jwtConstant) {
        this.key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
    }

    public String generateToken(Authentication authentication) {
        return Jwts.builder()
                .setIssuer("Admin")
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000)) // 1 day expiration
                .claim("email", authentication.getName())
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String jwt) {
        try {
            Claims claim = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt.substring(7))
                    .getBody();

            return String.valueOf(claim.get("email"));
        } catch (Exception e) {
            throw new BadCredentialsException("Failed to parse JWT token", e);
        }
    }
}
