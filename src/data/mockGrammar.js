// src/data/mockGrammar.js

export const grammarTopics = [
    {
        id: "a1-present-tense",
        level: "A1",
        title: "현재 시제 (Present Tense)",
        description: "가장 기본적인 동사 'be', 'have', 'go'의 현재 시제 변화를 학습합니다.",
        // ★★★★★ 요청하신 대로 3페이지로 재구성 ★★★★★
        detailedExplanation: [
            [ // 페이지 1
                {
                    type: 'heading',
                    content: '현재 시제 (Present Tense)'
                },
                {
                    type: 'paragraph',
                    content: "영어에서는 문장의 주어가 누구냐에 따라 동사의 형태가 조금씩 바뀌어요. 이걸 '동사 변화'라고 부른답니다. A1 레벨에서는 가장 기본이 되는 동사들의 변화 모습을 꼭 알아둬야 해요! 😊"
                }
            ],
            [ // 페이지 2
                {
                    type: 'heading',
                    content: "기본 규칙 📝"
                },
                {
                    type: 'list',
                    items: [
                        "I (나) → 동사원형 (예: I go)",
                        "You (너/당신) → 동사원형 (예: You go)",
                        "He/She/It (그/그녀/그것) → 동사원형 + -s (예: He goes)",
                        "We (우리) / They (그들) → 동사원형 그대로! (예: We go)"
                    ]
                }
            ],
            [ // 페이지 3
                {
                    type: 'paragraph',
                    content: "하지만 'be' 동사는 특별한 변화를 하는 불규칙 동사이니, 아래처럼 통째로 외워두는 게 좋아요!"
                },
                {
                    type: 'example',
                    items: [
                        { de: "I am a student.", ko: "저는 학생입니다." },
                        { de: "You have a car.", ko: "너는 차를 가지고 있구나." }
                    ]
                }
            ]
        ],
        questions: [
            {
                stem: "I ___ from Korea.",
                options: ["am", "is", "are"],
                answer: "am",
                explanation: "'be' 동사는 1인칭 단수 'I'와 함께 쓰일 때 'am'으로 변화합니다."
            },
            {
                stem: "He ___ a dog.",
                options: ["have", "has", "had"],
                answer: "has",
                explanation: "'have' 동사는 3인칭 단수 'He'와 함께 쓰일 때 'has'로 변화합니다."
            },
            {
                stem: "We ___ to school.",
                options: ["go", "goes", "going"],
                answer: "go",
                explanation: "'go' 동사는 복수 주어 'We'와 함께 쓰일 때 동사 원형인 'go'를 사용합니다."
            }
        ]
    },
    {
        id: "a1-articles",
        level: "A1",
        title: "관사 (Articles)",
        description: "기본적인 관사 a, an, the의 사용법을 배웁니다.",
        // ★ 가독성을 위해 2페이지로 재구성
        detailedExplanation: [
            [ // 페이지 1
                {
                    type: 'paragraph',
                    content: "영어에는 명사 앞에 붙이는 작은 단어들이 있어요! 바로 관사(Articles)랍니다. 이 작은 단어들이 명사를 더 정확하게 설명해줘요. 🎯"
                },
                {
                    type: 'heading',
                    content: "관사의 세 가지 종류 📝"
                },
                {
                    type: 'list',
                    items: [
                        "a → 자음으로 시작하는 명사 앞 (예: a book)",
                        "an → 모음으로 시작하는 명사 앞 (예: an apple)",
                        "the → 특정한 것을 가리킬 때 (예: the book)"
                    ]
                }
            ],
            [ // 페이지 2
                {
                    type: 'paragraph',
                    content: "a/an은 '하나의, 어떤'이라는 뜻이고, the는 '그'라는 뜻이에요. 처음 말하는 것은 a/an, 이미 말한 것이나 특별한 것은 the를 써요!"
                }
            ]
        ],
        questions: [
            {
                stem: "I have ___ book.",
                options: ["a", "an", "the"],
                answer: "a",
                explanation: "'book'은 자음 'b'로 시작하므로 부정관사 'a'를 사용합니다."
            },
            {
                stem: "She eats ___ apple.",
                options: ["a", "an", "the"],
                answer: "an",
                explanation: "'apple'은 모음 'a'로 시작하므로 부정관사 'an'을 사용합니다."
            },
            {
                stem: "Where is ___ book I gave you?",
                options: ["a", "an", "the"],
                answer: "the",
                explanation: "특정한 책(내가 준 그 책)을 가리키므로 정관사 'the'를 사용합니다."
            }
        ]
    },
    {
        id: "a1-possessive-adjectives",
        level: "A1",
        title: "소유형용사 (Possessive Adjectives)",
        description: "나의, 너의, 그의 등 소유를 나타내는 표현을 학습합니다.",
        // ★ 가독성을 위해 2페이지로 재구성
        detailedExplanation: [
            [ // 페이지 1
                {
                    type: 'paragraph',
                    content: "'이건 내 거야!', '저건 네 책이야!' 처럼, 무언가가 누구의 것인지 말할 때 쓰는 표현을 배워볼 거예요. 이걸 '소유형용사'라고 한답니다. 🔑"
                },
                {
                    type: 'heading',
                    content: "주인에 따라 달라지는 소유형용사"
                },
                {
                    type: 'list',
                    items: [
                        "I (나) → my (나의)",
                        "you (너) → your (너의)",
                        "he (그) → his (그의)",
                        "she (그녀) → her (그녀의)"
                    ]
                }
            ],
            [ // 페이지 2
                {
                    type: 'example',
                    items: [
                        { de: "This is my car.", ko: "이것은 나의 차야." },
                        { de: "Where is your book?", ko: "네 책은 어디에 있니?" }
                    ]
                },
                {
                    type: 'paragraph',
                    content: "영어의 소유형용사는 뒤에 오는 명사가 단수든 복수든 형태가 바뀌지 않아서 배우기 쉬워요! 😉"
                }
            ]
        ],
        questions: [
            {
                stem: "This is ___ car.",
                options: ["my", "your", "his"],
                answer: "my",
                explanation: "'나(I)의' 소유를 나타낼 때는 'my'를 사용합니다."
            },
            {
                stem: "Where is ___ book?",
                options: ["my", "your", "his"],
                answer: "your",
                explanation: "'너(you)의' 소유를 나타낼 때는 'your'을 사용합니다."
            },
            {
                stem: "___ name is Tom.",
                options: ["My", "Your", "His"],
                answer: "His",
                explanation: "'그(he)의' 소유를 나타낼 때는 'his'를 사용합니다. 문장의 시작이므로 대문자로 씁니다."
            }
        ]
    }
];