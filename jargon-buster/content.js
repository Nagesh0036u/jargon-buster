chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showPopupCard") {
    const existingCard = document.getElementById("jargon-buster-card");
    if (existingCard) existingCard.remove();

    const card = document.createElement("div");
    card.id = "jargon-buster-card";
    card.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 999999;
      width: 350px; background: #0f172a; color: #ffffff; padding: 16px;
      border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      font-family: system-ui, sans-serif; border: 1px solid #334155;
    `;
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: bold; color: #818cf8; font-size: 14px;">⚡ JargonBuster Simplified</span>
        <button id="jb-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px;">&times;</button>
      </div>
      <p style="font-size: 13px; line-height: 1.5; color: #e2e8f0; margin: 0;">${request.explanation}</p>
    `;

    document.body.appendChild(card);

    document.getElementById("jb-close").addEventListener("click", () => {
      card.remove();
    });
  }
});