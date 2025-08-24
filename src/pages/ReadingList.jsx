import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './ReadingList.css';

export default function ReadingList() {
    const [searchParams] = useSearchParams();
    const selectedLevel = searchParams.get('level');
    
    const [levelData, setLevelData] = useState({});
    const [questions, setQuestions] = useState([]);
    const [studyHistory, setStudyHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [questionsLoading, setQuestionsLoading] = useState(false);

    const levels = [
        { 
            code: 'A1', 
            name: 'Beginner', 
            description: '기초 수준의 간단한 일상 표현과 기본 문법',
            color: '#ff6b6b',
            available: true
        },
        { 
            code: 'A2', 
            name: 'Elementary', 
            description: '친숙한 주제에 대한 간단한 대화와 문장',
            color: '#ffa726',
            available: true
        },
        { 
            code: 'B1', 
            name: 'Intermediate', 
            description: '일반적인 주제에 대한 명확한 표준 언어',
            color: '#66bb6a',
            available: true
        },
        { 
            code: 'B2', 
            name: 'Upper-Intermediate', 
            description: '복잡한 텍스트와 추상적 주제 이해',
            color: '#42a5f5',
            available: true
        },
        { 
            code: 'C1', 
            name: 'Advanced', 
            description: '복잡하고 긴 텍스트의 함축적 의미 파악',
            color: '#ab47bc',
            available: false
        }
    ];

    useEffect(() => {
        loadLevelData();
        if (selectedLevel) {
            loadQuestionsForLevel(selectedLevel);
        }
    }, [selectedLevel]);

    const loadLevelData = async () => {
        setLoading(true);
        const data = {};

        for (const level of levels) {
            if (level.available) {
                try {
                    const response = await fetch(`http://localhost:4000/api/reading/level/${level.code}`);
                    if (response.ok) {
                        const result = await response.json();
                        data[level.code] = {
                            count: result.count,
                            available: result.available
                        };
                    } else {
                        data[level.code] = { count: 0, available: false };
                    }
                } catch (err) {
                    console.error(`Failed to load ${level.code} data:`, err);
                    data[level.code] = { count: 0, available: false };
                }
            } else {
                data[level.code] = { count: 0, available: false };
            }
        }

        setLevelData(data);
        setLoading(false);
    };

    const loadQuestionsForLevel = async (level) => {
        setQuestionsLoading(true);
        try {
            // 문제 목록 로드
            const questionsResponse = await fetch(`http://localhost:4000/api/reading/practice/${level}`);
            if (questionsResponse.ok) {
                const questionsResult = await questionsResponse.json();
                setQuestions(questionsResult.data || []);
            } else {
                console.error(`Failed to load questions for ${level}`);
                setQuestions([]);
            }

            // 학습 기록 로드 (로그인된 경우만)
            try {
                const historyResponse = await fetch(`http://localhost:4000/api/reading/history/${level}`, {
                    credentials: 'include'
                });
                if (historyResponse.ok) {
                    const historyResult = await historyResponse.json();
                    setStudyHistory(historyResult.data || {});
                } else if (historyResponse.status !== 401) {
                    console.error(`Failed to load history for ${level}`);
                }
            } catch (historyErr) {
                console.log('History loading failed (user might not be logged in):', historyErr);
                setStudyHistory({});
            }
            
        } catch (err) {
            console.error(`Error loading questions for ${level}:`, err);
            setQuestions([]);
            setStudyHistory({});
        } finally {
            setQuestionsLoading(false);
        }
    };

    const getDifficultyInfo = (levelCode) => {
        switch (levelCode) {
            case 'A1': return { icon: '🌱', difficulty: '매우 쉬움' };
            case 'A2': return { icon: '🌿', difficulty: '쉬움' };
            case 'B1': return { icon: '🌳', difficulty: '보통' };
            case 'B2': return { icon: '🎯', difficulty: '어려움' };
            case 'C1': return { icon: '🎓', difficulty: '매우 어려움' };
            default: return { icon: '📚', difficulty: '알 수 없음' };
        }
    };

    // UTC를 KST로 변환하는 함수
    const formatKSTDate = (utcDateString) => {
        const date = new Date(utcDateString);
        const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // UTC + 9시간
        return kstDate.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }) + ' (KST)';
    };

    // 문제별 학습 기록 가져오기
    const getStudyRecord = (questionId) => {
        return studyHistory[questionId];
    };

    if (loading) {
        return (
            <main className="container py-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">리딩 레벨 정보를 불러오는 중...</p>
                </div>
            </main>
        );
    }

    // 선택된 레벨이 있으면 해당 레벨의 문제 목록을 보여줌
    if (selectedLevel) {
        const currentLevelInfo = levels.find(l => l.code === selectedLevel);
        const difficultyInfo = getDifficultyInfo(selectedLevel);
        
        return (
            <main className="container py-4">
                <div className="reading-level-detail">
                    {/* Header */}
                    <div className="level-detail-header">
                        <div className="level-info-header">
                            <Link to="/reading" className="back-link">← 레벨 선택으로 돌아가기</Link>
                            <div className="level-badge" style={{ backgroundColor: currentLevelInfo?.color || '#666' }}>
                                {difficultyInfo.icon} {selectedLevel}
                            </div>
                        </div>
                        <h1 className="level-title">{selectedLevel} 레벨 리딩 문제</h1>
                        <p className="level-subtitle">
                            {currentLevelInfo?.description || '리딩 문제를 풀어보세요.'}
                        </p>
                    </div>

                    {/* Questions List */}
                    {questionsLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">문제를 불러오는 중...</span>
                            </div>
                            <p className="mt-2">문제를 불러오는 중...</p>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="alert alert-warning text-center">
                            <h4>📭 문제가 없습니다</h4>
                            <p>{selectedLevel} 레벨의 문제를 찾을 수 없습니다.</p>
                            <Link to="/reading" className="btn btn-primary">다른 레벨 선택하기</Link>
                        </div>
                    ) : (
                        <div className="questions-container">
                            <div className="questions-summary mb-4">
                                <div className="row text-center">
                                    <div className="col-md-4">
                                        <div className="summary-card">
                                            <h3>{questions.length}</h3>
                                            <p>총 문제 수</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="summary-card">
                                            <h3>약 {Math.ceil(questions.length * 1.5)}분</h3>
                                            <p>예상 소요시간</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="summary-card">
                                            <h3>{difficultyInfo.difficulty}</h3>
                                            <p>난이도</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="questions-grid">
                                {questions.map((question, index) => {
                                    const studyRecord = getStudyRecord(question.id);
                                    const hasStudied = !!studyRecord;
                                    const isCorrect = studyRecord?.wrongData?.isCorrect;
                                    
                                    return (
                                        <div 
                                            key={question.id || index} 
                                            className={`question-card ${
                                                hasStudied 
                                                    ? isCorrect ? 'studied-correct' : 'studied-incorrect'
                                                    : ''
                                            }`}
                                        >
                                            <div className="question-header">
                                                <span className="question-number">#{index + 1}</span>
                                                <div className="question-actions">
                                                    <Link 
                                                        to={`/reading/practice?level=${selectedLevel}&start=${index}`}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        풀어보기
                                                    </Link>
                                                </div>
                                            </div>
                                            
                                            {hasStudied && (
                                                <div className="study-status">
                                                    <div className="status-badge">
                                                        {isCorrect ? '✅ 정답' : '❌ 오답'}
                                                    </div>
                                                    <div className="last-study-date">
                                                        마지막 학습: {formatKSTDate(studyRecord.wrongAt)}
                                                    </div>
                                                </div>
                                            )}
                                        
                                        <div className="question-content">
                                            <div className="passage-preview">
                                                <strong>지문:</strong>
                                                <p>{question.passage?.substring(0, 100)}...</p>
                                            </div>
                                            <div className="question-preview">
                                                <strong>문제:</strong>
                                                <p>{question.question}</p>
                                            </div>
                                            <div className="options-preview">
                                                <strong>선택지:</strong>
                                                <div className="options-mini">
                                                    {Object.entries(question.options || {}).map(([key, value]) => (
                                                        <span key={key} className="option-mini">
                                                            {key}: {value.substring(0, 20)}...
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            <div className="level-actions-footer mt-4">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Link 
                                            to={`/reading/practice?level=${selectedLevel}`}
                                            className="btn btn-success btn-lg w-100"
                                        >
                                            🚀 처음부터 시작하기
                                        </Link>
                                    </div>
                                    <div className="col-md-6">
                                        <Link 
                                            to="/reading"
                                            className="btn btn-outline-secondary btn-lg w-100"
                                        >
                                            📚 다른 레벨 선택
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="container py-4">
            <div className="reading-list-container">
                {/* Header */}
                <div className="reading-list-header">
                    <h1 className="reading-list-title">📚 영어 리딩 연습</h1>
                    <p className="reading-list-subtitle">
                        당신의 수준에 맞는 리딩 문제를 선택하세요. CEFR 기준에 따라 A1부터 C1까지 단계별로 구성되어 있습니다.
                    </p>
                </div>

                {/* Level Cards Grid */}
                <div className="level-cards-grid">
                    {levels.map((level) => {
                        const info = getDifficultyInfo(level.code);
                        const data = levelData[level.code] || { count: 0, available: false };
                        const isAvailable = data.available && data.count > 0;

                        return (
                            <div 
                                key={level.code} 
                                className={`level-card ${isAvailable ? 'available' : 'unavailable'}`}
                                style={{ '--level-color': level.color }}
                            >
                                <div className="level-card-header">
                                    <div className="level-info">
                                        <div className="level-icon">{info.icon}</div>
                                        <div className="level-details">
                                            <h3 className="level-code">{level.code}</h3>
                                            <span className="level-name">{level.name}</span>
                                        </div>
                                    </div>
                                    <div className="difficulty-badge">
                                        {info.difficulty}
                                    </div>
                                </div>

                                <div className="level-description">
                                    {level.description}
                                </div>

                                <div className="level-stats">
                                    {isAvailable ? (
                                        <div className="stats-available">
                                            <span className="question-count">
                                                📝 {data.count}개 문제
                                            </span>
                                            <span className="estimated-time">
                                                ⏱️ 약 {Math.ceil(data.count * 1.5)}분
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="stats-unavailable">
                                            <span className="coming-soon">
                                                {level.available ? '데이터 로딩 실패' : '준비 중'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="level-actions">
                                    {isAvailable ? (
                                        <Link 
                                            to={`/reading/practice?level=${level.code}`}
                                            className="start-btn"
                                        >
                                            🚀 시작하기
                                        </Link>
                                    ) : (
                                        <button className="start-btn disabled" disabled>
                                            {level.available ? '⏳ 로딩 실패' : '🔒 준비 중'}
                                        </button>
                                    )}
                                </div>

                                {/* Progress indicator for available levels */}
                                {isAvailable && (
                                    <div className="level-progress">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill"
                                                style={{ width: '0%' }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">시작 전</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Information Section */}
                <div className="reading-info-section">
                    <h3 className="info-title">📖 리딩 연습 가이드</h3>
                    <div className="info-grid">
                        <div className="info-card">
                            <div className="info-icon">🎯</div>
                            <h4>단계별 학습</h4>
                            <p>A1부터 C1까지 체계적인 단계별 학습으로 실력을 점진적으로 향상시킬 수 있습니다.</p>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">💡</div>
                            <h4>즉시 피드백</h4>
                            <p>각 문제마다 정답과 함께 상세한 한국어 해설을 제공하여 이해도를 높입니다.</p>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">📊</div>
                            <h4>진행률 추적</h4>
                            <p>학습 진행 상황과 점수를 실시간으로 확인하며 성취감을 느낄 수 있습니다.</p>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">🔄</div>
                            <h4>반복 학습</h4>
                            <p>언제든지 다시 시작할 수 있어 반복 학습을 통해 실력을 확실히 다질 수 있습니다.</p>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="back-to-home">
                    <Link to="/home" className="back-btn">
                        🏠 홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </main>
    );
}