const answers = {
  "yes": ["Yes, definitely.", "Absolutely!", "No doubt about it."],
  "no": ["No, sorry.", "Definitely not.", "I don't think so."],
  "maybe": ["Maybe.", "It's possible.", "I'm not sure."],
  "future": ["Only time will tell.", "I cannot predict the future.", "The future is uncertain."],
  "love": ["Love is in the air.", "Your heart knows the answer.", "Follow your heart."],
  "career": ["Success is on the horizon.", "Hard work pays off.", "Believe in yourself and your abilities."],
  "health": ["Take care of yourself.", "Health is wealth.", "Your body is your temple."],
  "travel": ["Adventure awaits!", "Go and explore the world.", "Broaden your horizons."],
  "finance": ["Invest in your future.", "Save for a rainy day.", "Financial stability is key."],
  "education": ["Knowledge is power.", "Keep learning and growing.", "Education is the key to success."],
  "friendship": ["Cherish your friends.", "A true friend is a treasure.", "Friends are the family we choose."],
  "hobbies": ["Find joy in your hobbies.", "Explore your passions.", "Do what makes you happy."],
  "luck": ["Fortune favors the bold.", "Luck is on your side.", "Good things come to those who wait."],
  "family": ["Family is a source of strength.", "Cherish your loved ones.", "Family matters most."],
  "creativity": ["Let your imagination run wild.", "Express yourself.", "Create something amazing."],
  "spirituality": ["Trust your intuition.", "Look within for guidance.", "Connect with your inner self."],
  "advice": ["Listen to your instincts.", "Weigh your options carefully.", "Seek wisdom from others."],
  "default": ["The stars are aligning...", "Signs point in different directions.", "The answer is shrouded in mystery.", "It's open to interpretation.", "There's more than one possibility.", "It could go either way.", "Things are still unfolding.", "The universe is keeping secrets.", "The answer lies within.", "That's a matter of perspective.", "The winds of change are blowing.", "Intriguing possibilities abound.", "Destiny has many paths.", "The fates have not decided.", "There's magic in the air.", "A confluence of factors is at play.", "Let your intuition guide you.", "Ponder the question deeply.", "Life is full of surprises.", "The cosmos holds the answer."]
};

const keywords = {
  "yes": ["will", "can", "is it", "are they", "does", "do", "should", "could", "would", "is", "are"],
  "no": ["won't", "can't", "isn't", "aren't", "don't", "doesn't", "shouldn't", "couldn't", "wouldn't"],
  "future": ["future", "tomorrow", "next", "later", "someday", "will happen"],
  "love": ["love", "relationship", "affection", "romance", "heart", "crush", "passion", "feelings"],
  "career": ["job", "career", "work", "profession", "promotion", "raise", "employment", "business"],
  "health": ["health", "wellness", "well-being", "exercise", "diet", "fitness", "mental health", "illness"],
  "travel": ["travel", "trip", "vacation", "journey", "adventure", "explore", "destination", "tour", "voyage"],
  "finance": ["money", "finance", "financial", "savings", "investment", "debt", "budget", "wealth", "income"],
  "education": ["education", "school", "learning", "knowledge", "study", "degree", "college", "university", "course"],
  "friendship": ["friend", "friends", "friendship", "bff", "best friend", "pal", "buddy", "mate", "companionship"],
  "hobbies": ["hobby", "interest", "pastime", "leisure", "activity", "passion", "fun", "enjoyment", "pursuit"],
  "luck": ["luck", "lucky", "fortune", "chance", "serendipity", "fate", "destiny", "providence", "kismet"],
  "family": ["family", "parents", "siblings", "brother", "sister", "mother", "father", "children", "relatives"],
  "creativity": ["creativity", "art", "expression", "imagination", "inspiration", "innovation", "talent", "skill", "craft"],
  "spirituality": ["spirituality", "faith", "belief", "inner self", "intuition", "wisdom", "soul", "meditation", "mindfulness"],
  "advice": ["advice", "guidance", "recommendation", "suggestion", "counsel", "help", "insight", "direction", "decision"]
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/`;
}

const extractKeyword = (question) => {
  let res = "default";
  for (const key in keywords) {
    for (const word of keywords[key]) {
      if (question.includes(word)) res = key;
    }
  }
  return res;
}

const generateAnswer = (keyword) => {
  const previousAnswer = getCookie(`previousAnswer_${keyword}`);
  const answerPool = answers[keyword];

  if (previousAnswer) {
    const availableAnswers = answerPool.filter(answer => answer !== previousAnswer);
    const index = Math.floor(Math.random() * availableAnswers.length);
    setCookie(`previousAnswer_${keyword}`, availableAnswers[index], 1);
    return availableAnswers[index];
  } else {
    const index = Math.floor(Math.random() * answerPool.length);
    setCookie(`previousAnswer_${keyword}`, answerPool[index], 1);
    return answerPool[index];
  }
}

  const userInfoForm = document.getElementById("user-info");
  const crystalBall = document.getElementById("crystal-ball");
  const fortuneText = document.getElementById("fortune-text");
  const loader = document.getElementById("loader");
  const questionInput = document.getElementById("question");
  const goBackButton = document.getElementById("go-back");
  const instructions = document.getElementById("instructions");
  const title = document.getElementById("title");
  const questionAsked = document.getElementById("question-asked");

  function updateBallState() {
    if (questionInput.value.trim()) {
      crystalBall.style.pointerEvents = "auto";
    } else {
      crystalBall.style.pointerEvents = "none";
    }
  }
  
  questionInput.addEventListener("input", updateBallState);

  goBackButton.addEventListener("click", function () {
    location.reload();
  });

  const buttonSound = document.querySelector('#button-sound');

  function revealFortune() {
    // old submit button functionality
    title.style.display = "none";
    const question = questionInput.value.trim();

    const lastLetter = question.substr(question.length - 1);

    // ternary function to add question mark
    questionAsked.innerHTML = lastLetter == '?' ? `<strong>${question}</strong>` : `<strong>${question}?</strong>`;
    userInfoForm.style.display = "none";

    instructions.style.display = "none";
    crystalBall.classList.add("shake");
    loader.style.display = "block";
    buttonSound.currentTime = 0; // resets audio to beginning on each click
    buttonSound.play();
    setTimeout(() => {
    loader.style.display = "none";
    crystalBall.classList.remove("shake");

    const keyword = extractKeyword(questionInput.value.trim())
    const answer = generateAnswer(keyword);
    fortuneText.textContent = answer;

    fortuneText.classList.add("fade-in-up");
    fortuneText.classList.remove("visible");
    setTimeout(() => {
      fortuneText.classList.add("visible");
      fortuneText.classList.remove("fade-in-up");
      goBackButton.style.display = "block"; // Show the "Go Back" button
    }, 500);

    setTimeout(() => {
      fortuneText.classList.remove("visible");
      instructions.innerHTML = `Click again for a new response!`
      instructions.style.display = "block";
      questionAsked.innerHTML = ``;

    }, 3000);
  }, 2000);
  }
  
crystalBall.addEventListener("click", revealFortune);
crystalBall.style.pointerEvents = "none";
