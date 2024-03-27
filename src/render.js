const { ipcRenderer } = require("electron");
const fs = require("fs");

const body = document.getElementsByTagName("body")[0];
const selectFolderButton = document.getElementById("selectFolderBtn");
const folderPathInput = document.getElementById("projectFolderInput");
selectFolderButton.addEventListener("click", async () => {
  const folderPath = await ipcRenderer.invoke("open-folder-dialog");
  if (folderPath) {
    folderPathInput.value = folderPath;
    showLanguageFilesList();
  }
});

function showLanguageFilesList() {
  const projectPath = `${folderPathInput.value}/src/assets/locale/`;
  fs.readdir(projectPath, function (err, files) {
    const list = document.createElement("ul");
    list.classList.add("language-files-list");
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const listElement = document.createElement("li");
      const elementPrefixBox = document.createElement("div");
      elementPrefixBox.innerHTML = element.split("-")[1].split("_")[0];
      const fileNameElement = document.createElement("p");
      fileNameElement.innerHTML = element;
      elementPrefixBox.style.backgroundColor = generateRandomColor();
      listElement.appendChild(elementPrefixBox);
      listElement.appendChild(fileNameElement);
      list.appendChild(listElement);
      listElement.addEventListener("click", () => {
        parseAndShowJsonFile(`${projectPath}/${element}`);
      });
    }
    body.appendChild(list);
  });
}

function parseAndShowJsonFile(filePath) {
  const languageFileContents = fs.readFile(filePath, (err, data) => {
    const languageList = document.querySelector(".language-files-list");
    languageList.remove();
    const treeWrapper = document.createElement("div");
    treeWrapper.classList.add("tree-wrapper");
    initCreateTree(treeWrapper, JSON.parse(data));
    body.appendChild(treeWrapper);
  });
}

function initCreateTree(container, obj) {
  createTree(container, obj);
}

function createTree(container, obj) {
  const ul = document.createElement("ul"); // Create a list for sub-objects
  container.appendChild(ul);

  for (let key in obj) {
    const keyValueDiv = document.createElement("div");

    const keySpan = document.createElement("span");
    keySpan.textContent = key + ": "; // Add a colon
    keyValueDiv.appendChild(keySpan);

    if (typeof obj[key] !== "object") {
      const valueSpan = document.createElement("span");
      valueSpan.textContent = obj[key];
      keyValueDiv.appendChild(valueSpan);
    } else {
      const li = document.createElement("li"); // List item for the subtree
      li.appendChild(keyValueDiv);
      ul.appendChild(li);
      createTree(li, obj[key]); // Recurse on the list item
    }

    ul.appendChild(keyValueDiv);
  }
}

function generateRandomColor() {
  // Generate random values for red, green, and blue components
  const red = Math.floor(Math.random() * 156) + 100; // Adjusted range for lighter colors
  const green = Math.floor(Math.random() * 156) + 100; // Adjusted range for lighter colors
  const blue = Math.floor(Math.random() * 156) + 100; // Adjusted range for lighter colors

  // Construct the color string in hexadecimal format
  const color =
    "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);

  return color;
}

// Helper function to convert a decimal color component to its hexadecimal representation
function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
