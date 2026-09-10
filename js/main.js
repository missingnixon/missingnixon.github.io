(function () {
  var dateEl = document.getElementById("today-date");
  if (dateEl) {
    var d = new Date();
    dateEl.textContent = d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", links.classList.contains("open"));
    });
  }

  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".mainnav a.navlink").forEach(function (a) {
    var href = a.getAttribute("href").split("?")[0];
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  var grid = document.getElementById("archive-grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".story"));
    var countEl = document.getElementById("archive-count");
    var searchInput = document.getElementById("archive-search");
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var activeField = "all";

    var params = new URLSearchParams(window.location.search);
    var preset = params.get("field");
    if (preset) {
      var match = buttons.filter(function (b) { return b.dataset.field === preset; })[0];
      if (match) activeField = preset;
    }

    function apply() {
      var q = (searchInput && searchInput.value || "").toLowerCase().trim();
      var visible = 0;
      cards.forEach(function (card) {
        var field = card.dataset.field || "";
        var text = card.textContent.toLowerCase();
        var fieldOk = activeField === "all" || field === activeField;
        var textOk = !q || text.indexOf(q) !== -1;
        var show = fieldOk && textOk;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      var none = grid.querySelector(".no-results");
      if (visible === 0) {
        if (!none) {
          none = document.createElement("div");
          none.className = "no-results";
          none.textContent = "No papers match your search yet. Check back soon.";
          grid.appendChild(none);
        }
        none.style.display = "";
      } else if (none) {
        none.style.display = "none";
      }
      if (countEl) {
        countEl.textContent = "Showing " + visible + " of " + cards.length + " publications";
      }
      buttons.forEach(function (b) {
        b.classList.toggle("active", b.dataset.field === activeField);
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        activeField = b.dataset.field;
        apply();
      });
    });
    if (searchInput) {
      searchInput.addEventListener("input", apply);
    }
    apply();
  }
})();