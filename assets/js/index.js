const NASA_API_KEY = "7D9TM4kD76efFh8B5Lkx5NpEsXxgADKAtTJQpCeJ";
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";

//Elements for Navigation
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");

//Elements for APOD
const apodImage = document.getElementById("apod-image");
const apodTitle = document.getElementById("apod-title");
const apodExplanation = document.getElementById("apod-explanation");
const apodDate = document.getElementById("apod-date");
const apodDateDetail = document.getElementById("apod-date-detail");
const apodDateInfo = document.getElementById("apod-date-info");
const apodMediaType = document.getElementById("apod-media-type");
const apodCopyright = document.getElementById("apod-copyright");
const apodLoading = document.getElementById("apod-loading");
const dateInput = document.getElementById("apod-date-input");
const loadDateBtn = document.getElementById("load-date-btn");
const todayBtn = document.getElementById("today-apod-btn");
const apodDateLabel = document.getElementById("apod-date-label");

//Format Date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

//Fetch APOD
async function fetchAPOD(date = "") {
  try {
    apodLoading.classList.remove("hidden");

    const url = date
      ? `${NASA_APOD_URL}?api_key=${NASA_API_KEY}&date=${date}`
      : `${NASA_APOD_URL}?api_key=${NASA_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    updateAPODUI(data);
  } catch (error) {
    console.error("Error fetching APOD:", error);
  } finally {
    apodLoading.classList.add("hidden");
  }
}

//Update UI
function updateAPODUI(data) {
  apodTitle.textContent = data.title;
  apodExplanation.textContent = data.explanation;

  apodDate.textContent = `Astronomy Picture of the Day - ${data.date}`;
  apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${data.date}`;
  apodDateInfo.textContent = data.date;

  apodMediaType.textContent = data.media_type;

  apodCopyright.textContent = data.copyright
    ? `© ${data.copyright}`
    : "© NASA";

    apodDateLabel.textContent = formatDate(data.date); 

  if (data.media_type === "image") {
    apodImage.src = data.url;
  } else {
    apodImage.src = "./assets/images/placeholder.webp";
  }
}

//Load Event Button
loadDateBtn.addEventListener("click", () => {
  if (dateInput.value) {
    fetchAPOD(dateInput.value);
  }
});

//Today Event Button
todayBtn.addEventListener("click", () => {
  fetchAPOD();
});

//Switch Sections
function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  document.getElementById(sectionId).classList.remove("hidden");

  navLinks.forEach((link) => {
    link.classList.remove("bg-blue-500/10", "text-blue-400");
    link.classList.add("text-slate-300");
  });

  document.querySelector(`[data-section="${sectionId}"]`).classList.add("bg-blue-500/10", "text-blue-400");
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const sectionId = link.dataset.section;
    showSection(sectionId);
  });
});

showSection("today-in-space");

//Load today on start
fetchAPOD();



// SpaceDevs Launches Section
const LAUNCHES_API ="https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10";

//Elements for Launches
const launchesGrid = document.getElementById("launches-grid");
const launchesCount = document.getElementById("launches-count");
const launchesCountMobile = document.getElementById("launches-count-mobile");

//Fetch and display launches
async function getLaunches() {
  try {
    const response = await fetch(LAUNCHES_API);
    const data = await response.json();
    const launches = data.results;

    //update count in header
    launchesCount.textContent = `${launches.length} Launches`;
    launchesCountMobile.textContent = launches.length;

    //remove static cards
    launchesGrid.innerHTML = "";

    launches.forEach((launch) => {
      const launchDate = new Date(launch.net);

      const date = launchDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const time = launchDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });

      const status =
        launch.status?.name || "TBD";

      const provider =
        launch.launch_service_provider?.name || "Unknown";

      const rocket =
        launch.rocket?.configuration?.name || "Unknown";

      const location =
        launch.pad?.name || "Unknown Location";

      const card = `
        <div
          class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
        >
          <div
            class="relative h-48 bg-slate-900/50 flex items-center justify-center"
          >
            <i class="fas fa-rocket text-5xl text-slate-700"></i>
            <div class="absolute top-3 right-3">
              <span
                class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
              >
                ${status}
              </span>
            </div>
          </div>

          <div class="p-5">
            <div class="mb-3">
              <h4
                class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
              >
                ${launch.name}
              </h4>
              <p class="text-sm text-slate-400 flex items-center gap-2">
                <i class="fas fa-building text-xs"></i>
                ${provider}
              </p>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-calendar text-slate-500 w-4"></i>
                <span class="text-slate-300">${date}</span>
              </div>

              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-clock text-slate-500 w-4"></i>
                <span class="text-slate-300">${time} UTC</span>
              </div>

              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-rocket text-slate-500 w-4"></i>
                <span class="text-slate-300">${rocket}</span>
              </div>

              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                <span class="text-slate-300 line-clamp-1">
                  ${location}
                </span>
              </div>
            </div>

            <div
              class="flex items-center gap-2 pt-4 border-t border-slate-700"
            >
              <button
                class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
              >
                Details
              </button>
              <button
                class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <i class="far fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      launchesGrid.insertAdjacentHTML("beforeend", card);
    });
  } catch (error) {
    console.error("Error fetching launches:", error);
  }
}

//Load launches on start
getLaunches();



// Planets Section
const PLANETS_API ="https://solar-system-opendata-proxy.vercel.app/api/planets";

//Elements for Planets
const planetCards = document.querySelectorAll(".planet-card");
const planetImage = document.getElementById("planet-detail-image");
const planetName = document.getElementById("planet-detail-name");
const planetDescription = document.getElementById("planet-detail-description");
const planetDistance = document.getElementById("planet-distance");
const planetRadius = document.getElementById("planet-radius");
const planetMass = document.getElementById("planet-mass");
const planetDensity = document.getElementById("planet-density");
const planetOrbital = document.getElementById("planet-orbital-period");
const planetRotation = document.getElementById("planet-rotation");
const planetMoons = document.getElementById("planet-moons");
const planetGravity = document.getElementById("planet-gravity");
const planetDiscoverer = document.getElementById("planet-discoverer");
const planetDiscoveryDate = document.getElementById("planet-discovery-date");
const planetBodyType = document.getElementById("planet-body-type");
const planetVolume = document.getElementById("planet-volume");

//Data storage
let planetsData = [];

//Fetch Planets Data
async function getPlanets() {
  try {
    const response = await fetch(PLANETS_API);
    const data = await response.json();

    //filter only planets
    planetsData = data.bodies.filter((body) => body.isPlanet);
  } catch (error) {
    console.error("Error fetching planets:", error);
  }
}

//Update Planet Details
function updatePlanetDetails(planet) {
  planetName.textContent = planet.englishName;
  planetDescription.textContent =
    planet.description ||
    "No description available for this planet.";

  planetImage.src = `./assets/images/${planet.englishName.toLowerCase()}.png`;
  planetImage.alt = planet.englishName;

  planetDistance.textContent = planet.semimajorAxis
    ? `${(planet.semimajorAxis / 1000000).toFixed(1)}M km`
    : "N/A";

  planetRadius.textContent = planet.meanRadius
    ? `${planet.meanRadius.toLocaleString()} km`
    : "N/A";

  planetMass.textContent = planet.mass
    ? `${planet.mass.massValue} × 10²${planet.mass.massExponent} kg`
    : "N/A";

  planetDensity.textContent = planet.density
    ? `${planet.density} g/cm³`
    : "N/A";

  planetOrbital.textContent = planet.sideralOrbit
    ? `${planet.sideralOrbit} days`
    : "N/A";

  planetRotation.textContent = planet.sideralRotation
    ? `${planet.sideralRotation} hours`
    : "N/A";

  planetMoons.textContent = planet.moons
    ? planet.moons.length
    : 0;

  planetGravity.textContent = planet.gravity
    ? `${planet.gravity} m/s²`
    : "N/A";

  planetDiscoverer.textContent =
    planet.discoveredBy || "Known since antiquity";

  planetDiscoveryDate.textContent =
    planet.discoveryDate || "Ancient";

  planetBodyType.textContent = planet.bodyType || "Planet";

  planetVolume.textContent = planet.vol
    ? `${planet.vol.volValue} × 10²${planet.vol.volExponent} km³`
    : "N/A";
}

//click events
planetCards.forEach((card) => {
  card.addEventListener("click", () => {
    const planetId = card.dataset.planetId;

    const planet = planetsData.find(
      (p) => p.englishName.toLowerCase() === planetId
    );

    if (planet) {
      updatePlanetDetails(planet);
    }
  });
});

//Load planets on start
getPlanets();