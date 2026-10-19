package com.dsasprint.service;

import com.dsasprint.domain.Submission;
import com.dsasprint.domain.SubmissionCategory;
import com.dsasprint.domain.User;
import com.dsasprint.dto.CreateSubmissionRequest;
import com.dsasprint.dto.HeatmapEntry;
import com.dsasprint.dto.SubmissionResponse;
import com.dsasprint.repository.SubmissionRepository;
import com.dsasprint.repository.UserRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SubmissionService {
    private final SubmissionRepository submissions;
    private final UserRepository users;
    private final ZoneId zoneId;

    public SubmissionService(SubmissionRepository submissions, UserRepository users,
                             @Value("${app.time-zone}") String timeZone) {
        this.submissions = submissions;
        this.users = users;
        this.zoneId = ZoneId.of(timeZone);
    }

    @Transactional
    public SubmissionResponse create(String username, CreateSubmissionRequest request) {
        User user = findUser(username);
        Submission saved = submissions.save(new Submission(user, request.problemTitle().trim(),
                blankToNull(request.problemUrl()), request.platform(), request.category(),
                request.difficulty(), request.dateSolved(), blankToNull(request.approachNotes()), request.needsReview()));
        return SubmissionResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> list(String username) {
        User user = findUser(username);
        return submissions.findAllByUser_IdOrderByDateSolvedDescIdDesc(user.getId())
                .stream().map(SubmissionResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> reviewQueue(String username) {
        User user = findUser(username);
        return submissions.findAllByUser_IdAndNeedsReviewTrueOrderByDateSolvedAsc(user.getId())
                .stream().map(SubmissionResponse::from).toList();
    }

    @Transactional
    public SubmissionResponse setNeedsReview(String username, Long submissionId, boolean needsReview) {
        User user = findUser(username);
        Submission submission = submissions.findByIdAndUser_Id(submissionId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
        submission.setNeedsReview(needsReview);
        return SubmissionResponse.from(submission);
    }

    @Transactional(readOnly = true)
    public int currentPotdStreak(String username) {
        User user = findUser(username);
        List<LocalDate> dates = submissions.findDistinctSolveDates(user.getId(), SubmissionCategory.POTD);
        if (dates.isEmpty()) return 0;

        LocalDate today = LocalDate.now(zoneId);
        LocalDate expected = dates.get(0).equals(today) ? today : today.minusDays(1);
        if (!dates.get(0).equals(expected)) return 0;

        int streak = 0;
        for (LocalDate date : dates) {
            if (!date.equals(expected)) break;
            streak++;
            expected = expected.minusDays(1);
        }
        return streak;
    }

    @Transactional(readOnly = true)
    public List<HeatmapEntry> heatmap(String username) {
        User user = findUser(username);
        LocalDate start = LocalDate.now(zoneId).minusDays(364);
        return submissions.countByDateSince(user.getId(), start).stream()
                .map(row -> new HeatmapEntry((LocalDate) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    private User findUser(String username) {
        return users.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found"));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
