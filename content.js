function extractQuizData() {
    let questions = document.querySelectorAll(".que");
    let quizData = [];

    questions.forEach(q => {
        let questionText = q.querySelector(".qtext").innerText.trim();
        
        let answerText = "Ответ не найден"; // Значение по умолчанию
        
        // Ищем правильный ответ, если он отмечен как правильный (через класс "correct")
        let answerElement = q.querySelector(".answer input.correct") || q.querySelector(".answer label.correct");

        if (answerElement) {
            if (answerElement.tagName === 'INPUT') {
                answerText = answerElement.value.trim();
            } else if (answerElement.tagName === 'LABEL') {
                answerText = answerElement.innerText.trim();
            }
        } else {
            // Если правильный ответ не найден через класс "correct", ищем через чекбоксы
            let answerElement1 = q.querySelector(".answer input[type='checkbox']:checked");
            if (answerElement1) {
                let answerId = answerElement1.getAttribute('id');
                let labelElement = q.querySelector(`.answer label[for='${answerId}']`);
                
                // Проверка на наличие правильного ответа
                let correctnessElement = labelElement ? labelElement.closest('.content').querySelector('.correctness.correct') : null;
                if (labelElement && correctnessElement) {
                    answerText = labelElement.innerText.trim();
                }
            }
        }

        // Добавляем в итоговый массив все ответы, только если они найдены
        if (answerText !== "Ответ не найден") {
            quizData.push({ question: questionText, answer: answerText });
        }
    });

    return quizData;
}

function sendQuizData() {
    let data = extractQuizData();
    
    if (data.length === 0) {
        alert("Нет правильных ответов для отправки!");
        return;
    }

    // Отправляем данные на сервер для проверки перед добавлением
    fetch("https://test.technoadmin.ru/check-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz: data })
    })
    .then(response => response.json())
    .then(result => {
        if (result.newQuestions.length > 0) {
            return fetch("https://test.technoadmin.ru/save-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quiz: result.newQuestions })
            });
        } else {
            alert("Все вопросы уже есть в базе!");
            return null;
        }
    })
    .then(response => response ? response.json() : null)
    .then(data => {
        if (data) alert("Новые вопросы сохранены в БД!");
    })
    .catch(error => console.error("Ошибка при отправке:", error));
}

// Добавляем кнопку "Анализ теста"
let analyzeButton = document.createElement("button");
analyzeButton.innerText = "Анализ теста";
analyzeButton.style.cssText = "position: fixed; bottom: 20px; right: 20px; padding: 10px 15px; background: red; color: white; border: none; cursor: pointer;";
analyzeButton.onclick = sendQuizData;

document.body.appendChild(analyzeButton);

// Функция для показа ответов
function showAnswers() {
    let questions = document.querySelectorAll(".que");

    questions.forEach(q => {
        let existingAnswer = q.querySelector(".correct-answer");
        if (!existingAnswer) {
            let answerText = "Ответ не найден"; // Значение по умолчанию

            // Ищем правильный ответ, если он отмечен как "correct"
            let answerElement = q.querySelector(".answer input.correct") || q.querySelector(".answer label.correct");

            if (answerElement) {
                if (answerElement.tagName === 'INPUT') {
                    answerText = answerElement.value.trim();
                } else if (answerElement.tagName === 'LABEL') {
                    answerText = answerElement.innerText.trim();
                }
            } else {
                // Если через "correct" не найдено, ищем через чекбоксы
                let answerElement1 = q.querySelector(".answer input[type='checkbox']:checked");
                if (answerElement1) {
                    let answerId = answerElement1.getAttribute('id');
                    let labelElement = q.querySelector(`.answer label[for='${answerId}']`);

                    // Проверка, что ответ верный
                    let correctnessElement = labelElement ? labelElement.closest('.content').querySelector('.correctness.correct') : null;
                    if (labelElement && correctnessElement) {
                        answerText = labelElement.innerText.trim();
                    }
                }
            }

            // Выводим правильный ответ под вопросом
            if (answerText !== "Ответ не найден") {
                let answerDiv = document.createElement("div");
                answerDiv.classList.add("correct-answer");
                answerDiv.style.cssText = "margin-top: 10px; padding: 5px; background: #d4edda; color: #155724; border-left: 4px solid #28a745;";
                answerDiv.innerText = `Правильный ответ: ${answerText}`;
                q.appendChild(answerDiv);
            }
        }
    });
}

// Добавляем кнопку "Показать ответы"
let showAnswersButton = document.createElement("button");
showAnswersButton.innerText = "Показать ответы";
showAnswersButton.style.cssText = "position: fixed; bottom: 60px; right: 20px; padding: 10px 15px; background: green; color: white; border: none; cursor: pointer;";
showAnswersButton.onclick = showAnswers;

document.body.appendChild(showAnswersButton);