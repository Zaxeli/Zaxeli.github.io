async function insertPage(source, target) {
  const response = await fetch(source);
  const markup = await response.text();
  const page = new DOMParser().parseFromString(markup, "text/html");
  document.querySelector(target).replaceChildren(...page.body.childNodes);
}

function prioritizeExperience() {
  const sections = [...document.querySelectorAll("#content .container > div")];
  const combinedSection = sections.find((section) =>
    section.textContent.includes("Miscellaneous Projects:") &&
    section.textContent.includes("Experience:")
  );

  if (!combinedSection) return;

  const directChildren = [...combinedSection.children];
  const experienceHeading = directChildren.find((element) =>
    element.tagName === "B" && element.textContent.trim() === "Experience:"
  );
  const experienceList = experienceHeading?.nextElementSibling;
  const miscellaneousHeading = directChildren.find((element) =>
    element.textContent.trim() === "Miscellaneous Projects:"
  );
  const miscellaneousList = miscellaneousHeading?.nextElementSibling;

  if (!experienceHeading || !experienceList || !miscellaneousHeading || !miscellaneousList) return;

  combinedSection.classList.add("work-overview");
  experienceHeading.classList.add("experience-heading");
  experienceList.classList.add("experience-list");
  miscellaneousHeading.classList.add("miscellaneous-heading");
  miscellaneousList.classList.add("miscellaneous-list");

  combinedSection.insertBefore(experienceList, miscellaneousHeading);
  combinedSection.insertBefore(experienceHeading, experienceList);
}

function moveResumeToProfile() {
  const sections = [...document.querySelectorAll("#content .container > div")];
  const resumeSection = sections.find((section) =>
    section.querySelector("span > b")?.textContent.trim() === "Resume"
  );
  const profile = document.querySelector("#profile");

  if (!resumeSection || !profile) return;

  resumeSection.classList.add("profile-resume");
  profile.append(resumeSection);
}

function addSectionNavigation() {
  const content = document.querySelector("#content .container");
  const overview = document.querySelector(".work-overview");
  const miscellaneousHeading = document.querySelector(".miscellaneous-heading");
  const sectionLinks = [];

  if (!content || !overview) return;

  overview.id = "experience";
  sectionLinks.push(["Experience", "experience"]);

  if (miscellaneousHeading) {
    miscellaneousHeading.id = "miscellaneous-projects";
    sectionLinks.push(["Miscellaneous Projects", "miscellaneous-projects"]);
  }

  const namedSections = [
    ["Research:", "Research", "research"],
    ["CTFs:", "CTFs", "ctfs"],
    ["Projects:", "Projects", "projects"],
    ["Articles:", "Articles", "articles"],
    ["Activities:", "Activities", "activities"]
  ];

  for (const [heading, label, id] of namedSections) {
    const section = [...content.children].find((element) =>
      element.querySelector(":scope > b:first-child")?.textContent.trim() === heading
    );

    if (section) {
      section.id = id;
      sectionLinks.push([label, id]);
    }
  }

  const navigation = document.createElement("nav");
  navigation.className = "section-navigation";
  navigation.setAttribute("aria-label", "Page sections");

  const label = document.createElement("span");
  label.className = "section-navigation-label";
  label.textContent = "Explore";
  navigation.append(label);

  const links = document.createElement("div");
  links.className = "section-navigation-links";
  for (const [text, id] of sectionLinks) {
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = text;
    links.append(link);
  }
  navigation.append(links);

  content.insertBefore(navigation, overview);
}

Promise.all([
  insertPage("home_left.html", "#profile"),
  insertPage("home_right.html", "#content")
]).then(() => {
  prioritizeExperience();
  moveResumeToProfile();
  addSectionNavigation();
});
