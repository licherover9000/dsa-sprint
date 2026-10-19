package com.dsasprint.repository;

import com.dsasprint.domain.Submission;
import com.dsasprint.domain.SubmissionCategory;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findAllByUser_IdOrderByDateSolvedDescIdDesc(Long userId);

    List<Submission> findAllByUser_IdAndDateSolved(Long userId, LocalDate dateSolved);

    List<Submission> findAllByUser_IdAndNeedsReviewTrueOrderByDateSolvedAsc(Long userId);

    java.util.Optional<Submission> findByIdAndUser_Id(Long id, Long userId);

    @Query("select distinct s.dateSolved from Submission s "
            + "where s.user.id = :userId and s.category = :category order by s.dateSolved desc")
    List<LocalDate> findDistinctSolveDates(@Param("userId") Long userId,
                                            @Param("category") SubmissionCategory category);

    @Query("select s.dateSolved, count(s) from Submission s "
            + "where s.user.id = :userId and s.dateSolved >= :fromDate "
            + "group by s.dateSolved order by s.dateSolved")
    List<Object[]> countByDateSince(@Param("userId") Long userId,
                                     @Param("fromDate") LocalDate fromDate);
}
