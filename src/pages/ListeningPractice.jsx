import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Reading.css';

export default function ListeningPractice() {
    const [searchParams] = useSearchParams();
    const level = searchParams.get('level') || 'A1';
    const startIndex = parseInt(searchParams.get('start')) || 0;
    const selectedQuestions = searchParams.get('questions')?.split(',').map(Number) || null;
    
    const [listeningData, setListeningData] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(startIndex);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [completedQuestions, setCompletedQuestions] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [showScript, setShowScript] = useState(false);

    useEffect(() => {
        loadListeningData();
    }, [level, startIndex]);

    // 오디오 정리
    useEffect(() => {
        return () => {
            cleanupAudio(currentAudio);
        };
    }, [currentAudio]);

    const loadListeningData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // JSON 파일에서 리스닝 데이터 로드
            const response = await fetch(`/${level}/${level}_Listening/${level}_Listening.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${level} listening data`);
            }
            const result = await response.json();
            
            if (result && Array.isArray(result) && result.length > 0) {
                // 선택된 문제들만 필터링
                if (selectedQuestions && selectedQuestions.length > 0) {
                    const filteredData = selectedQuestions.map(index => result[index]).filter(Boolean);
                    setListeningData(filteredData);
                    setCurrentQuestion(0);
                } else if (!selectedQuestions && startIndex >= 0 && searchParams.get('start')) {
                    // 단일 문제 모드: start 파라미터가 있고 questions 파라미터가 없는 경우
                    const singleQuestion = result[startIndex];
                    if (singleQuestion) {
                        setListeningData([singleQuestion]);
                        setCurrentQuestion(0);
                    } else {
                        setListeningData([]);
                        setError('해당 문제를 찾을 수 없습니다.');
                    }
                } else {
                    // 전체 데이터 로드
                    setListeningData(result);
                    setCurrentQuestion(startIndex);
                }
            } else {
                setListeningData([]);
                setError(`${level} 레벨 리스닝 데이터가 없습니다.`);
            }
            
            // 필터링되지 않은 전체 데이터를 로드한 경우에만 startIndex 사용
            if (!selectedQuestions && startIndex === 0) {
                setCurrentQuestion(startIndex);
            }
            
            setSelectedAnswer(null);
            setShowExplanation(false);
            setIsCorrect(false);
            setScore(0);
            setCompletedQuestions(new Set());
        } catch (err) {
            console.error('Failed to load listening data:', err);
            setError('리스닝 데이터를 불러오는데 실패했습니다.');
            setListeningData([]);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = () => {
        const current = listeningData[currentQuestion];
        if (!current || !current.id) return;

        // 기존 오디오 정리
        if (currentAudio) {
            currentAudio.pause();
        }

        const audioPath = `/${level}/${level}_Listening/${level}_Listening_mix/${current.id}.mp3`;
        const audio = new Audio(audioPath);
        
        console.log('🎵 Attempting to play audio:', audioPath);
        
        const handleLoadStart = () => {
            console.log('🎵 Audio loading started');
            setIsPlaying(true);
        };
        
        const handleCanPlay = () => {
            console.log('🎵 Audio can play');
        };
        
        const handleEnded = () => {
            console.log('🎵 Audio ended');
            setIsPlaying(false);
        };
        
        const handleError = (e) => {
            // 페이지 이탈이나 컴포넌트 언마운트 시 발생하는 자연스러운 오류는 로깅하지 않음
            if (e.target.networkState !== e.target.NETWORK_NO_SOURCE) {
                console.error('❌ Audio playback error:', e);
                console.error('❌ Failed audio path:', audioPath);
                setIsPlaying(false);
                alert(`오디오를 재생할 수 없습니다: ${audioPath}`);
            }
        };
        
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        
        // 이벤트 리스너 정리를 위해 오디오 객체에 핸들러 저장
        audio._handlers = {
            loadstart: handleLoadStart,
            canplay: handleCanPlay,
            ended: handleEnded,
            error: handleError
        };

        // 재생 속도 설정
        audio.playbackRate = playbackRate;
        
        setCurrentAudio(audio);
        
        audio.play().then(() => {
            console.log('🎵 Audio started playing successfully');
        }).catch((error) => {
            console.error('❌ Audio play() failed:', error);
            setIsPlaying(false);
            alert(`오디오 재생에 실패했습니다: ${error.message}`);
        });
    };

    const changePlaybackRate = (rate) => {
        setPlaybackRate(rate);
        if (currentAudio) {
            currentAudio.playbackRate = rate;
        }
    };

    const toggleScript = () => {
        setShowScript(!showScript);
    };

    const cleanupAudio = (audio) => {
        if (audio) {
            if (audio._handlers) {
                audio.removeEventListener('loadstart', audio._handlers.loadstart);
                audio.removeEventListener('canplay', audio._handlers.canplay);
                audio.removeEventListener('ended', audio._handlers.ended);
                audio.removeEventListener('error', audio._handlers.error);
            }
            audio.pause();
            audio.src = '';
        }
    };

    const recordWrongAnswer = async (questionData, userAnswer) => {
        console.log(`🔍 [오답노트 디버그] recordWrongAnswer 함수 시작`);
        console.log(`🔍 [오답노트 디버그] questionData:`, questionData);
        console.log(`🔍 [오답노트 디버그] userAnswer:`, userAnswer);
        console.log(`🔍 [오답노트 디버그] level:`, level);
        
        const requestData = {
            type: 'listening',
            wrongData: {
                questionId: questionData.id,
                level: level,
                questionIndex: currentQuestion,
                question: questionData.question,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer || questionData.answer,
                userAnswer: userAnswer,
                explanation: questionData.explanation,
                audioFile: `${questionData.id}.mp3`,
                script: questionData.script,
                topic: questionData.topic
            }
        };
        
        console.log(`🔍 [오답노트 디버그] 전송할 데이터:`, requestData);
        
        try {
            console.log(`🔍 [오답노트 디버그] API 요청 시작: http://localhost:4000/api/odat-note`);
            const response = await fetch('http://localhost:4000/api/odat-note', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            
            console.log(`🔍 [오답노트 디버그] 응답 상태:`, response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log(`✅ [리스닝 오답 기록 완료] ${level} - 문제 ${currentQuestion + 1}`, result);
                console.log(`📝 [오답노트 저장] questionId: ${questionData.id}, type: listening`);
            } else {
                const errorText = await response.text();
                console.error(`❌ 리스닝 오답 기록 실패 (${response.status}):`, errorText);
            }
        } catch (error) {
            console.error('🔍 [오답노트 디버그] 네트워크 오류:', error);
            if (error.message?.includes('Unauthorized')) {
                console.log('📝 [비로그인 사용자] 오답노트는 로그인 후 이용 가능합니다.');
            } else {
                console.error('❌ 리스닝 오답 기록 실패:', error);
            }
        }
    };

    const handleAnswerSelect = (option) => {
        if (showExplanation) return;
        setSelectedAnswer(option);
    };

    const handleSubmit = async () => {
        if (!selectedAnswer) return;
        
        const current = listeningData[currentQuestion];
        // JSON에서는 'answer' 필드를 사용
        const correctAnswer = current.correctAnswer || current.answer;
        const correct = String(selectedAnswer).trim() === String(correctAnswer).trim();
        setIsCorrect(correct);
        
        console.log('Debug - Selected Answer:', selectedAnswer, 'Correct Answer:', correctAnswer, 'Result:', correct);
        
        // 정답/오답 모두 기록 저장 (로그인된 사용자만)
        try {
            const response = await fetch('http://localhost:4000/api/listening/record', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId: current.id,
                    level: level,
                    isCorrect: correct,
                    userAnswer: selectedAnswer,
                    correctAnswer: correctAnswer
                })
            });
            
            if (response.ok) {
                console.log(`✅ [리스닝 기록 저장 완료] ${level} - Question ${current.id} - ${correct ? '정답' : '오답'}`);
                console.log(`📝 [저장된 데이터] questionId: ${current.id}, level: ${level}, isCorrect: ${correct}`);
            } else if (response.status === 401) {
                console.log('📝 [비로그인 사용자] 리스닝 기록은 로그인 후 저장됩니다.');
            } else {
                const errorText = await response.text();
                console.error(`❌ 리스닝 기록 저장 실패 (${response.status}):`, errorText);
            }
        } catch (error) {
            console.error('❌ 리스닝 기록 저장 실패:', error);
        }

        if (correct && !completedQuestions.has(currentQuestion)) {
            setScore(score + 1);
            setCompletedQuestions(prev => new Set([...prev, currentQuestion]));
            console.log(`✅ [리스닝 정답] ${level} - 문제 ${currentQuestion + 1} - 정답: ${correctAnswer}`);
        } else if (!correct) {
            console.log(`❌ [리스닝 오답] ${level} - 문제 ${currentQuestion + 1} - 오답노트 기록 시작`);
            try {
                await recordWrongAnswer(current, selectedAnswer);
                console.log(`📝 [오답노트] 리스닝 오답 기록 함수 호출 완료`);
            } catch (error) {
                console.error('❌ [오답노트] 리스닝 오답 기록 실패:', error);
            }
        }
        
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (currentQuestion < listeningData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setIsCorrect(false);
            setShowScript(false); // 스크립트 숨기기
            
            // 오디오 정리
            if (currentAudio) {
                cleanupAudio(currentAudio);
                setIsPlaying(false);
                setCurrentAudio(null);
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setIsCorrect(false);
            setShowScript(false); // 스크립트 숨기기
            
            // 오디오 정리
            if (currentAudio) {
                cleanupAudio(currentAudio);
                setIsPlaying(false);
                setCurrentAudio(null);
            }
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setIsCorrect(false);
        setScore(0);
        setCompletedQuestions(new Set());
        setShowScript(false); // 스크립트 숨기기
        
        // 오디오 정리
        if (currentAudio) {
            currentAudio.pause();
            setIsPlaying(false);
            setCurrentAudio(null);
        }
    };

    if (loading) {
        return (
            <main className="container py-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">리스닝 데이터를 불러오는 중...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container py-4">
                <div className="alert alert-warning text-center">
                    <h4>🎧 리스닝 연습</h4>
                    <p>{error}</p>
                    <small className="text-muted">현재 A1 레벨만 이용 가능합니다.</small>
                </div>
            </main>
        );
    }

    if (listeningData.length === 0) {
        return (
            <main className="container py-4">
                <div className="alert alert-info text-center">
                    <h4>🎧 {level} 리스닝 연습</h4>
                    <p>리스닝 문제가 없습니다.</p>
                </div>
            </main>
        );
    }

    const current = listeningData[currentQuestion];
    const progress = ((currentQuestion + 1) / listeningData.length) * 100;

    return (
        <main className="container py-4">
            <div className="reading-container">
                {/* Header */}
                <div className="reading-header">
                    <h2 className="reading-title">🎧 {level} 리스닝 연습</h2>
                    <div className="reading-stats">
                        <div className="progress-info">
                            <span className="question-counter">
                                {currentQuestion + 1} / {listeningData.length}
                            </span>
                            <span className="score-display">
                                점수: {score} / {listeningData.length}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Listening Question Card */}
                <div className="reading-card">
                    <div className="passage-section">
                        <h5 className="passage-title">🎵 오디오</h5>
                        <div className="audio-controls">
                            <div className="audio-main-controls">
                                <button 
                                    className={`btn btn-lg ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={playAudio}
                                    disabled={isPlaying}
                                >
                                    {isPlaying ? '🔊 재생중...' : '🎵 오디오 재생'}
                                </button>
                                
                                {/* 재생 속도 제어 버튼 */}
                                <div className="playback-rate-controls">
                                    <span className="rate-label">속도:</span>
                                    {[0.75, 1.0, 1.25].map((rate) => (
                                        <button
                                            key={rate}
                                            className={`btn btn-sm ${playbackRate === rate ? 'btn-primary' : 'btn-outline-secondary'}`}
                                            onClick={() => changePlaybackRate(rate)}
                                        >
                                            {rate}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* 스크립트 보기 버튼 */}
                            <div className="script-controls">
                                <button 
                                    className={`btn btn-outline-info ${showScript ? 'active' : ''}`}
                                    onClick={toggleScript}
                                >
                                    📝 스크립트 {showScript ? '숨기기' : '보기'}
                                </button>
                            </div>
                            
                            {current.topic && (
                                <p className="audio-topic">주제: {current.topic}</p>
                            )}
                        </div>
                        
                        {/* 스크립트 드롭다운 */}
                        {showScript && current.script && (
                            <div className="script-dropdown">
                                <div className="script-content">
                                    <h6>📝 스크립트:</h6>
                                    <p className="script-text">{current.script}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="question-section">
                        <h5 className="question-title">❓ 문제</h5>
                        <p className="question-text">{current.question}</p>

                        <div className="options-grid">
                            {Object.entries(current.options).map(([key, value]) => (
                                <button
                                    key={key}
                                    className={`option-btn ${
                                        selectedAnswer === key ? 'selected' : ''
                                    } ${
                                        showExplanation 
                                            ? key === (current.correctAnswer || current.answer)
                                                ? 'correct' 
                                                : selectedAnswer === key 
                                                    ? 'incorrect' 
                                                    : ''
                                            : ''
                                    }`}
                                    onClick={() => handleAnswerSelect(key)}
                                    disabled={showExplanation}
                                >
                                    <span className="option-letter">{key}</span>
                                    <span className="option-text">{value}</span>
                                </button>
                            ))}
                        </div>

                        {showExplanation && (
                            <div className={`explanation-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className="explanation-header">
                                    {isCorrect ? (
                                        <span className="result-icon correct">✅ 정답!</span>
                                    ) : (
                                        <span className="result-icon incorrect">❌ 틀렸습니다</span>
                                    )}
                                    <span className="correct-answer">정답: {current.correctAnswer || current.answer}</span>
                                </div>
                                {current.explanation && (
                                    <p className="explanation-text">{current.explanation}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="reading-controls">
                    <div className="nav-buttons">
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                        >
                            ← 이전
                        </button>
                        
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={handleNext}
                            disabled={currentQuestion === listeningData.length - 1}
                        >
                            다음 →
                        </button>
                    </div>

                    <div className="action-buttons">
                        {!showExplanation ? (
                            <button 
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={!selectedAnswer}
                            >
                                정답 확인
                            </button>
                        ) : (
                            <button 
                                className="btn btn-success"
                                onClick={currentQuestion === listeningData.length - 1 ? handleRestart : handleNext}
                            >
                                {currentQuestion === listeningData.length - 1 ? '다시 시작' : '다음 문제'}
                            </button>
                        )}
                    </div>

                    <div className="utility-buttons">
                        <button 
                            className="btn btn-outline-warning"
                            onClick={handleRestart}
                        >
                            🔄 처음부터
                        </button>
                    </div>
                </div>

                {/* Final Results */}
                {currentQuestion === listeningData.length - 1 && showExplanation && (
                    <div className="results-summary">
                        <h4>🎉 완료!</h4>
                        <p>
                            총 점수: {score} / {listeningData.length} 
                            ({Math.round((score / listeningData.length) * 100)}%)
                        </p>
                        <div className="performance-message">
                            {score === listeningData.length 
                                ? "완벽합니다! 🌟" 
                                : score >= listeningData.length * 0.8 
                                    ? "훌륭해요! 👏" 
                                    : score >= listeningData.length * 0.6 
                                        ? "잘했어요! 👍" 
                                        : "더 연습해보세요! 💪"
                            }
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}