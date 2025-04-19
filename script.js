// Get input from textarea
function getInputText() {
  const inputText = document.getElementById('inputText');
  const levelDropdown = document.getElementById('leveldropdown');
  
  if (!inputText || !levelDropdown) {
    console.error('Missing element');
    return { text: "", level: "" };
  }
  
  const text = inputText.value;
  const level = levelDropdown.value;
  
  console.log(text, level);
  return { text, level };
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
  const input = getInputText();
  if (!input.text || !input.level) {
    alert("Please provide input text and select a level.");
    return;
  }
  
  const text = input.text;
  const level = input.level;

  const prompt = `Provide a clear, informative, and ${level.toLowerCase()}-level summary of the following chapter:\n\n${text}`;
  const summary = await callOpenAI(prompt);
  renderOutput("summaryOutput", summary);
}

// Generate Questions
async function generateQuestions() {
  const { text, level } = getInputText();
  if (!text || !level) {
    alert("Please provide input text and select a level.");
    return;
  }
  
  const prompt = `
Based on the following content, create 5 theory questions with answers, 5 MCQs with answers, 5 fill in the blanks with answers, and 5 true/false questions with answers and format them in well mannered structure. The questions should be appropriate for a ${level.toLowerCase()}-level learner. Here’s the content:\n\n${text}`;
  
  const questions = await callOpenAI(prompt);
  renderOutput("questionsOutput", questions);
}

// Extract Key Notes
async function extractKeyNotes() {
  const { text, level } = getInputText();
  if (!text || !level) {
    alert("Please provide input text and select a level.");
    return;
  }
  
  const prompt = `Extract 10–15 informative bullet-point key notes from the following chapter. Make sure they match the understanding level of a ${level.toLowerCase()}-level student:\n\n${text}`;
  
  const keynotes = await callOpenAI(prompt);
  renderOutput("keynotesOutput", keynotes);
}

// Render output content
function renderOutput(sectionId, content) {
  const outputDiv = document.getElementById(sectionId);
  if (outputDiv) {
    outputDiv.innerHTML = `
      <div class="output-card">
        <pre>${content}</pre>
        <div class="output-buttons">
          <button onclick="copyText('${sectionId}')">Copy</button>
          <button onclick="saveAsPDF('${sectionId}')">Save as PDF</button>
        </div>
      </div>
    `;
  }
}

// Copy Text
function copyText(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied!");
  });
}

// Save Section as PDF
function saveAsPDF(id) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const content = document.getElementById(id).innerText;
  
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  const lineHeight = 10;

  const lines = doc.splitTextToSize(content, 180); // 180 = max width of text
  let y = margin;

  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  doc.save(`${id}.pdf`);
}
