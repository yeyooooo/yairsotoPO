const CONTACT_EMAIL = "yaircmpss@gmail.com";
const CONTACT_PHONE = "34-117-3818";
const BOOKING_URL = "";

const REELS = {
  karting: {
    title: "Karting",
    src: "",
    poster: "./assets/photos/karting-speed.webp",
  },
  acapulco: {
    title: "Acapulco",
    src: "",
    poster: "./assets/photos/acapulco-night.webp",
  },
  puebla: {
    title: "Puebla",
    src: "",
    poster: "./assets/photos/puebla-glass.webp",
  },
};

const root = document.documentElement;
const parallaxLayers = [...document.querySelectorAll(".parallax-layer")];
const revealItems = [...document.querySelectorAll(".reveal")];
const contactForm = document.querySelector("#contactForm");
const scheduleForm = document.querySelector("#scheduleForm");
const nameInput = document.querySelector("#visitorName");
const messageInput = document.querySelector("#visitorMessage");
const phoneLink = document.querySelector("#phoneLink");
const emailLink = document.querySelector("#emailLink");
const meetingName = document.querySelector("#meetingName");
const meetingTime = document.querySelector("#meetingTime");
const meetingNote = document.querySelector("#meetingNote");
const scheduleEmail = document.querySelector("#scheduleEmail");
const scheduleSms = document.querySelector("#scheduleSms");
const calendarLink = document.querySelector("#calendarLink");
const modal = document.querySelector("#mediaModal");
const video = document.querySelector("#portfolioVideo");
const photoPreview = document.querySelector("#photoPreview");
const placeholder = document.querySelector("#modalPlaceholder");
const modalTitle = document.querySelector("#modalTitle");
const closeButton = document.querySelector("#modalClose");

let pointerX = 0;
let pointerY = 0;
let ticking = false;

function setPointer(event) {
  pointerX = event.clientX / window.innerWidth - 0.5;
  pointerY = event.clientY / window.innerHeight - 0.5;
  requestFrame();
}

function requestFrame() {
  if (ticking) {
    return;
  }

  ticking = true;
  requestAnimationFrame(updateMotion);
}

function updateMotion() {
  const scrollY = window.scrollY;
  root.style.setProperty("--mx", pointerX.toFixed(3));
  root.style.setProperty("--my", pointerY.toFixed(3));

  parallaxLayers.forEach((layer) => {
    const depth = Number(layer.dataset.depth || 0);
    const pointer = Number(layer.dataset.pointer || 0);
    layer.style.setProperty("--parallax-x", `${(pointerX * pointer).toFixed(2)}px`);
    layer.style.setProperty("--parallax-y", `${(scrollY * depth + pointerY * pointer).toFixed(2)}px`);
  });

  ticking = false;
}

function contactMessage() {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (name && message) {
    return `${name}: ${message}`;
  }

  return message || name;
}

function updateContactLinks() {
  const encodedMessage = encodeURIComponent(contactMessage());
  const subject = encodeURIComponent("Portfolio");
  phoneLink.href = `sms:${CONTACT_PHONE}${encodedMessage ? `?&body=${encodedMessage}` : ""}`;
  emailLink.href = `mailto:${CONTACT_EMAIL}?subject=${subject}${encodedMessage ? `&body=${encodedMessage}` : ""}`;
  phoneLink.setAttribute("aria-label", `Enviar SMS a ${CONTACT_PHONE}`);
  emailLink.setAttribute("aria-label", `Enviar correo a ${CONTACT_EMAIL}`);
}

function scheduleMessage() {
  const name = meetingName.value.trim();
  const time = meetingTime.value;
  const note = meetingNote.value.trim();
  const parts = ["Solicitud de reunión"];

  if (name) {
    parts.push(`Nombre: ${name}`);
  }

  if (time) {
    parts.push(`Fecha: ${formatMeetingTime(time)}`);
  }

  if (note) {
    parts.push(`Mensaje: ${note}`);
  }

  return parts.join("\n");
}

function formatMeetingTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function calendarDates(value) {
  const start = value ? new Date(value) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return `${stamp(start)}/${stamp(end)}`;
}

function updateScheduleLinks() {
  const message = scheduleMessage();
  const encodedMessage = encodeURIComponent(message);
  const subject = encodeURIComponent("Reunión");
  scheduleEmail.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodedMessage}`;
  scheduleSms.href = `sms:${CONTACT_PHONE}?&body=${encodedMessage}`;
  scheduleEmail.setAttribute("aria-label", `Solicitar reunión por correo a ${CONTACT_EMAIL}`);
  scheduleSms.setAttribute("aria-label", `Solicitar reunión por SMS a ${CONTACT_PHONE}`);

  if (BOOKING_URL) {
    calendarLink.href = BOOKING_URL;
    calendarLink.setAttribute("aria-label", "Abrir calendario de disponibilidad");
  } else {
    const dates = calendarDates(meetingTime.value);
    const details = encodeURIComponent(`${message}\n${CONTACT_EMAIL}`);
    calendarLink.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reunion%20con%20Yair%20Soto&details=${details}&dates=${dates}`;
    calendarLink.setAttribute("aria-label", "Crear evento tentativo en Google Calendar");
  }
}

function resetModal() {
  video.pause();
  video.removeAttribute("src");
  video.removeAttribute("poster");
  video.load();
  video.hidden = true;
  photoPreview.hidden = true;
  placeholder.hidden = true;
  placeholder.style.backgroundImage = "";
}

function openReel(key) {
  const reel = REELS[key];

  if (!reel) {
    return;
  }

  resetModal();
  modalTitle.textContent = reel.title;

  if (reel.src) {
    video.src = reel.src;
    video.poster = reel.poster;
    video.hidden = false;
  } else {
    placeholder.innerHTML = `<span>${reel.title}</span>`;
    placeholder.style.backgroundImage = `url("${reel.poster}")`;
    placeholder.hidden = false;
  }

  modal.showModal();
}

function openPhoto(button) {
  resetModal();
  const src = button.dataset.photo;
  const title = button.dataset.title || "";
  const image = button.querySelector("img");

  photoPreview.src = src;
  photoPreview.alt = image?.alt || title;
  photoPreview.hidden = false;
  modalTitle.textContent = title;
  modal.showModal();
}

function closeModal() {
  modal.close();
  resetModal();
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

window.addEventListener("pointermove", setPointer, { passive: true });
window.addEventListener("scroll", requestFrame, { passive: true });
window.addEventListener("resize", requestFrame);
contactForm.addEventListener("input", updateContactLinks);
scheduleForm.addEventListener("input", updateScheduleLinks);
closeButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.querySelectorAll("[data-reel]").forEach((button) => {
  button.addEventListener("click", () => openReel(button.dataset.reel));
});

document.querySelectorAll("[data-photo]").forEach((button) => {
  button.addEventListener("click", () => openPhoto(button));
});

updateMotion();
updateContactLinks();
updateScheduleLinks();
revealOnScroll();
