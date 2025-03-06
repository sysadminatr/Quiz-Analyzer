function extractQuizData() {
    let questions = document.querySelectorAll(".que");
    let quizData = [];

    questions.forEach(q => {
        let questionText = q.querySelector(".qtext").innerText.trim();
        let correctAnswers = []; // Массив для хранения всех правильных ответов

        // Ищем правильные ответы через класс "correct" для всех элементов (input и label)
        let answerElements = q.querySelectorAll(".answer input.correct, .answer label.correct");

        answerElements.forEach(answerElement => {
            let answerText = "";

            if (answerElement.tagName === 'INPUT') {
                answerText = answerElement.value.trim();
            } else if (answerElement.tagName === 'LABEL') {
                answerText = answerElement.innerText.trim();
            }

            if (answerText && !correctAnswers.includes(answerText)) {
                correctAnswers.push(answerText);
            }
        });

        // Если через класс "correct" не нашли правильных ответов, ищем через чекбоксы
        if (correctAnswers.length === 0) {
            let checkedAnswerElements = q.querySelectorAll(".answer input[type='checkbox']:checked");

            checkedAnswerElements.forEach(answerElement1 => {
                let answerId = answerElement1.getAttribute('id');
                let labelElement = q.querySelector(`.answer label[for='${answerId}']`);
                
                // Проверка на наличие правильного ответа
                let correctnessElement = labelElement ? labelElement.closest('.content').querySelector('.correctness.correct') : null;
                if (labelElement && correctnessElement) {
                    let answerText = labelElement.innerText.trim();
                    if (answerText && !correctAnswers.includes(answerText)) {
                        correctAnswers.push(answerText);
                    }
                }
            });
        }

        // Добавляем в итоговый массив только если найдены правильные ответы
        if (correctAnswers.length > 0) {
            quizData.push({ question: questionText, answers: correctAnswers });
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
            let correctAnswers = []; // Массив для хранения всех правильных ответов

            // Ищем все правильные ответы, если они отмечены как "correct"
            let answerElements = q.querySelectorAll(".answer input.correct, .answer label.correct");

            answerElements.forEach(answerElement => {
                let answerText = "";

                if (answerElement.tagName === 'INPUT') {
                    answerText = answerElement.value.trim();
                } else if (answerElement.tagName === 'LABEL') {
                    answerText = answerElement.innerText.trim();
                }

                if (answerText && !correctAnswers.includes(answerText)) {
                    correctAnswers.push(answerText);
                }
            });

            // Если правильные ответы через "correct" не найдены, ищем через чекбоксы
            if (correctAnswers.length === 0) {
                let checkedAnswerElements = q.querySelectorAll(".answer input[type='checkbox']:checked");

                checkedAnswerElements.forEach(answerElement1 => {
                    let answerId = answerElement1.getAttribute('id');
                    let labelElement = q.querySelector(`.answer label[for='${answerId}']`);
                    
                    // Проверка на наличие правильного ответа
                    let correctnessElement = labelElement ? labelElement.closest('.content').querySelector('.correctness.correct') : null;
                    if (labelElement && correctnessElement) {
                        let answerText = labelElement.innerText.trim();
                        if (answerText && !correctAnswers.includes(answerText)) {
                            correctAnswers.push(answerText);
                        }
                    }
                });
            }

            // Если правильные ответы найдены, выводим их
            if (correctAnswers.length > 0) {
                let answerDiv = document.createElement("div");
                answerDiv.classList.add("correct-answer");
                answerDiv.style.cssText = "margin-top: 10px; padding: 5px; background: #d4edda; color: #155724; border-left: 4px solid #28a745;";

                // Выводим все правильные ответы
                answerDiv.innerHTML = `Правильные ответы: <ul>`;
                correctAnswers.forEach(answer => {
                    answerDiv.innerHTML += `<li>${answer}</li>`;
                });
                answerDiv.innerHTML += `</ul>`;
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
