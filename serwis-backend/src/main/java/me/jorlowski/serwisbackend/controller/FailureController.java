package me.jorlowski.serwisbackend.controller;

import com.fasterxml.jackson.databind.ser.std.JsonValueSerializer;
import me.jorlowski.serwisbackend.model.EditFailure;
import me.jorlowski.serwisbackend.model.FailureEntity;
import me.jorlowski.serwisbackend.model.NewFailure;
import me.jorlowski.serwisbackend.model.Status;
import me.jorlowski.serwisbackend.service.FailureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/failures")
@CrossOrigin
public class FailureController {
    private final FailureService failureService;

    public FailureController(FailureService failureService) {
        this.failureService = failureService;
    }

    @GetMapping
    public ResponseEntity<List<FailureEntity>> index() {
       List<FailureEntity> failures = failureService.getFailures();
       if (failures != null) {
           return ResponseEntity.ok(failures);
       }
       return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EditFailure> getFailureById(@PathVariable Long id) {
        FailureEntity failure = failureService.getById(id);
        EditFailure editFailure = new EditFailure(
                failure.getServicerName(),
                failure.getPotentialPrice(),
                failure.getPotentialDate(),
                failure.getStatus().toString(),
                failure.getRepairDescription()
        );
        if (failure != null) {
            return ResponseEntity.ok(editFailure);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/new-failure")
    public ResponseEntity<FailureEntity> newFailure(@Validated @RequestBody NewFailure newFailure) {
        return new ResponseEntity<>(failureService.create(newFailure), HttpStatus.CREATED);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<FailureEntity> editFailure(@RequestBody EditFailure editFailure, @PathVariable Long id) {
        FailureEntity failureEntity = failureService.getById(id);
        failureEntity.setServicerName(editFailure.servicerName());
        failureEntity.setPotentialPrice(editFailure.potentialPrice());
        failureEntity.setPotentialDate(editFailure.potentialDate());
        failureEntity.setStatus(Status.valueOf(editFailure.status()));
        failureEntity.setRepairDescription(editFailure.repairDescription());
        return new ResponseEntity<>(failureService.edit(failureEntity), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFailureById(@PathVariable Long id) {
        failureService.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
