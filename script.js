const CONTACT_EMAIL = "yaircmpss@gmail.com";
const CONTACT_PHONE = "34-117-3818";
const PORTFOLIO_VIDEO = "";

const root = document.documentElement;
const form = document.querySelector("#contactForm");
const nameInput = document.querySelector("#visitorName");
const messageInput = document.querySelector("#visitorMessage");
const phoneLink = document.querySelector("#phoneLink");
const emailLink = document.querySelector("#emailLink");
const modal = document.querySelector("#videoModal");
const video = document.querySelector("#portfolioVideo");
const placeholder = document.querySelector("#videoPlaceholder");
const closeButton = document.querySelector("#modalClose");
const videoTriggers = [document.querySelector("#showreel"), document.querySelector("#projectPreview")];

function updatePointer(event) {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  root.style.setProperty("--mx", x.toFixed(3));
  root.style.setProperty("--my", y.toFixed(3));
}

function getMessage() {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (name && message) {
    return `${name}: ${message}`;
  }

  return message || name;
}

function updateContactLinks() {
  const encodedMessage = encodeURIComponent(getMessage());
  const subject = encodeURIComponent("Portfolio");
  phoneLink.href = `sms:${CONTACT_PHONE}${encodedMessage ? `?&body=${encodedMessage}` : ""}`;
  emailLink.href = `mailto:${CONTACT_EMAIL}?subject=${subject}${encodedMessage ? `&body=${encodedMessage}` : ""}`;
  phoneLink.setAttribute("aria-label", `Enviar SMS a ${CONTACT_PHONE}`);
  emailLink.setAttribute("aria-label", `Enviar correo a ${CONTACT_EMAIL}`);
}

function openVideo() {
  if (PORTFOLIO_VIDEO) {
    video.src = PORTFOLIO_VIDEO;
    video.hidden = false;
    placeholder.hidden = true;
  } else {
    video.hidden = true;
    placeholder.hidden = false;
  }

  modal.showModal();
}

function closeVideo() {
  modal.close();
  video.pause();
}

window.addEventListener("pointermove", updatePointer, { passive: true });
form.addEventListener("input", updateContactLinks);
videoTriggers.forEach((trigger) => trigger.addEventListener("click", openVideo));
closeButton.addEventListener("click", closeVideo);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeVideo();
  }
});

updateContactLinks();
