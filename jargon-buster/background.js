// Create right-click context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "simplifyText",
    title: "Simplify with JargonBuster",
    contexts: ["selection"]
  });
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "simplifyText" && info.selectionText) {
    const simplifiedText = await getAIGlossary(info.selectionText);
    
    // Safely send message to content script and catch connection errors
    chrome.tabs.sendMessage(tab.id, {
      action: "showPopupCard",
      original: info.selectionText,
      explanation: simplifiedText
    }).catch((err) => {
      console.log("Could not inject into this page:", err);
    });
  }
});

// AI API Call Function
async function getAIGlossary(text) {
  const apiKey = "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"; // Make sure to replace this with your actual OpenAI API key
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You translate complex legal, medical, or technical text into simple, easy-to-understand everyday language under 3 sentences." },
          { role: "user", content: text }
        ]
      })
    });
    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      return "Error: Unexpected response from OpenAI. Check your API quota or key.";
    }
  } catch (error) {
    return "Error connecting to AI service. Please check your API key.";
  }
}