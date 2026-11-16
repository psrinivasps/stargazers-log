const statusMessage = document.querySelector("#status");
const repositoryList = document.querySelector("#repositories");

function setStatus(message, isError = false) {
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = message;
  statusMessage.classList.toggle("status--error", isError);
  statusMessage.setAttribute("role", isError ? "alert" : "status");
  statusMessage.setAttribute("aria-live", isError ? "assertive" : "polite");
}

function formatDate(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return "Starred date unavailable";
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "Starred date unavailable"
    : `Starred on ${date.toLocaleDateString()}`;
}

function renderRepository(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const owner = typeof repository.owner === "string" ? repository.owner : "unknown";
  const name = typeof repository.name === "string" ? repository.name : "unknown";
  const url = typeof repository.url === "string" ? repository.url : "#";
  const descriptionText = typeof repository.description === "string" && repository.description.trim() !== ""
    ? repository.description
    : "No description provided.";

  const title = document.createElement("h2");
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noreferrer noopener";
  link.textContent = `${owner}/${name}`;
  title.append(link);

  const description = document.createElement("p");
  description.textContent = descriptionText;

  const date = document.createElement("p");
  date.className = "starred-date";
  date.textContent = formatDate(repository.starredAt);

  item.append(title, description, date);
  return item;
}

async function loadRepositories() {
  if (!statusMessage || !repositoryList) {
    return;
  }

  if (window.location.protocol === "file:") {
    setStatus("Open this page with a local web server to load the repository list.", true);
    return;
  }

  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    const validRepositories = repositories.filter((repository) => repository && typeof repository === "object");
    repositoryList.replaceChildren(...validRepositories.map(renderRepository));
    setStatus(validRepositories.length ? "" : "No starred repositories yet.");
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    setStatus("Could not load repositories. Please try again later.", true);
  }
}

loadRepositories();
