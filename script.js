document.getElementById('calculate').addEventListener('click', () => {
  const params = {
    pH: { value: parseFloat(document.getElementById('ph').value), ideal: 7, range: 1.5 },
    TDS: { value: parseFloat(document.getElementById('tds').value), ideal: 500, range: 500 },
    TSS: { value: parseFloat(document.getElementById('tss').value), ideal: 100, range: 100 },
    BOD: { value: parseFloat(document.getElementById('bod').value), ideal: 3, range: 2 },
    Fluoride: { value: parseFloat(document.getElementById('fluoride').value), ideal: 1, range: 0.5 },
    Nitrate: { value: parseFloat(document.getElementById('nitrate').value), ideal: 45, range: 15 },
    Chloride: { value: parseFloat(document.getElementById('chloride').value), ideal: 250, range: 250 },
    TotalAlkalinity: { value: parseFloat(document.getElementById('totalalkalinity').value), ideal: 200, range: 200 },
    TotalHardness: { value: parseFloat(document.getElementById('totalhardness').value), ideal: 300, range: 300 }
  };

  let totalWeight = 0;
  let weightedSum = 0;

  for (let key in params) {
    const param = params[key];
    if (!isNaN(param.value)) {
      const q = 100 - (Math.abs(param.value - param.ideal) * 100 / param.range);
      const w = 1; // Equal weight
      weightedSum += q * w;
      totalWeight += w;
    }
  }

  const wqi = (weightedSum / totalWeight).toFixed(2);
  let status = "";

  if (wqi >= 95) status = "Excellent";
  else if (wqi >= 80) status = "Good";
  else if (wqi >= 60) status = "Poor";
  else status = "Very Poor";

  document.getElementById('wqi-box').innerText = wqi;
  document.getElementById('status-box').innerText = status;
});

document.getElementById('exportPdf').addEventListener('click', () => {
  const doc = new jsPDF();
  const station = document.getElementById('station').value;
  const substation = document.getElementById('substation').value;

  doc.setFontSize(16);
  doc.text("Water Quality Index Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Station: ${station}`, 20, 30);
  doc.text(`Sub-Station: ${substation}`, 20, 40);

  const fields = [
    { label: "pH", id: "ph" },
    { label: "TDS", id: "tds" },
    { label: "TSS", id: "tss" },
    { label: "BOD", id: "bod" },
    { label: "Fluoride", id: "fluoride" },
    { label: "Nitrate", id: "nitrate" },
    { label: "Chloride", id: "chloride" },
    { label: "Total Alkalinity", id: "totalalkalinity" },
    { label: "Total Hardness", id: "totalhardness" }
  ];

  fields.forEach((field, i) => {
    const val = document.getElementById(field.id).value;
    doc.text(`${field.label}: ${val}`, 20, 60 + (i * 10));
  });

  const wqi = document.getElementById('wqi-box').innerText;
  const status = document.getElementById('status-box').innerText;

  doc.text(`WQI: ${wqi}`, 20, 170);
  doc.text(`Status: ${status}`, 20, 180);

  doc.save(`${station || "Station"}_WQI_Report.pdf`);
});
