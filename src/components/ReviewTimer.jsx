// src/components/ReviewTimer.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { fetchJSON, withCreds } from '../api/client';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const ReviewTimer = ({ nextReviewAt, waitingUntil, isOverdue, overdueDeadline, isFromWrongAnswer, frozenUntil, isMastered, className = "" }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [isReviewable, setIsReviewable] = useState(false);
    const [accelerationFactor, setAccelerationFactor] = useState(1); // 시간 가속 팩터

    // 시간 가속 팩터 가져오기 (5초마다 갱신)
    useEffect(() => {
        const fetchAccelerationFactor = async () => {
            try {
                const response = await fetchJSON('/time-accelerator/status');
                const factor = response.data?.accelerationFactor || 1;
                setAccelerationFactor(factor);
            } catch (e) {
                console.error('Failed to fetch acceleration factor:', e);
                setAccelerationFactor(1); // 기본값
            }
        };
        
        // 즉시 실행
        fetchAccelerationFactor();
        
        // 5초마다 가속 팩터 확인
        const interval = setInterval(fetchAccelerationFactor, 5000);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // nextReviewAt이 없어도 overdue, frozen 등의 상태는 확인해야 함
        if (!nextReviewAt && !isOverdue && !frozenUntil && !waitingUntil) {
            return;
        }

        const updateTimer = () => {
            // 현재 시간 (가속 팩터는 서버에서 이미 적용되어 있으므로 실제 현재 시간 사용)
            const now = dayjs().tz('Asia/Seoul');
            
            // 디버깅 로그 추가
            console.log('[ReviewTimer DEBUG]', {
                nextReviewAt,
                waitingUntil,
                isOverdue,
                overdueDeadline,
                isFromWrongAnswer,
                frozenUntil,
                accelerationFactor
            });
            
            // 디버깅 로그 (개발 중에만)
            if (isOverdue && isFromWrongAnswer && accelerationFactor > 1) {
                console.log(`[ReviewTimer] Acceleration Debug:`);
                console.log(`  accelerationFactor: ${accelerationFactor}x`);
                console.log(`  now: ${now.toISOString()}`);
                console.log(`  overdueDeadline: ${overdueDeadline}`);
                if (overdueDeadline) {
                    const deadlineTime = dayjs.utc(overdueDeadline).tz('Asia/Seoul');
                    const diff = deadlineTime.diff(now);
                    console.log(`  diff hours: ${Math.round(diff / (60 * 60 * 1000))}`);
                }
            }
            
            // 1. 동결 상태 확인 (최우선)
            if (frozenUntil) {
                const frozenTime = dayjs.utc(frozenUntil).tz('Asia/Seoul');
                const frozenDiff = frozenTime.diff(now);
                
                if (frozenDiff > 0) {
                    // 아직 동결 중
                    const duration = dayjs.duration(frozenDiff);
                    const hours = Math.floor(duration.asHours());
                    const minutes = duration.minutes();
                    const seconds = duration.seconds();

                    let timeString;
                    if (accelerationFactor > 1 && hours === 0 && minutes < 60) {
                        // 가속 상태에서는 분/초만 표시
                        timeString = `❄️ ${minutes}분 ${seconds}초 후 복습 재개 (${accelerationFactor}x 가속)`;
                    } else {
                        timeString = `❄️ 동결: `;
                        if (hours > 0) {
                            timeString += `${hours}시간 `;
                        }
                        timeString += `${minutes}분 ${seconds}초 후 복습 재개`;
                    }

                    setTimeLeft(timeString);
                    setIsReviewable(false);
                    console.log('[ReviewTimer DEBUG] Frozen state:', timeString);
                    return;
                } else {
                    // 동결 해제되었지만 아직 서버에서 overdue로 전환되지 않음
                    if (accelerationFactor > 1) {
                        setTimeLeft("⚡ 동결 해제 중... (곧 복습 가능)");
                    } else {
                        setTimeLeft("🔄 동결 해제 중... (10분 내 복습 가능)");
                    }
                    setIsReviewable(false);
                    console.log('[ReviewTimer DEBUG] Frozen unfreezing state');
                    return;
                }
            }
            
            // 2. overdue 상태인 경우 처리
            if (isOverdue) {
                if (isFromWrongAnswer) {
                    // 오답 카드: overdue 상태에서 복습 가능하지만 24시간 데드라인까지 타이머 표시
                    if (overdueDeadline) {
                        const deadlineTime = dayjs.utc(overdueDeadline).tz('Asia/Seoul');
                        // overdueDeadline은 서버에서 가속 시간이 적용되어 설정되므로 현재 시간과 비교
                        const diff = deadlineTime.diff(now);
                        
                        if (diff <= 0) {
                            // overdue 데드라인이 지났을 때: 동결 전환 대기 상태로 표시
                            if (accelerationFactor > 1) {
                                setTimeLeft("❄️ 동결 전환 중... (곧 동결됨)");
                            } else {
                                setTimeLeft("❄️ 동결 전환 중... (10분 내 동결)");
                            }
                            setIsReviewable(false);
                            console.log('[ReviewTimer DEBUG] Overdue deadline exceeded, waiting for freeze');
                            return;
                        }
                        
                        const duration = dayjs.duration(diff);
                        const hours = Math.floor(duration.asHours());
                        const minutes = duration.minutes();
                        const seconds = duration.seconds();

                        let timeString = "✅ 복습 가능! ";
                        if (accelerationFactor > 1 && hours === 0 && minutes < 60) {
                            // 가속 상태에서는 분/초만 표시
                            timeString += `(${minutes}분 ${seconds}초 후 초기화, ${accelerationFactor}x 가속)`;
                        } else {
                            if (hours > 0) {
                                timeString += `(${hours}시간 `;
                            } else {
                                timeString += `(`;
                            }
                            timeString += `${minutes}분 ${seconds}초 후 초기화)`;
                        }

                        setTimeLeft(timeString);
                        setIsReviewable(true);
                        return;
                    } else {
                        setTimeLeft("복습 가능!");
                        setIsReviewable(true);
                        return;
                    }
                } else {
                    // 일반 카드 overdue: overdueDeadline까지의 24시간 카운트다운 표시
                    if (overdueDeadline) {
                        const deadlineTime = dayjs.utc(overdueDeadline).tz('Asia/Seoul');
                        // overdueDeadline은 서버에서 실제 현재 시간 기준으로 설정되므로 실제 현재 시간과 비교
                        const realNow = dayjs().tz('Asia/Seoul'); // 타임머신 오프셋 적용 안 함
                        const deadlineDiff = deadlineTime.diff(realNow);
                        
                        if (deadlineDiff <= 0) {
                            // overdue 데드라인이 지났을 때: stage별 초기 타이머 표시 (정답 카드의 경우)
                            // Stage별 대기 시간: [0, 3, 7, 14, 30, 60, 120] 일
                            const stageDays = [0, 3, 7, 14, 30, 60, 120];
                            const currentStage = Math.min(Math.max(nextReviewAt ? 1 : 0, 0), 6); // 추정 stage
                            const days = stageDays[currentStage] || 3; // 기본 3일
                            
                            const stageTimer = now.add(days, 'day');
                            const stageTimerDiff = stageTimer.diff(now);
                            const stageTimerDuration = dayjs.duration(stageTimerDiff);
                            
                            setTimeLeft(`⏳ ${Math.floor(stageTimerDuration.asDays())}일 ${stageTimerDuration.hours()}시간 후 복습`);
                            setIsReviewable(false); // 대기 중이므로 복습 불가
                            return;
                        }
                        
                        const duration = dayjs.duration(deadlineDiff);
                        const hours = Math.floor(duration.asHours());
                        const minutes = duration.minutes();
                        const seconds = duration.seconds();

                        let timeString = "⚠️ ";
                        if (hours > 0) {
                            timeString += `${hours}시간 `;
                        }
                        timeString += `${minutes}분 ${seconds}초 후 초기화`;

                        setTimeLeft(timeString);
                        setIsReviewable(true);
                        return;
                    } else {
                        setTimeLeft("복습 가능!");
                        setIsReviewable(true);
                        return;
                    }
                }
            }
            
            // 오답 단어의 대기 상태 처리 (isFromWrongAnswer = true, 단 overdue가 아닐 때만)
            if (isFromWrongAnswer && !isOverdue) {
                // waitingUntil이 있으면 이를 기준으로, 없으면 nextReviewAt 기준으로 24시간 대기 표시
                const targetTime = waitingUntil ? 
                    dayjs.utc(waitingUntil).tz('Asia/Seoul') : 
                    dayjs.utc(nextReviewAt).tz('Asia/Seoul');
                
                // 오답 카드의 waitingUntil은 서버에서 가속 시간이 적용되어 설정되므로 현재 시간과 비교
                const diff = targetTime.diff(now);
                
                if (accelerationFactor > 1) {
                    console.log(`[ReviewTimer] Wrong answer acceleration debug:`);
                    console.log(`  accelerationFactor: ${accelerationFactor}x`);
                    console.log(`  waitingUntil: ${waitingUntil}`);
                    console.log(`  targetTime: ${targetTime.toISOString()}`);
                    console.log(`  diff minutes: ${Math.round(diff / (60 * 1000))}`);
                }
                
                if (diff <= 0) {
                    // 대기 시간이 지났을 경우: overdue 전환 대기 중
                    if (accelerationFactor > 1) {
                        setTimeLeft("⚡ overdue 전환 중... (곧 복습 가능)");
                    } else {
                        setTimeLeft("🔄 overdue 전환 중... (10분 내 복습 가능)");
                    }
                    setIsReviewable(false);
                    return;
                }
                
                // 가속된 24시간 대기 카운트다운 표시
                const duration = dayjs.duration(diff);
                const hours = Math.floor(duration.asHours());
                const minutes = duration.minutes();
                const seconds = duration.seconds();

                let timeString;
                if (accelerationFactor > 1 && hours === 0 && minutes < 60) {
                    // 가속 상태에서는 분/초만 표시
                    timeString = `⏱ ${minutes}분 ${seconds}초 후 복습 대기 (${accelerationFactor}x 가속)`;
                } else {
                    timeString = "⏳ ";
                    if (hours > 0) {
                        timeString += `${hours}시간 `;
                    }
                    timeString += `${minutes}분 ${seconds}초 후 복습 대기`;
                }

                setTimeLeft(timeString);
                setIsReviewable(false);
                return;
            }
            
            // 일반적인 복습일 체크 (overdue가 아닌 일반 카드)
            const reviewTime = dayjs.utc(nextReviewAt).tz('Asia/Seoul');
            const diff = reviewTime.diff(now);

            if (diff <= 0) {
                setIsReviewable(true);
                setTimeLeft("복습 가능!");
                return;
            }

            // waitingUntil이 있으면 이를 사용하여 정확한 대기 시간 표시
            if (waitingUntil) {
                const waitingTime = dayjs.utc(waitingUntil).tz('Asia/Seoul');
                const waitingDiff = waitingTime.diff(now);

                if (waitingDiff <= 0) {
                    // 대기 시간이 지났지만 아직 overdue 플래그가 false인 경우
                    // (크론잡이 아직 실행되지 않은 상태)
                    setIsReviewable(false);
                    if (accelerationFactor > 1) {
                        setTimeLeft("⚡ overdue 전환 중... (곧 복습 가능)");
                    } else {
                        setTimeLeft("🔄 overdue 전환 중... (10분 내 복습 가능)");
                    }
                    return;
                }

                // 정확한 대기 시간 표시
                const duration = dayjs.duration(waitingDiff);
                const days = Math.floor(duration.asDays());
                const hours = duration.hours();
                const minutes = duration.minutes();
                const seconds = duration.seconds();

                let timeString = "";
                if (days > 0) {
                    timeString += `${days}일 `;
                }
                if (hours > 0 || days > 0) {
                    timeString += `${hours}시간 `;
                }
                if (minutes > 0 || hours > 0 || days > 0) {
                    timeString += `${minutes}분 `;
                }
                timeString += `${seconds}초 후 복습 대기`;

                setTimeLeft(timeString);
                setIsReviewable(false);
                return;
            }

            // waitingUntil이 없는 경우 기존 로직 사용 (하위 호환성)
            // 일반 카드의 경우 overdue 시작까지의 시간만 표시 (망각곡선 -1일)
            // nextReviewAt에서 24시간을 뺀 시점까지의 시간 계산
            const overdueStartTime = reviewTime.subtract(24, 'hour');
            const overdueStartDiff = overdueStartTime.diff(now);

            if (overdueStartDiff <= 0) {
                // overdue 시작 시간이 지났지만 아직 overdue 플래그가 false인 경우
                // (크론잡이 아직 실행되지 않은 상태)
                setIsReviewable(false);
                if (accelerationFactor > 1) {
                    setTimeLeft("⚡ overdue 전환 중... (곧 복습 가능)");
                } else {
                    setTimeLeft("🔄 overdue 전환 중... (10분 내 복습 가능)");
                }
                return;
            }

            // overdue 시작까지의 시간 표시
            const duration = dayjs.duration(overdueStartDiff);
            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            let timeString = "";
            if (days > 0) {
                timeString += `${days}일 `;
            }
            if (hours > 0 || days > 0) {
                timeString += `${hours}시간 `;
            }
            if (minutes > 0 || hours > 0 || days > 0) {
                timeString += `${minutes}분 `;
            }
            timeString += `${seconds}초 후 복습 대기`;

            setTimeLeft(timeString);
            setIsReviewable(false);
        };

        // 즉시 실행
        updateTimer();
        
        // 1초마다 업데이트
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [nextReviewAt, waitingUntil, isOverdue, overdueDeadline, isFromWrongAnswer, accelerationFactor]);

    // 마스터된 카드는 별도 표시
    if (isMastered) {
        return <span className={`text-success ${className}`}>🏆 마스터 완료</span>;
    }
    
    // nextReviewAt이 없고 다른 상태도 없으면 복습일 없음 표시
    if (!nextReviewAt && !isOverdue && !frozenUntil && !waitingUntil) {
        return <span className={`text-muted ${className}`}>복습일 없음</span>;
    }

    if (timeLeft === null) {
        return <span className={`text-muted ${className}`}>계산 중...</span>;
    }

    return (
        <span className={`${isReviewable ? (isOverdue ? 'text-warning fw-bold' : 'text-success fw-bold') : 'text-primary'} ${className}`}>
            {isReviewable ? (isOverdue ? "⚠️ " : "✅ ") : "⏰ "}{timeLeft}
        </span>
    );
};

export default ReviewTimer;