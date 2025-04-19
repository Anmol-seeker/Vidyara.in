// Renders output content
function renderOutput(sectionId, content) {
  const outputDiv = document.getElementById(sectionId);
  if (outputDiv) {
    outputDiv.innerHTML = `
      <div class="output-card">
        <pre>${content}</pre>
        <div class="output-buttons">
          <button onclick="copyToClipboard('${sectionId}')">Copy</button>
          <button onclick="saveAsPDF('${sectionId}')">Save as PDF</button>
        </div>
      </div>
    `;
  }
}

// Get input from textarea
function getInputText() {
  return document.getElementById("inputText").value;
}

// Call OpenAI via Netlify Function or your backend
async function callOpenAI(prompt) {
  try {
    const response = await fetch("/.netlify/functions/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (!data.text) throw new Error("No text received from server");
    return data.text;
  } catch (error) {
    console.error("Fetch failed:", error);
    return "❌ An error occurred while fetching AI output.";
  }
}

// Generate Summary
async function generateSummary() {
  const text = getInputText();
  const prompt = `Provide a clear, informative, and easy-to-understand summary of the following chapter:\n\n${text}`;
  const summary = await callOpenAI(prompt);
  renderOutput("summaryOutput", summary);
}

// Generate Questions
async function generateQuestions() {
  const text = getInputText();
  const prompt = `Based on the following content, create 5 theory questions, 5 MCQs, 5 fill in the blanks, and 5 true/false questions with answers. Here’s the content:\n\n${text}`;
  const questions = await callOpenAI(prompt);
  renderOutput("questionsOutput", questions);
}

// Extract Key Notes
async function extractKeyNotes() {
  const text = getInputText();
  const prompt = `Extract 10–15 informative bullet-point key notes from the following chapter:\n\n${text}`;
  const keynotes = await callOpenAI(prompt);
  renderOutput("keynotesOutput", keynotes);
}

// Copy to Clipboard
function copyToClipboard(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied!");
  });
}

// Save Section as PDF
function saveAsPDF(id) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const text = document.getElementById(id).innerText;
  const lines = doc.splitTextToSize(text, 180); // Wrap text
  doc.text(lines, 10, 10);
  doc.save(`${id}.pdf`);
}
