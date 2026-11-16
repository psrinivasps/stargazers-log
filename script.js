const statusMessage = document.querySelector("#status");
const repositoryList = document.querySelector("#repositories");

function renderRepository(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const title = document.createElement("h2");
  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = `${repository.owner}/${repository.name}`;
  title.append(link);

  const description = document.createElement("p");
  description.textContent = repository.description;

  const date = document.createElement("p");
  date.className = "starred-date";
  date.textContent = `Starred on ${new Date(`${repository.starredAt}T00:00:00`).toLocaleDateString()}`;

  item.append(title, description, date);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    repositoryList.replaceChildren(...repositories.map(renderRepository));
    statusMessage.textContent = repositories.length
      ? ""
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    statusMessage.textContent = "Could not load repositories. Please try again later.";
    statusMessage.classList.add("status--error");
  }
}

loadRepositories();
