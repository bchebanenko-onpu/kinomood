const initCarousel = () => {
  const carousel = document.getElementById("movieCarousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (!carousel || !prevBtn || !nextBtn) return;

  const getCardWidth = () => {
    const card = carousel.querySelector(".km-movie-card");
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(carousel).gap) || 24;
    return card.offsetWidth + gap;
  };

  prevBtn.addEventListener("click", () =>
    carousel.scrollBy({ left: -getCardWidth(), behavior: "smooth" }),
  );

  nextBtn.addEventListener("click", () =>
    carousel.scrollBy({ left: getCardWidth(), behavior: "smooth" }),
  );
};

const initDateTabs = () => {
  const tabs = document.querySelectorAll(".km-date-tab");
  if (!tabs.length) return;

  const DAY_NAMES = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const today = new Date();

  const formatDate = (d) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}`;
  };

  const getOffsetDate = (offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d;
  };

  const dateIds = [
    "todayDate",
    "tomorrowDate",
    "day2Date",
    "day3Date",
    "day4Date",
  ];
  const nameIds = [null, null, "day2Name", "day3Name", "day4Name"];

  dateIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatDate(getOffsetDate(i));
  });

  nameIds.forEach((id, i) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.textContent = DAY_NAMES[getOffsetDate(i).getDay()];
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
    });
  });
};

const initTimeBtns = () => {
  const timeBtns = document.querySelectorAll(
    ".km-time-btn:not(.km-time-btn--sold)",
  );
  if (!timeBtns.length) return;

  timeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".km-session-row");
      const title =
        row?.querySelector(".km-session-row__title")?.textContent ?? "—";
      const time = btn.textContent.trim();

      const modalInfoEl = document.getElementById("modalMovieInfo");
      if (modalInfoEl)
        modalInfoEl.textContent = `Фільм: ${title} | Час: ${time}`;

      const modalEl = document.getElementById("ticketModal");
      if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).show();
    });
  });
};

const initTicketForm = () => {
  const form = document.getElementById("ticketForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    console.info("[KinoMood] Ticket order:", data);

    bootstrap.Modal.getInstance(document.getElementById("ticketModal"))?.hide();
    form.reset();
    form.classList.remove("was-validated");
    showToast("Квиток замовлено! Деталі надіслано на email.");
  });
};

const initContactForm = () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    console.info("[KinoMood] Contact message:", data);

    document.getElementById("formSuccess")?.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");
    form.style.display = "none";
  });
};

const showToast = (message) => {
  document.getElementById("km-toast")?.remove();

  const toast = Object.assign(document.createElement("div"), {
    id: "km-toast",
    textContent: message,
  });

  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
    background: #1e1e4a; border: 1px solid rgba(245,166,35,0.4);
    color: #fff; padding: 0.9rem 1.4rem; border-radius: 10px;
    font-family: 'Inter', sans-serif; font-size: 0.95rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: kmToastIn 0.3s ease;
  `;

  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>@keyframes kmToastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}</style>`,
  );

  document.body.appendChild(toast);

  setTimeout(() => {
    Object.assign(toast.style, { opacity: "0", transition: "opacity 0.4s" });
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initDateTabs();
  initTimeBtns();
  initTicketForm();
  initContactForm();
});
