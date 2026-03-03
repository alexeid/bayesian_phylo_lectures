(function() {
  var params = new URLSearchParams(window.location.search);
  var homeKey = params.get('home');

  if (homeKey && typeof LECTURE_HOMES !== 'undefined' && LECTURE_HOMES[homeKey]) {
    var dest = LECTURE_HOMES[homeKey];
    sessionStorage.setItem('lectureHome', dest.url);
    sessionStorage.setItem('lectureHomeLabel', dest.label);
  }

  function updateHomeLinks() {
    var homeUrl = sessionStorage.getItem('lectureHome');
    var homeLabel = sessionStorage.getItem('lectureHomeLabel');

    if (homeUrl) {
      var links = document.querySelectorAll('[data-home-link]');
      for (var i = 0; i < links.length; i++) {
        links[i].href = homeUrl;
      }
    }

    if (homeLabel) {
      var labels = document.querySelectorAll('[data-home-label]');
      for (var i = 0; i < labels.length; i++) {
        labels[i].textContent = homeLabel;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHomeLinks);
  } else {
    updateHomeLinks();
  }
})();
