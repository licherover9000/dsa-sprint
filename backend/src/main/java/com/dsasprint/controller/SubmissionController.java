package com.dsasprint.controller;

import com.dsasprint.dto.CreateSubmissionRequest;
import com.dsasprint.dto.HeatmapEntry;
import com.dsasprint.dto.SetReviewRequest;
import com.dsasprint.dto.SubmissionResponse;
import com.dsasprint.service.SubmissionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse create(@AuthenticationPrincipal String username,
                                     @Valid @RequestBody CreateSubmissionRequest request) {
        return submissionService.create(username, request);
    }

    @GetMapping
    public List<SubmissionResponse> list(@AuthenticationPrincipal String username) {
        return submissionService.list(username);
    }

    @GetMapping("/review")
    public List<SubmissionResponse> reviewQueue(@AuthenticationPrincipal String username) {
        return submissionService.reviewQueue(username);
    }

    @PatchMapping("/{submissionId}/review")
    public SubmissionResponse setNeedsReview(@AuthenticationPrincipal String username,
                                             @PathVariable Long submissionId,
                                             @Valid @RequestBody SetReviewRequest request) {
        return submissionService.setNeedsReview(username, submissionId, request.needsReview());
    }

    @GetMapping("/streak")
    public Map<String, Integer> streak(@AuthenticationPrincipal String username) {
        return Map.of("streak", submissionService.currentPotdStreak(username));
    }

    @GetMapping("/heatmap")
    public List<HeatmapEntry> heatmap(@AuthenticationPrincipal String username) {
        return submissionService.heatmap(username);
    }
}
