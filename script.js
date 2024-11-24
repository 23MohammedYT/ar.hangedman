// متغيرات لتخزين الخيارات
let selectedCategory = null;
let selectedDifficulty = null;
let words = []; // لتخزين الكلمات التي سيتم اللعب بها

// بدء اللعبة عند النقر على زر "ابدأ اللعب"
const startButton = document.getElementById("startGame");; // زر "ابدأ اللعب"
const mainMenu = document.querySelector(".menu-container"); // القائمة الرئيسية
const gameMenu = document.querySelector(".container"); // قائمة اللعبة

// عناصر القائمة
const categories = document.querySelectorAll(".category");
const difficulties = document.querySelectorAll(".difficulty-btn");

// إضافة أحداث النقر للفئات
categories.forEach((category) => {
    category.addEventListener("click", () => {
        // إزالة التحديد من جميع الأزرار
        categories.forEach((cat) => cat.classList.remove("selected"));
        // تحديد الزر الذي تم النقر عليه
        category.classList.add("selected");
        selectedCategory = category.dataset.category;
    });
});

// إضافة أحداث النقر للمستوى
difficulties.forEach((difficulty) => {
    difficulty.addEventListener("click", () => {
        // إزالة التحديد من جميع الأزرار
        difficulties.forEach((dif) => dif.classList.remove("selected"));
        // تحديد الزر الذي تم النقر عليه
        difficulty.classList.add("selected");
        selectedDifficulty = difficulty.dataset.difficulty;
    });
});

startButton.addEventListener("click", async () => {
    if (!selectedCategory || !selectedDifficulty) {
        alert("يرجى اختيار الفئة والمستوى أولاً!");
    } else {
        try {
            // تحميل ملف JSON
            const response = await fetch("data.json");
            const data = await response.json();

            // التحقق من وجود الفئة والمستوى المحددين
            if (
                data.categories[selectedCategory] &&
                data.categories[selectedCategory][selectedDifficulty]
            ) {
                words = data.categories[selectedCategory][selectedDifficulty];
                alert(
                    `بدأت اللعبة!\nالفئة: ${selectedCategory}\nالمستوى: ${selectedDifficulty}`
                );

                // إخفاء القائمة الرئيسية وعرض قائمة اللعبة
                mainMenu.style.display = "none";
                gameMenu.style.display = "flex";

                // بدء اللعبة
                initGame();
            } else {
                alert("لا توجد بيانات مطابقة للفئة أو المستوى المختار.");
            }
        } catch (error) {
            console.error("خطأ أثناء تحميل ملف JSON:", error);
            alert("حدث خطأ أثناء تحميل البيانات.");
        }
    }
});

let selectedWord = "";
let guessedLetters = [];
let remainingAttempts = 6;

const wordContainer = document.getElementById("word");
const keyboardContainer = document.getElementById("keyboard");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restart");
const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

// رسم أجزاء الرجل المشنوق
const hangmanParts = [
    () => ctx.moveTo(50, 250) || ctx.lineTo(150, 250), // القاعدة
    () => ctx.moveTo(100, 250) || ctx.lineTo(100, 50), // العمود
    () => ctx.moveTo(100, 50) || ctx.lineTo(150, 50), // الحامل الأفقي
    () => ctx.moveTo(150, 50) || ctx.lineTo(150, 80), // الحبل
    () => ctx.arc(150, 100, 20, 0, Math.PI * 2), // الرأس
    () => ctx.moveTo(150, 120) || ctx.lineTo(150, 180), // الجذع
    () => ctx.moveTo(150, 140) || ctx.lineTo(120, 170), // الذراع الأيسر
    () => ctx.moveTo(150, 140) || ctx.lineTo(180, 170), // الذراع الأيمن
    () => ctx.moveTo(150, 180) || ctx.lineTo(120, 230), // الساق الأيسر
    () => ctx.moveTo(150, 180) || ctx.lineTo(180, 230), // الساق الأيمن
];

function initGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = Array(selectedWord.length).fill("_");
    remainingAttempts = hangmanParts.length;
    wordContainer.textContent = guessedLetters.join(" ");
    messageElement.textContent = "";
    restartButton.classList.add("hidden");
    keyboardContainer.innerHTML = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // إنشاء لوحة المفاتيح
    const letters = "ءأإئؤبتثجحخدذرزسشصضطظعغفقكلامنهةويى".split("");
    letters.forEach((letter) => {
        const key = document.createElement("button");
        key.textContent = letter;
        key.classList.add("key");
        key.addEventListener("click", () => handleGuess(letter, key));
        keyboardContainer.appendChild(key);
    });
}

function handleGuess(letter, keyElement) {
    keyElement.classList.add("disabled");
    keyElement.disabled = true;

    if (selectedWord.includes(letter)) {
        selectedWord.split("").forEach((char, index) => {
            if (char === letter) {
                guessedLetters[index] = char;
            }
        });
        wordContainer.textContent = guessedLetters.join(" ");
        checkWin();
    } else {
        remainingAttempts--;
        hangmanParts[hangmanParts.length - remainingAttempts]();
        ctx.stroke();
        checkLose();
    }
}

function checkWin() {
    if (!guessedLetters.includes("_")) {
        messageElement.textContent = "🎉 تهانينا! لقد فزت!";
        messageElement.style.color = "#2ecc71";
        endGame();
    }
}

function checkLose() {
    if (remainingAttempts === 0) {
        messageElement.textContent = `😢 خسرت! الكلمة كانت: ${selectedWord}`;
        messageElement.style.color = "#e74c3c";
        endGame();
    }
}

function endGame() {
    const keys = document.querySelectorAll(".key");
    keys.forEach((key) => (key.disabled = true));
    restartButton.classList.remove("hidden");
}

restartButton.addEventListener("click", initGame);
