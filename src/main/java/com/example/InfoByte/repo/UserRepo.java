package com.example.InfoByte.repo;

import com.example.InfoByte.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepo extends MongoRepository<User, String> {

    // Spring Data will automatically create a 'findByEmail' method for us
    Optional<User> findByEmail(String email);
}