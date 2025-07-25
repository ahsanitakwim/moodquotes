let quotesData = {};
let currentMood = null;
let currentQuote = null;

const quoteBox = document.getElementById("quoteBox");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const nextBtn = document.getElementById("nextQuote");
const saveBtn = document.getElementById("saveFav");
const showFavoritesBtn = document.getElementById("showFavorites");
const favContainer = document.getElementById("favContainer");
const favoritesList = document.getElementById("favoritesList");

async function loadQuotes() {
  try {
    const res = await fetch("quotes.json");
    quotesData = await res.json();
  } catch (err) {
    quoteText.textContent = "Gagal memuat kutipan 😞";
    console.error("Fetch error:", err);
  }
}

function showRandomQuote(mood) {
  const moodQuotes = quotesData[mood];
  if (!moodQuotes || moodQuotes.length === 0) {
    quoteText.textContent = "Tidak ada kutipan untuk mood ini.";
    return;
  }

  const random = moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
  currentQuote = random;

  quoteText.textContent = `"${random.text}"`;
  quoteAuthor.textContent = `— ${random.author}`;

  quoteBox.classList.remove("opacity-0", "scale-95");
  quoteBox.classList.add("opacity-100", "scale-100");
  nextBtn.classList.remove("hidden");
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorite(quote) {
  const favorites = getFavorites();
  const exists = favorites.find(q => q.text === quote.text && q.author === quote.author);
  if (!exists) {
    favorites.push(quote);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Disimpan ke favorit!");
  } else {
    alert("Sudah ada di favorit.");
  }
}

function showFavorites() {
  const favorites = getFavorites();
  favContainer.innerHTML = "";

  if (favorites.length === 0) {
    favContainer.innerHTML = "<li class='text-gray-500'>Belum ada favorit.</li>";
  } else {
    favorites.forEach(q => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="italic">"${q.text}"</span> — <span class="text-gray-500">${q.author}</span>`;
      favContainer.appendChild(li);
    });
  }

  favoritesList.classList.remove("hidden");
}

document.querySelectorAll(".mood-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentMood = btn.dataset.mood;
    showRandomQuote(currentMood);
  });
});

nextBtn.addEventListener("click", () => {
  if (currentMood) showRandomQuote(currentMood);
});

saveBtn.addEventListener("click", () => {
  if (currentQuote) saveFavorite(currentQuote);
});

showFavoritesBtn.addEventListener("click", () => {
  showFavorites();
});

window.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
});
