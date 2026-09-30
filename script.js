const jobContainer = document.getElementById("job-container");
const filterContainer = document.getElementById("filter-container");
let clickedItems = [];
let allJobs = []; 

async function loadData() {
  try {
    const response = await fetch("./data.json");
    allJobs = await response.json();
    updateApp(); 

    jobContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn")) {
        const selectedTag = e.target.textContent.trim();

        if (!clickedItems.includes(selectedTag)) {
          clickedItems.push(selectedTag);
          updateApp();
        }
      }
    });

    filterContainer.addEventListener("click", (e) => {
      if (e.target.dataset.remove) {
        const tagToRemove = e.target.dataset.remove;
        clickedItems = clickedItems.filter((tag) => tag !== tagToRemove);
        updateApp();
      }

      if (e.target.id === "clear-btn") {
        clickedItems = [];
        updateApp();
      }
    });
  } catch (error) {
    console.error("Failed to load jobs data:", error);
  }
}


function updateApp() {
  renderFilterContainer();
  filterAndDisplayJobs();
}

function renderFilterContainer() {
  if (clickedItems.length === 0) {
    filterContainer.classList.add("hidden");
    filterContainer.innerHTML = "";
    return;
  }

  filterContainer.classList.remove("hidden");

  const tagsHTML = clickedItems
    .map(
      (tag) => `
    <div class="flex items-center bg-neutral-100 text-primary font-bold rounded overflow-hidden text-sm">
      <span class="px-3 py-1.5">${tag}</span>
      <button data-remove="${tag}" aria-label="Remove ${tag} filter" class="bg-primary text-white px-2.5 py-2 hover:bg-neutral-900 transition-colors cursor-pointer">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `,
    )
    .join("");

  filterContainer.innerHTML = `
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center flex-wrap gap-3">
        ${tagsHTML}
      </div>
      <button id="clear-btn" class="text-neutral-500 font-bold hover:text-primary hover:underline cursor-pointer">
        Clear
      </button>
    </div>
  `;
}

function filterAndDisplayJobs() {
  const filtered = allJobs.filter((job) => {
    const jobTags = [
      job.role,
      job.level,
      ...(job.tools || []),
      ...job.languages,
    ];
    return clickedItems.every((tag) => jobTags.includes(tag));
  });

  displayData(filtered);
}

function displayData(myData) {
  jobContainer.innerHTML = "";

  myData.forEach((data) => {
    const card = document.createElement("div");

    card.className = `bg-white shadow-xl rounded-md p-6 mb-6 flex flex-col md:flex-row md:items-center relative transition-all duration-300 ${
      data.featured ? "border-l-4 border-primary" : ""
    }`;
    card.classList.add("card");

    card.innerHTML = `
      <div class="-mt-16 md:mt-0 md:mr-5">
            <img src="${data.logo}" alt="" />
      </div>

  <div class="md:flex md:justify-between md:items-center w-full gap-4">
    
    <!-- Left Side: Job Info -->
    <div class="flex flex-col space-y-2">
      <div class="flex items-center flex-wrap gap-2">
        <span class="text-primary font-bold mr-2">${data.company}</span>
        ${data.new ? "<span class='text-white font-bold rounded-full py-0.5 px-2.5 bg-primary text-xs'>NEW!</span>" : ""}
        ${data.featured ? "<span class='text-white font-bold rounded-full py-0.5 px-2.5 bg-black text-xs'>FEATURED</span>" : ""}
      </div>

      <h2 class="font-bold text-lg hover:text-primary cursor-pointer">${data.position}</h2>

      <div class="flex items-center gap-x-3 text-neutral-gray-400 text-sm whitespace-nowrap">
        <span>${data.postedAt}</span>
        <span class="text-2xl">&bull;</span>
        <span>${data.contract}</span>
        <span class="text-2xl">&bull;</span>
        <span>${data.location}</span>
      </div>

      <hr class="border-neutral-200 my-3 md:hidden">
    </div>

    <div class="flex flex-wrap gap-2 md:justify-end">
      <button class="btn">${data.role}</button>
      <button class="btn">${data.level}</button>
      
      ${!data.tools ? "" : data.tools.map((tool) => `<button class="btn">${tool}</button>`).join("")}
      
      ${data.languages.map((language) => `<button class="btn">${language}</button>`).join("")}
    </div>

  </div>
    `;
    jobContainer.append(card);
  });
}

loadData();