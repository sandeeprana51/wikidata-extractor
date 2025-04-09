document.getElementById("extract").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const data = {
          title: document.title,
          paragraphs: Array.from(document.querySelectorAll("p")).map(p => p.textContent),
          tables: Array.from(document.querySelectorAll(".wikitable")).map(t => t.outerHTML)
        };
        return data;
      }
    }, (injectionResults) => {
      const result = injectionResults[0].result;
      window.extractedData = result;
      document.getElementById("output").textContent = JSON.stringify(result, null, 2);
      document.getElementById("tablePreview").innerHTML = result.tables.join("<hr/>");
    });
  });
});

document.getElementById("download").addEventListener("click", () => {
  if (!window.extractedData) return alert("Please extract data first.");
  const format = document.getElementById("format").value;
  let content = "", blobType = "";

  if (format === "text") {
    content = `Title: ${window.extractedData.title}\n\n${window.extractedData.paragraphs.join("\n\n")}`;
    blobType = "text/plain";
  } else if (format === "html") {
    content = `<h1>${window.extractedData.title}</h1>` +
              window.extractedData.paragraphs.map(p => `<p>${p}</p>`).join("") +
              window.extractedData.tables.join("<hr/>");
    blobType = "text/html";
  }

  const blob = new Blob([content], { type: blobType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `WikipediaExtract.${format === "html" ? "html" : "txt"}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
