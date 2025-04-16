const OPENAI_API_KEY = ""; // Keep your OpenAI API key as needed


async function callOpenAI(promptText) {
  const response = await fetch("/.netlify/functions/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: promptText }),
  });

  const data = await response.json();
  return data.result;
}


async function generateSummary() {
  const input = document.getElementById("inputText").value;
  const prompt = `Summarize the following chapter in a concise manner, explaining what it teaches the reader and highlighting the key moral or life lessons:\n\n${input}`;
  const result = await callOpenAI(prompt);
  document.getElementById("summary").innerHTML = `<h2>Summary</h2><p>${result}</p>`;
}

async function generateQuestions() {
  const input = document.getElementById("inputText").value;
  const prompt = `From the following chapter, generate:
- 5 Theory-Based Questions with answers
- 5 True or False Questions with answers
- 5 Multiple Choice Questions (MCQs) with options and answers

Chapter Content:\n\n${input}`;
  const result = await callOpenAI(prompt);
  document.getElementById("questions").innerHTML = `<h2>Questions</h2><p>${result.replace(/\n/g, "<br>")}</p>`;
}

async function extractKeyNotes() {
  const input = document.getElementById("inputText").value;
  const prompt = `Extract the key points and important takeaways from the following chapter in well-structured bullet points:\n\n${input}`;
  const result = await callOpenAI(prompt);
  document.getElementById("keynotes").innerHTML = `<h2>Key Notes</h2><p>${result.replace(/\n/g, "<br>")}</p>`;
}

document.getElementById('copyBtn').addEventListener('click', function() {
  const content = document.getElementById("content").innerText;
  navigator.clipboard.writeText(content)
    .then(() => alert('Content copied to clipboard!'))
    .catch(err => alert('Failed to copy content: ' + err));
});

document.getElementById('printBtn').addEventListener('click', function() {
  const content = document.getElementById("content").innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Print</title></head><body>');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
});

document.getElementById('saveBtn').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const content = document.getElementById("content").innerText;
  doc.text(content, 10, 10);
  doc.save('content.pdf');
});
