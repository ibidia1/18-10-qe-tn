export function exportWeekToPdf(weekLabel: string, userName = "Sarah", daysUntil: number): void {
  const styleId = "qe-print-style";
  let style = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = `
    @media print {
      body * { visibility: hidden !important; }
      .qe-print-area, .qe-print-area * { visibility: visible !important; }
      .qe-print-area { position: fixed; top: 0; left: 0; width: 100%; }
      .qe-no-print { display: none !important; }
      @page { margin: 1.5cm; }
    }
    .print-header-bar {
      display: none;
    }
    @media print {
      .print-header-bar {
        display: block;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 8px;
        margin-bottom: 16px;
        font-family: sans-serif;
        font-size: 12px;
        color: #374151;
      }
    }
  `;

  // Inject print header
  const weekView = document.querySelector(".qe-print-area");
  if (weekView) {
    const existing = weekView.querySelector(".print-header-bar");
    if (!existing) {
      const header = document.createElement("div");
      header.className = "print-header-bar";
      header.innerHTML = `
        <strong>QE.tn — ${userName} — ${weekLabel}</strong>
        <span style="float:right">Imprimé le ${new Date().toLocaleDateString("fr-TN")} · J-${daysUntil} avant le résidanat</span>
      `;
      weekView.prepend(header);
    }
  }

  document.body.classList.add("print-mode");
  window.print();
  document.body.classList.remove("print-mode");
}
