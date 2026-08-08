(function () {
  function buildYears() {
    var list = document.querySelector(".year-list");
    if (!list) return;

    var game = document.body.dataset.game;
    var startYear;

    switch (game) {
      case "magic":
        startYear = 1993;
        break;
      case "pokemon":
        startYear = 1999;
        break;
      case "yugioh":
        startYear = 2002;
        break;
      default:
        startYear = new Date().getFullYear();
    }

    var currentYear = new Date().getFullYear();
    var items = [];

    for (var year = currentYear; year >= startYear; year--) {
      items.push(
        '<li class="year-item">' +
          '<label class="year-label" for="year-' +
          year +
          '">' +
          year +
          "</label>" +
          '<input type="checkbox" class="year-checkbox" id="year-' +
          year +
          '" name="year" value="' +
          year +
          '" />' +
          "</li>"
      );
    }

    list.innerHTML = items.join("");
  }

  function buildCards() {
    var grid = document.querySelector(".game-card-grid");
    if (!grid) return;

    var game = document.body.dataset.game;
    var image;
    var alt;

    switch (game) {
      case "magic":
        image = "mtg.jpg";
        alt = "Magic: The Gathering card";
        break;
      case "pokemon":
        image = "pokemon.jpg";
        alt = "Pokemon card";
        break;
      case "yugioh":
        image = "yugioh.jpg";
        alt = "Yu-Gi-Oh! card";
        break;
      default:
        return;
    }

    var items = [];
    for (var i = 0; i < 20; i++) {
      items.push(
        '<li class="game-card">' +
          '<img src="../images/' +
          image +
          '" alt="' +
          alt +
          '" class="game-card-img" decoding="async" loading="lazy" />' +
          "</li>"
      );
    }

    grid.innerHTML = items.join("");
  }

  function cardModal() {
    var grid = document.querySelector(".game-card-grid");
    if (!grid) return;

    var backdrop = document.createElement("div");
    backdrop.className = "card-modal-backdrop";
    document.body.appendChild(backdrop);

    var openCard = null;
    var openPlaceholder = null;

    function openCardModal(card) {
      var placeholder = card.cloneNode(true);
      placeholder.classList.add("game-card-placeholder");
      placeholder.setAttribute("aria-hidden", "true");
      card.replaceWith(placeholder);
      document.body.appendChild(card);

      document.body.classList.add("card-modal-open");
      backdrop.classList.add("is-visible");

      var rect = placeholder.getBoundingClientRect();

      card.classList.add("game-card-modal");
      card.style.top = rect.top + "px";
      card.style.left = rect.left + "px";
      card.style.width = rect.width + "px";
      card.style.height = rect.height + "px";
      void card.offsetWidth;

      var aspect = rect.width / rect.height;
      var targetWidth = Math.min(window.innerWidth * 0.6, 380);
      var targetHeight = targetWidth / aspect;
      var maxHeight = window.innerHeight * 0.85;
      if (targetHeight > maxHeight) {
        targetHeight = maxHeight;
        targetWidth = targetHeight * aspect;
      }

      card.style.top = (window.innerHeight - targetHeight) / 2 + "px";
      card.style.left = (window.innerWidth - targetWidth) / 2 + "px";
      card.style.width = targetWidth + "px";
      card.style.height = targetHeight + "px";

      openCard = card;
      openPlaceholder = placeholder;
    }

    function closeCardModal() {
      if (!openCard || !openPlaceholder) return;

      var card = openCard;
      var placeholder = openPlaceholder;
      var rect = placeholder.getBoundingClientRect();

      openCard = null;
      openPlaceholder = null;

      card.style.top = rect.top + "px";
      card.style.left = rect.left + "px";
      card.style.width = rect.width + "px";
      card.style.height = rect.height + "px";

      card.addEventListener("transitionend", function handleEnd(event) {
        if (event.target !== card || event.propertyName !== "width") return;
        card.removeEventListener("transitionend", handleEnd);
        document.body.classList.remove("card-modal-open");
        backdrop.classList.remove("is-visible");
        card.classList.remove("game-card-modal");
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        card.style.height = "";
        placeholder.replaceWith(card);
      });
    }

    document.addEventListener("click", function (event) {
      var modalCard = event.target.closest(".game-card-modal");
      if (modalCard) {
        closeCardModal();
        return;
      }

      if (event.target === backdrop) {
        closeCardModal();
        return;
      }

      var card = event.target.closest(".game-card");
      if (card && grid.contains(card) && !openCard) {
        openCardModal(card);
      }
    });
  }

  buildYears();
  buildCards();
  cardModal();
})();
