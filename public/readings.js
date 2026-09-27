/* Readings page: keeps the "Names & Numbers" notes on this device only.
   localStorage never leaves the browser; wrapped in try/catch because private
   browsing or blocked storage can throw, and the page must still work. */
(function () {
  const box = document.getElementById("names");
  const status = document.getElementById("namesStatus");
  if (!box) return;
  const KEY = "aa.namesNumbers";

  // Load any saved notes
  try { box.value = localStorage.getItem(KEY) || ""; }
  catch (e) { status.textContent = "This browser won't save notes (private mode?)."; return; }

  // Save shortly after typing stops, so we don't write on every keystroke
  let timer = null;
  box.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { localStorage.setItem(KEY, box.value); status.textContent = "Saved on this phone."; }
      catch (e) { status.textContent = "Couldn't save on this browser."; }
    }, 400);
  });
})();
