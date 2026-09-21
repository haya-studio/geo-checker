// ==========================================
// 共通設定（別ツールに流用する際はここを変更）
// ==========================================
// リクエスト用GoogleフォームURL（未設定の場合は空文字 "" または "REQUEST_FORM_URL_HERE" のままにします）
const REQUEST_FORM_URL = "REQUEST_FORM_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {
    // --- リクエストボタン制御 ---
    const requestBtn = document.getElementById('request-btn');
    if (requestBtn) {
        requestBtn.addEventListener('click', () => {
            if (!REQUEST_FORM_URL || REQUEST_FORM_URL === "REQUEST_FORM_URL_HERE" || REQUEST_FORM_URL.trim() === "") {
                alert("リクエストフォームは現在準備中です。");
            } else {
                window.open(REQUEST_FORM_URL, "_blank", "noopener,noreferrer");
            }
        });
    }

    // --- 無料診断ロジック ---
    const checkBtn = document.getElementById('check-btn');
    const textInput = document.getElementById('text-input');
    const resultArea = document.getElementById('result-area');
    
    const scoreTotalEl = document.getElementById('score-total');
    const score1El = document.getElementById('score-1');
    const score2El = document.getElementById('score-2');
    const score3El = document.getElementById('score-3');
    const feedbackListEl = document.getElementById('feedback-list');

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, function(match) {
            const escape = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            };
            return escape[match];
        });
    }

    if (checkBtn && textInput) {
        checkBtn.addEventListener('click', () => {
            const text = textInput.value.trim();
            
            if (text.length < 30) {
                alert('より正確に診断するため、30文字以上の文章を入力してください。');
                return;
            }

            let score1 = 0;
            let score2 = 0;
            let score3 = 0;
            let feedbacks = [];

            const numberMatch = text.match(/[0-9０-９]/g);
            if (numberMatch && numberMatch.length >= 3) {
                score1 += 6;
            } else if (numberMatch && numberMatch.length > 0) {
                score1 += 3;
                feedbacks.push('実績や期間、料金など、具体的な「数値データ」を追加すると、AIが情報を整理しやすくなります。');
            } else {
                feedbacks.push('文章に「数値（価格、人数、年数など）」が含まれていません。具体的な数字を入れることで客観的な具体性が増します。');
            }
            
            if (text.length > 200) score1 += 4;
            else if (text.length > 100) score1 += 2;
            else feedbacks.push('文章量が少なめです。事業の詳細や特徴をもう少し詳しく記述することをお勧めします。');

            if (text.includes('？') || text.includes('?')) {
                score2 += 5;
            } else {
                feedbacks.push('「〜とは？」「よくある質問」のようなQ&A形式を含めると、AIが情報を整理・抽出しやすい構造になります。');
            }

            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length > 3) {
                score2 += 5;
            } else {
                feedbacks.push('文章が1つの塊になっています。改行や見出し（■、【】など）を使って構造化すると読み取りやすくなります。');
            }

            const objectiveEndings = text.match(/です|ます|である|対応しています|提供しています/g);
            if (objectiveEndings && objectiveEndings.length >= 2) {
                score3 += 6;
            } else {
                feedbacks.push('「〜です」「〜を提供しています」のような客観的な事実を示す言い切り表現を増やすと情報が明確になります。');
            }

            const abstractWords = text.match(/すごい|とても|最高の|素晴らしい/g);
            if (abstractWords) {
                feedbacks.push('「' + escapeHTML(abstractWords.join('、')) + '」のような主観的・抽象的な表現が含まれています。具体的な強み（○○の資格がある、実績○件など）に置き換えることを推奨します。');
            } else {
                score3 += 4;
            }

            score1 = Math.min(10, Math.max(0, score1));
            score2 = Math.min(10, Math.max(0, score2));
            score3 = Math.min(10, Math.max(0, score3));
            const totalScore = score1 + score2 + score3;

            if (feedbacks.length === 0) {
                feedbacks.push('基本的な構造は整っています。さらに地域名（○○市など）やニッチな専門用語を含めると、AIがより具体的な文脈として整理しやすくなります。');
            }

            scoreTotalEl.textContent = totalScore;
            score1El.textContent = score1;
            score2El.textContent = score2;
            score3El.textContent = score3;

            feedbackListEl.innerHTML = '';
            feedbacks.forEach(msg => {
                const li = document.createElement('li');
                li.innerHTML = msg;
                feedbackListEl.appendChild(li);
            });

            resultArea.classList.remove('hidden');
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});
