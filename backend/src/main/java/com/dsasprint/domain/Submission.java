package com.dsasprint.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "submissions", indexes = {
        @Index(name = "idx_submission_user_date", columnList = "user_id,date_solved")
})
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "problem_title", nullable = false, length = 160)
    private String problemTitle;

    @Column(name = "problem_url", length = 600)
    private String problemUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private Platform platform;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private SubmissionCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Difficulty difficulty;

    @Column(name = "date_solved", nullable = false)
    private LocalDate dateSolved;

    @Column(name = "approach_notes", columnDefinition = "TEXT")
    private String approachNotes;

    @Column(name = "needs_review", nullable = false)
    private boolean needsReview;

    protected Submission() {}

    public Submission(User user, String problemTitle, String problemUrl, Platform platform,
                      SubmissionCategory category, Difficulty difficulty, LocalDate dateSolved,
                      String approachNotes, boolean needsReview) {
        this.user = user;
        this.problemTitle = problemTitle;
        this.problemUrl = problemUrl;
        this.platform = platform;
        this.category = category;
        this.difficulty = difficulty;
        this.dateSolved = dateSolved;
        this.approachNotes = approachNotes;
        this.needsReview = needsReview;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getProblemTitle() { return problemTitle; }
    public String getProblemUrl() { return problemUrl; }
    public Platform getPlatform() { return platform; }
    public SubmissionCategory getCategory() { return category; }
    public Difficulty getDifficulty() { return difficulty; }
    public LocalDate getDateSolved() { return dateSolved; }
    public String getApproachNotes() { return approachNotes; }
    public boolean isNeedsReview() { return needsReview; }
    public void setNeedsReview(boolean needsReview) { this.needsReview = needsReview; }
}
