// Extract paragraphs and structured Wikipedia tables
const paragraphs = Array.from(document.querySelectorAll("p")).map(p => p.textContent);
const tables = Array.from(document.querySelectorAll(".wikitable")).map(table => table.outerHTML);
console.log("Extracted paragraphs:", paragraphs);
console.log("Extracted tables:", tables);
