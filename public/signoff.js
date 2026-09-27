/* ==========================================================================
   Meeting sign-off: collects meeting name, contact ID, location and a finger
   signature, builds a PDF on the device (jsPDF), then hands it to the phone's
   share sheet (so it can go straight into Mail) or downloads it.
   Nothing is sent to the server.
   ========================================================================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const statusEl = $("status");
  const setStatus = (msg, kind) => { statusEl.textContent = msg; statusEl.className = kind || ""; };
  let coords = null;   // GPS fix, kept only if the location box wasn't edited by hand

  // ---------- Location ----------
  $("getLoc").addEventListener("click", () => {
    if (!navigator.geolocation) { $("locHint").textContent = "This browser can't read GPS. Type the location instead."; return; }
    $("getLoc").disabled = true; $("locHint").textContent = "Finding you…";
    navigator.geolocation.getCurrentPosition((pos) => {
      coords = pos.coords;
      $("loc").value = pos.coords.latitude.toFixed(6) + ", " + pos.coords.longitude.toFixed(6);
      $("locHint").textContent = "Accurate to about " + Math.round(pos.coords.accuracy) + " m.";
      $("getLoc").disabled = false;
    }, (err) => {
      const why = err.code === 1 ? "Location permission was denied." : "Couldn't get a GPS fix.";
      $("locHint").textContent = why + " Type the location instead.";
      $("getLoc").disabled = false;
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  });
  // Typing over the GPS value means the coordinates no longer apply
  $("loc").addEventListener("input", () => { coords = null; });

  // ---------- Signature pad ----------
  const canvas = $("sig"), ctx = canvas.getContext("2d");
  let drawing = false, hasInk = false, last = null;

  // Match the canvas bitmap to its on-screen size (sharp on high-DPI phones),
  // redrawing any existing signature after a rotate/resize.
  function sizeCanvas() {
    const snapshot = hasInk ? canvas.toDataURL() : null;
    const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#0B2A6F"; ctx.lineWidth = 2.4;
    if (snapshot) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height); img.src = snapshot; }
  }
  const pt = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  // Pointer events cover finger, stylus and mouse
  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault(); canvas.setPointerCapture(e.pointerId);
    drawing = true; last = pt(e);
    ctx.beginPath(); ctx.arc(last.x, last.y, ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fillStyle = ctx.strokeStyle; ctx.fill();
    hasInk = true;
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return; e.preventDefault();
    const p = pt(e);
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p;
  });
  const stop = () => { drawing = false; last = null; };
  canvas.addEventListener("pointerup", stop); canvas.addEventListener("pointercancel", stop);
  $("clearSig").addEventListener("click", () => { ctx.clearRect(0, 0, canvas.width, canvas.height); hasInk = false; });
  window.addEventListener("resize", sizeCanvas);
  sizeCanvas();

  // ---------- Deliver the PDF ----------
  async function deliver(blob, filename, title) {
    // 1) Phone share sheet with the PDF attached (pick Mail, Messages, Drive…)
    const file = new File([blob], filename, { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title }); return "Sent to the share sheet."; }
      catch (e) { if (e && e.name === "AbortError") return "Share cancelled."; }
    }
    // 2) Fallback: plain download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return "PDF downloaded. Attach it to an email.";
  }

  // ---------- Build the PDF ----------
  $("makePdf").addEventListener("click", async () => {
    const meeting = $("meeting").value.trim(), contact = $("contact").value.trim(), loc = $("loc").value.trim();

    // Validate everything at once so the user sees one clear message
    const missing = [];
    if (!meeting) missing.push("meeting name"); if (!contact) missing.push("contact ID");
    if (!loc) missing.push("location"); if (!hasInk) missing.push("signature");
    if (missing.length) { setStatus("Add the " + missing.join(", ") + " first.", "err"); return; }
    if (!window.jspdf) { setStatus("The PDF tool didn't load. Check your connection and reload.", "err"); return; }

    $("makePdf").disabled = true; setStatus("Building PDF…");
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "mm", format: "letter" });
      const now = new Date();
      const stamp = now.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

      // Header band
      doc.setFillColor(31, 78, 121); doc.rect(0, 0, 216, 26, "F");
      doc.setFillColor(242, 194, 0); doc.rect(0, 26, 216, 2, "F");
      doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(18);
      doc.text("Meeting sign-off", 18, 17);

      // Label/value rows, wrapping long values
      let y = 44;
      const row = (label, value) => {
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(90, 107, 119); doc.text(label, 18, y);
        doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(23, 37, 47);
        const lines = doc.splitTextToSize(value, 175); doc.text(lines, 18, y + 7);
        y += 10 + lines.length * 6;
      };
      row("Meeting name", meeting);
      row("Contact ID", contact);
      row("Location", loc + (coords ? "  (±" + Math.round(coords.accuracy) + " m)" : ""));
      if (coords) row("Map link", "https://maps.google.com/?q=" + coords.latitude.toFixed(6) + "," + coords.longitude.toFixed(6));
      row("Signed", stamp);

      // Signature: flatten onto white so it prints cleanly
      const flat = document.createElement("canvas"); flat.width = canvas.width; flat.height = canvas.height;
      const fctx = flat.getContext("2d"); fctx.fillStyle = "#fff"; fctx.fillRect(0, 0, flat.width, flat.height); fctx.drawImage(canvas, 0, 0);
      const sigW = 120, sigH = sigW * (flat.height / flat.width);
      y += 4;
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(90, 107, 119); doc.text("Signature", 18, y);
      doc.addImage(flat.toDataURL("image/png"), "PNG", 18, y + 3, sigW, sigH);
      doc.setDrawColor(195, 205, 212); doc.rect(18, y + 3, sigW, sigH);

      // Safe, readable filename: Signoff_<meeting>_<id>_<date>.pdf
      const safe = (s) => s.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").slice(0, 40) || "meeting";
      const filename = "Signoff_" + safe(meeting) + "_" + safe(contact) + "_" + now.toISOString().slice(0, 10) + ".pdf";
      setStatus(await deliver(doc.output("blob"), filename, "Meeting sign-off – " + meeting), "ok");
    } catch (e) {
      setStatus("Couldn't build the PDF: " + (e && e.message ? e.message : e), "err");
    } finally {
      $("makePdf").disabled = false;
    }
  });
})();
