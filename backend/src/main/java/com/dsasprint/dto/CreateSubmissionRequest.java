package com.dsasprint.dto;

import com.dsasprint.domain.Difficulty;
import com.dsasprint.domain.Platform;
import com.dsasprint.domain.SubmissionCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateSubmissionRequest(
        @NotBlank @Size(max = 160) String problemTitle,
        @Size(max = 600) String problemUrl,
        @NotNull Platform platform,
        @NotNull SubmissionCategory category,
        @NotNull Difficulty difficulty,
        @NotNull LocalDate dateSolved,
        @Size(max = 20000) String approachNotes,
        boolean needsReview
) {}
