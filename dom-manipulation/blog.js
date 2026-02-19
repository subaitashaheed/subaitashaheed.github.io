
function $(id){ return document.getElementById(id); }

function showFilter() {
  const filterForm = $("filterContent");
  const newForm = $("newContent");

  const willShow = (getComputedStyle(filterForm).display === "none");
  filterForm.style.display = willShow ? "block" : "none";

  if (willShow) newForm.style.display = "none";
}

function showAddNew() {
  const filterForm = $("filterContent");
  const newForm = $("newContent");

  const willShow = (getComputedStyle(newForm).display === "none");
  newForm.style.display = willShow ? "flex" : "none";

  if (willShow) filterForm.style.display = "none";
}

function filterArticles() {
  const showOpinion = $("opinionCheckbox").checked;
  const showRecipe  = $("recipeCheckbox").checked;
  const showUpdate  = $("updateCheckbox").checked;

  document.querySelectorAll("#articleList article").forEach(article => {
    const isOpinion = article.classList.contains("opinion");
    const isRecipe  = article.classList.contains("recipe");
    const isUpdate  = article.classList.contains("update");

    let shouldShow = true;
    if (isOpinion && !showOpinion) shouldShow = false;
    if (isRecipe  && !showRecipe)  shouldShow = false;
    if (isUpdate  && !showUpdate)  shouldShow = false;

    article.style.display = shouldShow ? "" : "none";
  });
}

function getSelectedType() {
  const selected = document.querySelector('input[name="articleType"]:checked');
  if (!selected) return null;

  
  if (selected.id === "opinionRadio") return "opinion";
  if (selected.id === "recipeRadio") return "recipe";
  if (selected.id === "lifeRadio") return "update";
  return null;
}

function addNewArticle() {
  const title = $("inputHeader").value.trim();
  const text  = $("inputArticle").value.trim();
  const type  = getSelectedType(); 

  if (!title || !text || !type) {
    alert("Please enter a Title, choose a Type, and enter Text.");
    return;
  }

  
  const existingNums = Array.from(document.querySelectorAll("#articleList article[id^='a']"))
    .map(a => parseInt((a.id || "").slice(1), 10))
    .filter(n => !Number.isNaN(n));
  const nextNum = (existingNums.length ? Math.max(...existingNums) : 0) + 1;

  
  const article = document.createElement("article");
  article.className = type;
  article.id = "a" + nextNum;

  const marker = document.createElement("span");
  marker.className = "marker";
  marker.textContent = (type === "opinion") ? "Opinion" : (type === "recipe") ? "Recipe" : "Update";

  const h2 = document.createElement("h2");
  h2.textContent = title;

  const pText = document.createElement("p");
  pText.textContent = text;

  const pLink = document.createElement("p");
  const a = document.createElement("a");
  a.href = "moreDetails.html";
  a.textContent = "Read more...";
  pLink.appendChild(a);

  article.appendChild(marker);
  article.appendChild(h2);
  article.appendChild(pText);
  article.appendChild(pLink);

  $("articleList").appendChild(article);

 
  $("inputHeader").value = "";
  $("inputArticle").value = "";
  document.querySelectorAll('input[name="articleType"]').forEach(r => r.checked = false);

  
  filterArticles();
}

document.addEventListener("DOMContentLoaded", () => {
  
  $("filterContent").style.display = "none";
  $("newContent").style.display = "none";

  filterArticles();
});
