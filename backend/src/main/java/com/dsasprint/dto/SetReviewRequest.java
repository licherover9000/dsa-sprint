package com.dsasprint.dto;

import jakarta.validation.constraints.NotNull;

public record SetReviewRequest(@NotNull Boolean needsReview) {}
