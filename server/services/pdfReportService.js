import PDFDocument from 'pdfkit';

/**
 * Generate a complete Birth Chart PDF report as a stream
 */
export function generateBirthChartPDF(chartDoc, res) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    bufferPages: true,
    info: {
      Title: `Natal Birth Chart - ${chartDoc.firstName} ${chartDoc.lastName}`,
      Author: 'Mavi-AstroVision',
      Subject: 'Astrological Natal Analysis',
    },
  });

  // Pipe to response
  doc.pipe(res);

  const chartData = chartDoc.chartData || {};
  const bigThree = chartData.bigThree || {};
  const interpretations = chartData.interpretations || {};
  const planets = chartData.planets || [];
  const houses = chartData.houses || [];

  // Colors
  const goldColor = '#C5A059';
  const darkColor = '#0E0826';
  const mutedText = '#6B7280';
  const bodyText = '#1F2937';

  // --- PAGE 1: TITLE & BIG THREE ---
  // Header Banner
  doc
    .rect(0, 0, doc.page.width, 100)
    .fill(darkColor);

  doc
    .fillColor(goldColor)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('MAVI-ASTROVISION • CELESTIAL ANALYSIS DOSSIER', 40, 25, { letterSpacing: 2 });

  doc
    .fillColor('#FFFFFF')
    .fontSize(22)
    .font('Helvetica-Bold')
    .text(`NATAL BIRTH CHART: ${chartDoc.firstName.toUpperCase()} ${chartDoc.lastName.toUpperCase()}`, 40, 45);

  doc
    .fillColor(goldColor)
    .fontSize(10)
    .font('Helvetica')
    .text(`Calculated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`, 40, 75);

  doc.y = 120;

  // Birth Details Summary
  doc
    .fillColor(goldColor)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('NATAL PARAMETERS', 40, doc.y);

  doc
    .strokeColor(goldColor)
    .lineWidth(1)
    .moveTo(40, doc.y + 4)
    .lineTo(doc.page.width - 40, doc.y + 4)
    .stroke();

  doc.y += 12;

  const birthDateStr = new Date(chartDoc.dateOfBirth).toLocaleDateString('en-US', { dateStyle: 'medium' });
  doc
    .fillColor(bodyText)
    .fontSize(10)
    .font('Helvetica')
    .text(`• Date of Birth: ${birthDateStr} at ${chartDoc.timeOfBirth || '12:00'}`, 40, doc.y)
    .text(`• Birthplace: ${chartDoc.placeOfBirth || 'Unknown'} (Lat: ${chartDoc.latitude || 0}, Lon: ${chartDoc.longitude || 0})`, 40, doc.y + 14);

  doc.y += 35;

  // The Big Three Highlight Box
  doc
    .roundedRect(40, doc.y, doc.page.width - 80, 80, 8)
    .fillAndStroke('#F9FAFB', '#E5E7EB');

  const bigThreeY = doc.y + 15;

  // Sun
  doc
    .fillColor(goldColor)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('SUN SIGN (ESSENCE)', 60, bigThreeY);
  doc
    .fillColor(darkColor)
    .fontSize(14)
    .text(bigThree.sun?.sign || 'Unknown', 60, bigThreeY + 14);
  doc
    .fillColor(mutedText)
    .fontSize(9)
    .font('Helvetica')
    .text(bigThree.sun?.formatted || '', 60, bigThreeY + 32);

  // Moon
  doc
    .fillColor(goldColor)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('MOON SIGN (EMOTIONS)', 220, bigThreeY);
  doc
    .fillColor(darkColor)
    .fontSize(14)
    .text(bigThree.moon?.sign || 'Unknown', 220, bigThreeY + 14);
  doc
    .fillColor(mutedText)
    .fontSize(9)
    .font('Helvetica')
    .text(bigThree.moon?.formatted || '', 220, bigThreeY + 32);

  // Ascendant
  doc
    .fillColor(goldColor)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('RISING SIGN (PERSONA)', 380, bigThreeY);
  doc
    .fillColor(darkColor)
    .fontSize(14)
    .text(bigThree.ascendant?.sign || 'Unknown', 380, bigThreeY + 14);
  doc
    .fillColor(mutedText)
    .fontSize(9)
    .font('Helvetica')
    .text(bigThree.ascendant?.formatted || '', 380, bigThreeY + 32);

  doc.y += 100;

  // Planetary Positions Table
  doc
    .fillColor(goldColor)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('CELESTIAL POSITIONS (EPHEMERIS)', 40, doc.y);

  doc
    .strokeColor(goldColor)
    .lineWidth(1)
    .moveTo(40, doc.y + 4)
    .lineTo(doc.page.width - 40, doc.y + 4)
    .stroke();

  doc.y += 14;

  // Table Headers
  const tableTop = doc.y;
  doc
    .fillColor(darkColor)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('PLANET', 40, tableTop)
    .text('ZODIAC SIGN', 140, tableTop)
    .text('POSITION', 240, tableTop)
    .text('HOUSE', 340, tableTop)
    .text('ELEMENT / MODALITY', 410, tableTop);

  doc
    .strokeColor('#D1D5DB')
    .lineWidth(0.5)
    .moveTo(40, tableTop + 14)
    .lineTo(doc.page.width - 40, tableTop + 14)
    .stroke();

  let currentY = tableTop + 20;

  planets.forEach((p, idx) => {
    doc
      .fillColor(bodyText)
      .fontSize(9)
      .font('Helvetica')
      .text(p.name + (p.retrograde ? ' (Rx)' : ''), 40, currentY)
      .text(p.sign, 140, currentY)
      .text(p.formatted, 240, currentY)
      .text(`House ${p.house}`, 340, currentY)
      .text(`${p.element} / ${p.modality}`, 410, currentY);

    currentY += 16;
  });

  // --- PAGE 2: DETAILED INTERPRETATION ---
  doc.addPage();

  // Page 2 Header
  doc
    .rect(0, 0, doc.page.width, 50)
    .fill(darkColor);

  doc
    .fillColor(goldColor)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('COSMIC SYNTHESIS & PSYCHOLOGICAL BLUEPRINT', 40, 20, { letterSpacing: 1 });

  doc.y = 70;

  // Soul Synthesis Narrative
  if (interpretations.overview?.bigThreeSynthesis) {
    doc
      .fillColor(goldColor)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('THE CORE TRIAD SYNTHESIS', 40, doc.y);

    doc.y += 8;

    doc
      .fillColor(bodyText)
      .fontSize(10)
      .font('Helvetica')
      .text(interpretations.overview.bigThreeSynthesis, 40, doc.y, {
        width: doc.page.width - 80,
        lineGap: 4,
        align: 'justify',
      });

    doc.y += 20;
  }

  // Chart Ruler
  if (interpretations.overview?.chartRulerInsight) {
    doc
      .fillColor(goldColor)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('SOVEREIGN CHART RULER', 40, doc.y);

    doc.y += 6;

    doc
      .fillColor(bodyText)
      .fontSize(9.5)
      .font('Helvetica')
      .text(interpretations.overview.chartRulerInsight, 40, doc.y, {
        width: doc.page.width - 80,
        lineGap: 3,
      });

    doc.y += 20;
  }

  // Key Placements Insights
  if (interpretations.planets && interpretations.planets.length > 0) {
    doc
      .fillColor(goldColor)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('KEY PLANETARY INFLUENCES', 40, doc.y);

    doc
      .strokeColor(goldColor)
      .lineWidth(1)
      .moveTo(40, doc.y + 4)
      .lineTo(doc.page.width - 40, doc.y + 4)
      .stroke();

    doc.y += 12;

    interpretations.planets.slice(0, 4).forEach((item) => {
      doc
        .fillColor(darkColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`${item.planet} in ${item.sign} (${item.houseName})`, 40, doc.y);

      doc.y += 4;

      doc
        .fillColor(bodyText)
        .fontSize(9)
        .font('Helvetica')
        .text(item.summary, 40, doc.y, {
          width: doc.page.width - 80,
          lineGap: 2,
        });

      doc.y += 14;
    });
  }

  // Footer on both pages
  try {
    const range = doc.bufferedPageRange();
    const totalPages = range ? range.count : 2;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc
        .fillColor(mutedText)
        .fontSize(8)
        .font('Helvetica')
        .text(
          `Mavi-AstroVision Natal Report • Page ${i + 1} of ${totalPages} • Certified Ephemeris Output`,
          40,
          doc.page.height - 25,
          { align: 'center', width: doc.page.width - 80 }
        );
    }
  } catch (e) {
    console.warn('PDF footer pagination notice:', e.message);
  }

  doc.end();
}

/**
 * Generate Synastry Compatibility PDF report as a stream
 */
export function generateSynastryPDF(synastryData, res) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    bufferPages: true,
    info: {
      Title: `Synastry Report - ${synastryData.names.personA} & ${synastryData.names.personB}`,
      Author: 'Mavi-AstroVision',
      Subject: 'Astrological Compatibility Analysis',
    },
  });

  doc.pipe(res);

  const goldColor = '#C5A059';
  const darkColor = '#0E0826';
  const bodyText = '#1F2937';

  // Header Banner
  doc
    .rect(0, 0, doc.page.width, 100)
    .fill(darkColor);

  doc
    .fillColor(goldColor)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('MAVI-ASTROVISION • SYNASTRY COMPATIBILITY DOSSIER', 40, 25, { letterSpacing: 2 });

  doc
    .fillColor('#FFFFFF')
    .fontSize(22)
    .font('Helvetica-Bold')
    .text(`${synastryData.names.personA.toUpperCase()} & ${synastryData.names.personB.toUpperCase()}`, 40, 45);

  doc
    .fillColor(goldColor)
    .fontSize(10)
    .font('Helvetica')
    .text(`Relationship Archetype: ${synastryData.archetype}`, 40, 75);

  doc.y = 125;

  // Overall Score Banner
  doc
    .roundedRect(40, doc.y, doc.page.width - 80, 75, 8)
    .fillAndStroke('#F9FAFB', '#E5E7EB');

  doc
    .fillColor(goldColor)
    .fontSize(28)
    .font('Helvetica-Bold')
    .text(`${synastryData.scores.overall}%`, 60, doc.y + 15);

  doc
    .fillColor(darkColor)
    .fontSize(11)
    .text('OVERALL CELESTIAL HARMONY', 140, doc.y + 18);

  doc
    .fillColor(bodyText)
    .fontSize(9)
    .font('Helvetica')
    .text('Synthesized across Emotional, Romance, Intellectual, and Long-Term astrological bonds.', 140, doc.y + 36);

  doc.y += 95;

  // Domains Breakdown
  doc
    .fillColor(goldColor)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('DOMAIN HARMONY BREAKDOWN', 40, doc.y);

  doc.y += 12;

  const domains = [
    { label: 'Emotional Rapport', score: synastryData.scores.emotional },
    { label: 'Chemistry & Spark', score: synastryData.scores.chemistry },
    { label: 'Intellectual Dialogue', score: synastryData.scores.communication },
    { label: 'Long-Term Stability', score: synastryData.scores.stability },
    { label: 'Shared Soul Growth', score: synastryData.scores.growth },
  ];

  domains.forEach((d) => {
    doc
      .fillColor(bodyText)
      .fontSize(9.5)
      .font('Helvetica-Bold')
      .text(d.label, 40, doc.y)
      .text(`${d.score}%`, 200, doc.y);

    // Progress bar line
    doc
      .rect(250, doc.y + 2, 250, 6)
      .fill('#E5E7EB');
    doc
      .rect(250, doc.y + 2, 2.5 * d.score, 6)
      .fill(goldColor);

    doc.y += 18;
  });

  doc.y += 20;

  // Summary Narrative
  doc
    .fillColor(goldColor)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('COSMIC UNION SYNTHESIS', 40, doc.y);

  doc.y += 8;

  doc
    .fillColor(bodyText)
    .fontSize(9.5)
    .font('Helvetica')
    .text(synastryData.summary, 40, doc.y, {
      width: doc.page.width - 80,
      lineGap: 3,
    });

  doc.y += 25;

  // Strengths & Growth
  doc
    .fillColor('#059669')
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('UNION STRENGTHS & BLESSINGS', 40, doc.y);

  doc.y += 8;

  synastryData.strengths.forEach((s) => {
    doc
      .fillColor(bodyText)
      .fontSize(9)
      .font('Helvetica')
      .text(`✓ ${s}`, 40, doc.y, { width: doc.page.width - 80 });
    doc.y += 14;
  });

  doc.y += 15;

  doc
    .fillColor('#D97706')
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('CONSCIOUS SOUL LESSONS', 40, doc.y);

  doc.y += 8;

  synastryData.growthEdges.forEach((g) => {
    doc
      .fillColor(bodyText)
      .fontSize(9)
      .font('Helvetica')
      .text(`• ${g}`, 40, doc.y, { width: doc.page.width - 80 });
    doc.y += 14;
  });

  doc.end();
}

/**
 * Generate Cosmic Life Map PDF report (Phase 18 Signature Output)
 */
export function generateCosmicLifeMapPDF(lifeMap, res) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    bufferPages: true,
    info: {
      Title: `Cosmic Life Map - ${lifeMap.user?.name || 'Seeker'}`,
      Author: 'Mavi-AstroVision',
      Subject: 'Signature Cosmic Life Map Dossier',
    },
  });

  if (res) {
    doc.pipe(res);
  }

  const goldColor = '#C5A059';
  const darkColor = '#0E0826';
  const mutedText = '#6B7280';
  const bodyText = '#1F2937';
  const subtextColor = '#9CA3AF';

  // --- PAGE 1: HEADER, PROFILE & COSMIC SCORECARD ---
  // Header Banner
  doc.rect(0, 0, doc.page.width, 95).fill(darkColor);

  doc
    .fillColor(goldColor)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('MAVI-ASTROVISION • SIGNATURE CELESTIAL DOSSIER', 40, 22, { letterSpacing: 2 });

  doc
    .fillColor('#FFFFFF')
    .fontSize(22)
    .font('Helvetica-Bold')
    .text(`YOUR COSMIC LIFE MAP™`, 40, 42);

  doc
    .fillColor(goldColor)
    .fontSize(9.5)
    .font('Helvetica')
    .text(`An astrology-based view of personal patterns, strengths & life exploration`, 40, 70);

  doc.y = 115;

  // Personal Profile Box
  doc
    .roundedRect(40, doc.y, doc.page.width - 80, 55, 6)
    .fillAndStroke('#F9FAFB', '#E5E7EB');

  const profileY = doc.y + 12;
  doc
    .fillColor(goldColor)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('PERSONAL PROFILE', 55, profileY);

  const birthDateStr = lifeMap.user?.dateOfBirth ? new Date(lifeMap.user.dateOfBirth).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'Unknown';
  doc
    .fillColor(bodyText)
    .fontSize(9)
    .font('Helvetica')
    .text(`• Seeker: ${lifeMap.user?.name || 'Cosmic Traveler'}`, 55, profileY + 16)
    .text(`• Birth: ${birthDateStr} at ${lifeMap.user?.timeOfBirth || '12:00'}`, 240, profileY + 16)
    .text(`• Location: ${lifeMap.user?.placeOfBirth || 'Calculated Coordinates'}`, 410, profileY + 16);

  doc.y += 75;

  // Core Placements (Big Three + Chart Ruler)
  doc
    .fillColor(goldColor)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('CORE CELESTIAL PLACEMENTS', 40, doc.y);

  doc.strokeColor(goldColor).lineWidth(1).moveTo(40, doc.y + 4).lineTo(doc.page.width - 40, doc.y + 4).stroke();
  doc.y += 12;

  const bigThree = lifeMap.bigThree || {};
  const chartRuler = lifeMap.chartRuler || {};

  const colWidth = (doc.page.width - 80 - 30) / 4;
  const placements = [
    { label: 'SUN SIGN', value: bigThree.sun?.sign || 'Aries', desc: 'Core Essence & Life Force' },
    { label: 'MOON SIGN', value: bigThree.moon?.sign || 'Cancer', desc: 'Emotional Soul & Instinct' },
    { label: 'RISING SIGN', value: bigThree.ascendant?.sign || 'Libra', desc: 'Outer Persona & Horizon' },
    { label: 'CHART RULER', value: chartRuler.planet || 'Venus', desc: chartRuler.placement || '1st House' },
  ];

  placements.forEach((p, idx) => {
    const x = 40 + idx * (colWidth + 10);
    doc.roundedRect(x, doc.y, colWidth, 54, 6).fillAndStroke('#F9FAFB', '#E5E7EB');
    doc.fillColor(goldColor).fontSize(8).font('Helvetica-Bold').text(p.label, x + 10, doc.y + 10);
    doc.fillColor(darkColor).fontSize(13).font('Helvetica-Bold').text(p.value, x + 10, doc.y + 22);
    doc.fillColor(mutedText).fontSize(7.5).font('Helvetica').text(p.desc, x + 10, doc.y + 38);
  });

  doc.y += 70;

  // Cosmic Scorecard Section
  doc
    .fillColor(goldColor)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('COSMIC SCORECARD (HARMONIC ACTIVATION)', 40, doc.y);

  doc
    .fillColor(mutedText)
    .fontSize(8)
    .font('Helvetica-Oblique')
    .text('Interpretive visualization based on planetary distribution and elemental balances. Not scientific measurement.', 40, doc.y + 14);

  doc.y += 28;

  const scorecard = lifeMap.scorecard || [];
  scorecard.forEach((item) => {
    doc
      .fillColor(bodyText)
      .fontSize(9)
      .font('Helvetica-Bold')
      .text(item.dimension, 40, doc.y)
      .fillColor(goldColor)
      .text(`${item.score}/100`, 160, doc.y)
      .fillColor(mutedText)
      .fontSize(8)
      .font('Helvetica')
      .text(`(${item.status})`, 205, doc.y);

    // Progress Bar
    doc.rect(310, doc.y + 2, 200, 7).fill('#E5E7EB');
    doc.rect(310, doc.y + 2, 2 * item.score, 7).fill(goldColor);

    doc.y += 18;
  });

  doc.y += 10;

  // Life Map Pillars Overview
  doc
    .fillColor(goldColor)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('LIFE MAP PILLARS SUMMARY', 40, doc.y);

  doc.strokeColor(goldColor).lineWidth(1).moveTo(40, doc.y + 4).lineTo(doc.page.width - 40, doc.y + 4).stroke();
  doc.y += 14;

  const pillars = lifeMap.pillars?.pillars || [];
  pillars.forEach((pil) => {
    doc
      .fillColor(darkColor)
      .fontSize(9.5)
      .font('Helvetica-Bold')
      .text(`• ${pil.title}: ${pil.sublabel}`, 40, doc.y)
      .fillColor(bodyText)
      .fontSize(8.5)
      .font('Helvetica')
      .text(pil.focus, 40, doc.y + 12, { width: doc.page.width - 80 });

    doc.y += 30;
  });

  // --- PAGE 2: COSMIC SNAPSHOT & DEEP FACETS ---
  doc.addPage();

  doc.rect(0, 0, doc.page.width, 50).fill(darkColor);
  doc
    .fillColor(goldColor)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('MAVI-ASTROVISION • COSMIC SNAPSHOT & PERSONAL PATTERNS', 40, 20, { letterSpacing: 1.5 });

  doc.y = 70;

  const snapshot = lifeMap.snapshot || [];
  snapshot.forEach((snap) => {
    doc
      .roundedRect(40, doc.y, doc.page.width - 80, 85, 6)
      .fillAndStroke('#FAFAFA', '#E5E7EB');

    const cardY = doc.y + 10;
    doc
      .fillColor(goldColor)
      .fontSize(8.5)
      .font('Helvetica-Bold')
      .text(snap.title.toUpperCase(), 52, cardY)
      .fillColor(mutedText)
      .fontSize(8)
      .font('Helvetica')
      .text(`(${snap.placement})`, 180, cardY);

    doc
      .fillColor(darkColor)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(snap.headline, 52, cardY + 14);

    doc
      .fillColor(bodyText)
      .fontSize(8.5)
      .font('Helvetica')
      .text(snap.summary, 52, cardY + 30, { width: doc.page.width - 104, lineGap: 2 });

    doc
      .fillColor(goldColor)
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('Key Strengths: ', 52, cardY + 62)
      .fillColor(bodyText)
      .font('Helvetica')
      .text(snap.strengths?.join(' • ') || 'Insight', 125, cardY + 62);

    doc.y += 98;
  });

  // --- PAGE 3: CURRENT CYCLE, REFLECTIONS & DISCLAIMER ---
  doc.addPage();

  doc.rect(0, 0, doc.page.width, 50).fill(darkColor);
  doc
    .fillColor(goldColor)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('MAVI-ASTROVISION • CURRENT CYCLE & REFLECTIVE INQUIRY', 40, 20, { letterSpacing: 1.5 });

  doc.y = 75;

  // Current Cycle Box
  const currentCycle = lifeMap.pillars?.currentCycle || {};
  doc
    .fillColor(goldColor)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('CURRENT COSMIC CYCLE', 40, doc.y);

  doc.strokeColor(goldColor).lineWidth(1).moveTo(40, doc.y + 4).lineTo(doc.page.width - 40, doc.y + 4).stroke();
  doc.y += 14;

  doc
    .roundedRect(40, doc.y, doc.page.width - 80, 75, 6)
    .fillAndStroke('#F9FAFB', '#E5E7EB');

  doc
    .fillColor(darkColor)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(currentCycle.sublabel || 'Active Celestial Ingress', 55, doc.y + 12);

  doc
    .fillColor(bodyText)
    .fontSize(9)
    .font('Helvetica')
    .text(currentCycle.description || 'Current transits urge conscious alignment, mindful communication, and emotional grounding.', 55, doc.y + 28, { width: doc.page.width - 110, lineGap: 2 });

  doc
    .fillColor(goldColor)
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text(`Guidance: ${currentCycle.advice || 'Stay attuned to your inner compass.'}`, 55, doc.y + 54);

  doc.y += 100;

  // Self-Reflection Prompts
  doc
    .fillColor(goldColor)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('SOUL REFLECTION PROMPTS', 40, doc.y);

  doc.strokeColor(goldColor).lineWidth(1).moveTo(40, doc.y + 4).lineTo(doc.page.width - 40, doc.y + 4).stroke();
  doc.y += 14;

  snapshot.slice(0, 4).forEach((snap, idx) => {
    doc
      .fillColor(darkColor)
      .fontSize(9)
      .font('Helvetica-Bold')
      .text(`${idx + 1}. Reflection for ${snap.title}:`, 40, doc.y)
      .fillColor(bodyText)
      .fontSize(8.5)
      .font('Helvetica-Oblique')
      .text(`"${snap.reflectionPrompt}"`, 55, doc.y + 12, { width: doc.page.width - 95 });

    doc.y += 36;
  });

  doc.y += 20;

  // Disclaimer & Attribution Box
  doc
    .roundedRect(40, doc.y, doc.page.width - 80, 80, 6)
    .fillAndStroke('#F3F4F6', '#E5E7EB');

  const discY = doc.y + 10;
  doc
    .fillColor(darkColor)
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('ASTROLOGY GUIDANCE & SCIENTIFIC DISCLAIMER', 55, discY);

  doc
    .fillColor(mutedText)
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'The Cosmic Life Map™ is an astrology-based interpretive visualization designed for personal exploration, self-awareness, and contemplation. It is not scientifically validated and is not intended as medical, psychological, legal, or financial prediction. Use these insights as mirrors for self-reflection.',
      55,
      discY + 14,
      { width: doc.page.width - 110, lineGap: 1.5 }
    );

  doc
    .fillColor(subtextColor)
    .fontSize(7)
    .font('Helvetica')
    .text('Data attribution: CosmyDay (https://cosmyday.com) • Placidus House System & Western Tropical Ephemeris', 55, discY + 54);

  doc.end();
  return doc;
}

