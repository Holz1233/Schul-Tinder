let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
let currentIndex = 0;
let myProfile = null;
let profilePicDataURL = "";
let matches = JSON.parse(localStorage.getItem("matches")) || {};
let currentChatPartner = null;

document.getElementById("profile-pic-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePicDataURL = e.target.result;
            document.getElementById("profile-pic-preview").src = profilePicDataURL;
            document.getElementById("profile-pic-preview").classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
});

// Event-Listener für den Profil erstellen Button
document.getElementById("create-profile-btn").addEventListener("click", createProfile);

function createProfile() {
    // Holen der Daten aus den Eingabefeldern
    myProfile = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        bio: document.getElementById("bio").value,
        hobbies: document.getElementById("hobbies").value,
        city: document.getElementById("city").value,
        school: document.getElementById("school").value,
        class: document.getElementById("class").value,
        pic: profilePicDataURL || "https://via.placeholder.com/150" // Standardbild
    };

    // Einfaches Validieren: Wenn Felder leer sind, nichts speichern
    if (!myProfile.name || !myProfile.age || !myProfile.bio || !myProfile.city || !myProfile.school || !myProfile.class) {
        alert("Bitte fülle alle Felder aus!");
        return;
    }

    // Profil speichern
    profiles.push(myProfile);
    localStorage.setItem("profiles", JSON.stringify(profiles)); // Speichern der Profile

    // Registrierung ausblenden und zum Swipen übergehen
    document.getElementById("register").classList.add("hidden");
    document.getElementById("swipe").classList.remove("hidden");

    // Lade das erste Profil
    loadProfile();
}

function loadProfile() {
    if (currentIndex >= profiles.length) {
        alert("Keine weiteren Profile verfügbar!");
        return;
    }

    let profile = profiles[currentIndex];
    document.getElementById("profile-name").innerText = profile.name;
    document.getElementById("profile-age").innerText = `${profile.age} Jahre alt`;
    document.getElementById("profile-bio").innerText = profile.bio;
    document.getElementById("profile-hobbies").innerText = `Hobbys: ${profile.hobbies}`;
    document.getElementById("profile-city").innerText = `Stadt: ${profile.city}`;
    document.getElementById("profile-school").innerText = `Schule: ${profile.school}`;
    document.getElementById("profile-class").innerText = `Klasse: ${profile.class}`;
    document.getElementById("profile-pic").src = profile.pic;
}

function swipeRight() {
    let profile = profiles[currentIndex];

    if (!matches[profile.name]) {
        matches[profile.name] = { liked: true };
        localStorage.setItem("matches", JSON.stringify(matches));
    } else {
        alert(`Es ist ein Match mit ${profile.name}!`);
        openChat(profile);
    }

    currentIndex++; // Gehe zum nächsten Profil
    loadProfile(); // Lade das nächste Profil
}

function swipeLeft() {
    currentIndex++;
    loadProfile(); // Lade das nächste Profil
}

function openChat(profile) {
    currentChatPartner = profile;
    document.getElementById("swipe").classList.add("hidden");
    document.getElementById("chat").classList.remove("hidden");
    loadChatMessages();
}

function loadChatMessages() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = ""; // Lösche bestehende Nachrichten

    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.forEach(msg => {
        if (msg.to === currentChatPartner.name || msg.from === currentChatPartner.name) {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("chat-message");
            messageDiv.classList.add(msg.from === myProfile.name ? "user" : "match");
            messageDiv.innerText = msg.text;
            chatBox.appendChild(messageDiv);
        }
    });
}

function sendMessage() {
    const messageText = document.getElementById("chat-input").value;
    if (messageText.trim() === "") return;

    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    const newMessage = {
        from: myProfile.name,
        to: currentChatPartner.name,
        text: messageText
    };

    messages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(messages));

    loadChatMessages(); // Zeige neue Nachricht an
    document.getElementById("chat-input").value = ""; // Eingabefeld zurücksetzen
}
