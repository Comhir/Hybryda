package me.jorlowski.serwisbackend.repository;

import me.jorlowski.serwisbackend.model.FailureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FailureRepository extends JpaRepository<FailureEntity, Long> {

}
