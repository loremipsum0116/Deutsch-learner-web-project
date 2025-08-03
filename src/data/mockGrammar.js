// src/data/mockGrammar.js

export const grammarTopics = [
    {
        id: "a1-conjugation",
        level: "A1",
        title: "동사의 현재 시제 변화",
        description: "가장 기본적인 동사 'sein', 'haben', 'gehen'의 인칭별 변화를 학습합니다.",
        // ★★★★★ 요청하신 대로 3페이지로 재구성 ★★★★★
        detailedExplanation: [
            [ // 페이지 1
                {
                    type: 'heading',
                    content: '동사의 현재 시제 변화'
                },
                {
                    type: 'paragraph',
                    content: "독일어에서는 문장의 주인공(주어)이 누구냐에 따라 동사의 모습이 조금씩 바뀌어요. 이걸 '동사 변화'라고 부른답니다. A1 레벨에서는 가장 기본이 되는 동사들의 변신 모습을 꼭 알아둬야 해요! 😊"
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
                        "ich (나) → 동사원형 + -e (예: ich gehe)",
                        "du (너) → 동사원형 + -st (예: du gehst)",
                        "er/sie/es (그/그녀/그것) → 동사원형 + -t (예: er geht)",
                        "wir (우리) / sie (그들) / Sie (당신) → 동사원형 그대로! (예: wir gehen)"
                    ]
                }
            ],
            [ // 페이지 3
                {
                    type: 'paragraph',
                    content: "하지만 'sein(be)'과 'haben(have)' 동사는 자기 마음대로 변신하는 특별한 친구들이니, 아래 예문처럼 통째로 외워두는 게 좋아요!"
                },
                {
                    type: 'example',
                    items: [
                        { de: "Ich bin Student.", ko: "저는 학생입니다." },
                        { de: "Du hast ein Auto.", ko: "너는 차를 가지고 있구나." }
                    ]
                }
            ]
        ],
        questions: [
            {
                stem: "Ich ___ aus Südkorea.",
                options: ["bin", "ist", "sind"],
                answer: "bin",
                explanation: "'sein' 동사는 1인칭 단수 'ich'와 함께 쓰일 때 'bin'으로 변화합니다."
            },
            {
                stem: "Er ___ einen Hund.",
                options: ["habe", "hast", "hat"],
                answer: "hat",
                explanation: "'haben' 동사는 3인칭 단수 'er'와 함께 쓰일 때 'hat'으로 변화합니다."
            },
            {
                stem: "Wir ___ nach Hause.",
                options: ["gehe", "geht", "gehen"],
                answer: "gehen",
                explanation: "'gehen' 동사는 1인칭 복수 'wir'와 함께 쓰일 때 동사 원형인 'gehen'을 사용합니다."
            }
        ]
    },
    {
        id: "a1-articles",
        level: "A1",
        title: "관사와 명사",
        description: "기본적인 명사의 성(der, die, das)과 함께 정관사를 사용하는 법을 배웁니다.",
        // ★ 가독성을 위해 2페이지로 재구성
        detailedExplanation: [
            [ // 페이지 1
                {
                    type: 'paragraph',
                    content: "독일어의 모든 명사에는 성별이 정해져 있어요! 🧍‍♂️🧍‍♀️🏢 바로 남성, 여성, 중성이랍니다. 명사의 성별에 따라 앞에 붙는 모자(관사)가 달라져요."
                },
                {
                    type: 'heading',
                    content: "명사의 세 가지 성별 🎩"
                },
                {
                    type: 'list',
                    items: [
                        "남성 명사 → der (예: der Tisch 책상)",
                        "여성 명사 → die (예: die Frau 여자)",
                        "중성 명사 → das (예: das Haus 집)"
                    ]
                }
            ],
            [ // 페이지 2
                {
                    type: 'paragraph',
                    content: "단어의 뜻과는 상관없이 문법적으로 정해진 규칙이라서, 단어를 외울 때 관사와 함께 'der Tisch', 'die Frau'처럼 한 세트로 외우는 습관을 들이는 게 아주 중요해요!"
                }
            ]
        ],
        questions: [
            {
                stem: "___ Haus ist groß.",
                options: ["Der", "Die", "Das"],
                answer: "Das",
                explanation: "명사 'Haus'는 중성(das)이므로 정관사 'Das'를 사용합니다."
            },
            {
                stem: "___ Frau liest ein Buch.",
                options: ["Der", "Die", "Das"],
                answer: "Die",
                explanation: "명사 'Frau'는 여성(die)이므로 정관사 'Die'를 사용합니다."
            },
            {
                stem: "___ Tisch ist neu.",
                options: ["Der", "Die", "Das"],
                answer: "Der",
                explanation: "명사 'Tisch'는 남성(der)이므로 정관사 'Der'를 사용합니다."
            }
        ]
    },
    {
        id: "a1-personal-pronouns",
        level: "A1",
        title: "인칭대명사와 소유관사",
        description: "나의, 너의, 그의 등 소유를 나타내는 표현을 학습합니다.",
        // ★ 가독성을 위해 2페이지로 재구성
        detailedExplanation: [
            [ // 페이지 1
                {
                    type: 'paragraph',
                    content: "'이건 내 거야!', '저건 네 책이야!' 처럼, 무언가가 누구의 것인지 말할 때 쓰는 표현을 배워볼 거예요. 이걸 '소유관사'라고 한답니다. 🔑"
                },
                {
                    type: 'heading',
                    content: "주인에 따라 달라지는 소유관사"
                },
                {
                    type: 'list',
                    items: [
                        "ich (나) → mein (나의)",
                        "du (너) → dein (너의)",
                        "er (그) → sein (그의)",
                        "sie (그녀) → ihr (그녀의)"
                    ]
                }
            ],
            [ // 페이지 2
                {
                    type: 'example',
                    items: [
                        { de: "Das ist mein Auto.", ko: "이것은 나의 차야." },
                        { de: "Wo ist dein Buch?", ko: "네 책은 어디에 있니?" }
                    ]
                },
                {
                    type: 'paragraph',
                    content: "소유관사도 뒤에 오는 명사에 따라 꼬리(어미)가 살짝 바뀌기도 하지만, A1 단계에서는 우선 주어에 맞는 짝꿍을 찾는 연습부터 해봐요! 😉"
                }
            ]
        ],
        questions: [
            {
                stem: "Das ist ___ Auto.",
                options: ["mein", "dein", "sein"],
                answer: "mein",
                explanation: "'나(ich)의' 소유를 나타낼 때는 'mein'을 사용합니다. 'Auto'는 중성 명사이므로 어미 변화가 없습니다."
            },
            {
                stem: "Wo ist ___ Buch?",
                options: ["mein", "dein", "sein"],
                answer: "dein",
                explanation: "'너(du)의' 소유를 나타낼 때는 'dein'을 사용합니다."
            },
            {
                stem: "___ Name ist Felix.",
                options: ["Mein", "Dein", "Sein"],
                answer: "Sein",
                explanation: "'그(er)의' 소유를 나타낼 때는 'sein'을 사용합니다. 문장의 시작이므로 대문자로 씁니다."
            }
        ]
    }
];