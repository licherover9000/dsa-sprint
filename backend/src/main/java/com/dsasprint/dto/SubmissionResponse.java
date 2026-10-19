package com.dsasprint.dto;

import com.dsasprint.domain.Difficulty;
import com.dsasprint.domain.Platform;
import com.dsasprint.domain.Submission;
import com.dsasprint.domain.SubmissionCategory;
import java.time.LocalDate;

public record SubmissionResponse(
        Long id,
        String problemTitle,
        String problemUrl,
        Platform platform,
        SubmissionCategory category,
        Difficulty difficulty,
        LocalDate dateSolved,
        String approachNotes,
        boolean needsReview
) {
    public static SubmissionResponse from(Submission submission) {
        return new SubmissionResponse(
                submission.getId(), submission.getProblemTitle(), submission.getProblemUrl(),
                submission.getPlatform(), submission.getCategory(), submission.getDifficulty(),
                submission.getDateSolved(), submission.getApproachNotes(), submission.isNeedsReview());
    }
}
