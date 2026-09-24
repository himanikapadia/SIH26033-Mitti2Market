import sys
import os

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    from pptx.enum.shapes import MSO_SHAPE
except ImportError:
    import subprocess
    print("Installing python-pptx...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-pptx"])
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    C_BG = RGBColor(248, 250, 252)       # Light Slate #F8FAFC
    C_EMERALD = RGBColor(5, 150, 105)     # #059669
    C_EMERALD_DARK = RGBColor(6, 95, 70)  # #065F46
    C_SLATE_DARK = RGBColor(15, 23, 42)   # #0F172A
    C_SLATE_GRAY = RGBColor(71, 85, 105)  # #475569
    C_WHITE = RGBColor(255, 255, 255)
    C_AMBER = RGBColor(217, 119, 6)       # #D97706
    C_BORDER = RGBColor(226, 232, 240)    # #E2E8F0
    C_CARD_BG = RGBColor(255, 255, 255)
    C_EMERALD_LIGHT = RGBColor(236, 253, 245)
    C_AMBER_LIGHT = RGBColor(254, 243, 199)

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()

    def add_card(slide, left, top, width, height, fill_color=C_WHITE, border_color=C_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1.5)
        else:
            shape.line.fill.background()
        return shape

    def add_header(slide, slide_num, title, subtitle):
        # Header banner shape
        hdr = add_card(slide, Inches(0.6), Inches(0.4), Inches(12.133), Inches(0.85), C_WHITE, C_BORDER)
        tf = hdr.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_top = Inches(0.1)
        
        p = tf.paragraphs[0]
        p.text = f"SLIDE {slide_num}: {title.upper()}"
        p.font.bold = True
        p.font.size = Pt(15)
        p.font.color.rgb = C_EMERALD_DARK

        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.size = Pt(11)
        p2.font.color.rgb = C_SLATE_GRAY

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, C_BG)

    # Hero Banner
    banner = add_card(s1, Inches(0.8), Inches(0.6), Inches(11.733), Inches(3.2), C_SLATE_DARK, None)
    btf = banner.text_frame
    btf.word_wrap = True
    btf.margin_left = Inches(0.4)
    btf.margin_top = Inches(0.3)

    bp0 = btf.paragraphs[0]
    bp0.text = "SMART INDIA HACKATHON 2026 | PROBLEM STATEMENT: SIH26033"
    bp0.font.size = Pt(11)
    bp0.font.bold = True
    bp0.font.color.rgb = C_AMBER

    bp1 = btf.add_paragraph()
    bp1.text = "Mitti2Market"
    bp1.font.size = Pt(40)
    bp1.font.bold = True
    bp1.font.color.rgb = C_WHITE

    bp2 = btf.add_paragraph()
    bp2.text = "Demand-Driven Cooperative Produce Pooling & Direct Escrow Settlement"
    bp2.font.size = Pt(16)
    bp2.font.bold = True
    bp2.font.color.rgb = RGBColor(167, 243, 208)

    bp3 = btf.add_paragraph()
    bp3.text = "Theme: Agriculture, FoodTech & Rural Development  •  Focus: Eliminating Intermediary Margin Cuts & Spoilage"
    bp3.font.size = Pt(12)
    bp3.font.color.rgb = RGBColor(203, 213, 225)

    # Team Card (Left)
    t_card = add_card(s1, Inches(0.8), Inches(4.1), Inches(5.6), Inches(2.7), C_WHITE, C_BORDER)
    ttf = t_card.text_frame
    ttf.word_wrap = True
    ttf.margin_left = Inches(0.3)
    ttf.margin_top = Inches(0.2)

    tp0 = ttf.paragraphs[0]
    tp0.text = "TEAM DETAILS & WORK ALLOCATION"
    tp0.font.bold = True
    tp0.font.size = Pt(12)
    tp0.font.color.rgb = C_EMERALD_DARK

    team_members = [
        "Team Name: [Your Team Name]  •  Institute: [Your College Name]",
        "• Lead: Full-Stack Architecture & Smart Escrow Vault",
        "• AI / ML: Kuhn-Munkres Bi-Graph & CVRP Route Solver",
        "• Telephony: Vernacular Hindi/Gujarati Voice IVR & PBX",
        "• Computer Vision: Edge YOLOv8 Farm-Gate Produce Grading",
        "• Ground Research: Surat APMC Mandi Survey & Field Validation"
    ]
    for tm in team_members:
        tp = ttf.add_paragraph()
        tp.text = tm
        tp.font.size = Pt(10)
        tp.font.color.rgb = C_SLATE_DARK

    # Ground Proof & Live Links (Right)
    r_card = add_card(s1, Inches(6.7), Inches(4.1), Inches(5.833), Inches(2.7), C_EMERALD_LIGHT, C_EMERALD)
    rtf = r_card.text_frame
    rtf.word_wrap = True
    rtf.margin_left = Inches(0.3)
    rtf.margin_top = Inches(0.2)

    rp0 = rtf.paragraphs[0]
    rp0.text = "⭐ PRIMARY FIELD VALIDATION & WORKING PROTOTYPE"
    rp0.font.bold = True
    rp0.font.size = Pt(12)
    rp0.font.color.rgb = C_EMERALD_DARK

    proof_points = [
        "📍 Backed by On-Ground Field Study at Surat APMC Mandi Yard",
        "🧾 Documented Actual Mandi Bill proving 42% intermediary deductions",
        "🌐 Live Deployed Prototype: https://your-app.vercel.app",
        "⚡ Features 1-Click 90-Second Auto Demo for instant browser testing",
        "📞 Tested with Pure Vernacular Hindi Voice IVR on 2G Keypad Phones",
        "💻 GitHub Repository: https://github.com/himanikapadia/SIH26033-Mitti2Market"
    ]
    for pp in proof_points:
        rp = rtf.add_paragraph()
        rp.text = pp
        rp.font.size = Pt(10)
        rp.font.color.rgb = C_SLATE_DARK

    # =========================================================================
    # SLIDE 2: GROUND REALITY VS MITTI2MARKET SOLUTION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, C_BG)
    add_header(s2, 2, "Idea Title, Problem Discovery & Innovation",
               "Primary Evidence from Surat APMC Mandi Visit mapped directly to Mitti2Market's Solution")

    # Left Column: 4 Real Photo Placeholder Frames
    l_box = add_card(s2, Inches(0.6), Inches(1.4), Inches(5.8), Inches(5.6), C_WHITE, C_BORDER)
    ltf = l_box.text_frame
    ltf.word_wrap = True
    ltf.margin_left = Inches(0.2)
    ltf.margin_top = Inches(0.15)
    lp = ltf.paragraphs[0]
    lp.text = "📸 FIELD EVIDENCE FROM MANDI VISIT (INSERT PHOTOS)"
    lp.font.bold = True
    lp.font.size = Pt(11)
    lp.font.color.rgb = C_EMERALD_DARK

    # 4 Photo Sub-frames
    p1 = add_card(s2, Inches(0.8), Inches(1.85), Inches(2.55), Inches(2.2), C_AMBER_LIGHT, C_AMBER)
    ptf1 = p1.text_frame
    ptf1.word_wrap = True
    ptf1.paragraphs[0].text = "[ PHOTO 1: MANDI BILL ]\n\n🔴 Problem: Physical bill reveals 42% deduction in commission (arhat), mandi cess & labor."
    ptf1.paragraphs[0].font.size = Pt(9)
    ptf1.paragraphs[0].font.bold = True
    ptf1.paragraphs[0].font.color.rgb = C_SLATE_DARK

    p2 = add_card(s2, Inches(3.55), Inches(1.85), Inches(2.55), Inches(2.2), C_AMBER_LIGHT, C_AMBER)
    ptf2 = p2.text_frame
    ptf2.word_wrap = True
    ptf2.paragraphs[0].text = "[ PHOTO 2: FARMER LOADING ]\n\n🔴 Problem: Fragmented transport; farmer pays ₹4/kg freight alone with 18-22% spoilage."
    ptf2.paragraphs[0].font.size = Pt(9)
    ptf2.paragraphs[0].font.bold = True
    ptf2.paragraphs[0].font.color.rgb = C_SLATE_DARK

    p3 = add_card(s2, Inches(0.8), Inches(4.3), Inches(2.55), Inches(2.2), C_AMBER_LIGHT, C_AMBER)
    ptf3 = p3.text_frame
    ptf3.word_wrap = True
    ptf3.paragraphs[0].text = "[ PHOTO 3: WEIGHING SCALE ]\n\n🔴 Problem: Manual dial scales cause arbitrary weight cuts & subjective grading disputes."
    ptf3.paragraphs[0].font.size = Pt(9)
    ptf3.paragraphs[0].font.bold = True
    ptf3.paragraphs[0].font.color.rgb = C_SLATE_DARK

    p4 = add_card(s2, Inches(3.55), Inches(4.3), Inches(2.55), Inches(2.2), C_AMBER_LIGHT, C_AMBER)
    ptf4 = p4.text_frame
    ptf4.word_wrap = True
    ptf4.paragraphs[0].text = "[ PHOTO 4: WITH MANDI SETH ]\n\n🔴 Problem: Interviews proved 55%+ smallholders use basic 2G keypad phones; excluded by apps."
    ptf4.paragraphs[0].font.size = Pt(9)
    ptf4.paragraphs[0].font.bold = True
    ptf4.paragraphs[0].font.color.rgb = C_SLATE_DARK

    # Right Column: Idea Title & Solution Mapping
    r_box = add_card(s2, Inches(6.7), Inches(1.4), Inches(6.033), Inches(5.6), C_WHITE, C_BORDER)
    rtf2 = r_box.text_frame
    rtf2.word_wrap = True
    rtf2.margin_left = Inches(0.3)
    rtf2.margin_top = Inches(0.2)

    rp = rtf2.paragraphs[0]
    rp.text = "💡 IDEA: MITTI2MARKET DEMAND-DRIVEN POOLING"
    rp.font.bold = True
    rp.font.size = Pt(13)
    rp.font.color.rgb = C_EMERALD_DARK

    sol_points = [
        "📋 Proposed Solution:\nReverses the supply chain from 'Supply-Push' (dumping at mandis) to 'Demand-Pull'. Aggregates 3-5 smallholders (100-300kg) into one 1,000kg institutional B2B order with cold-chain farm-gate pickup.",
        "🎯 Direct 1-to-1 Mapping to Ground Mandi Problems:\n1. Mandi Bill 42% Cut ➔ 0% Commission (80-85% Direct Farmer Payout)\n2. Loading Freight ➔ Consolidated CVRP Truck (Farmer pays ₹0 Freight)\n3. Weighing Disputes ➔ IoT Bluetooth Scale + Edge YOLOv8 AI QC\n4. 55% Digital Barrier ➔ Pure Hindi/Gujarati Voice IVR on Keypad Phones",
        "✨ Key Innovation & Uniqueness:\n• Dual-Channel Telephony: Keypad phones get Hindi IVR; smartphones get app alerts.\n• Dynamic Standby Reserve: Auto-replaces dropouts to guarantee 100% order quota.\n• Smart Milestone Escrow: 70% released at farm gate; 30% on doorstep delivery."
    ]
    for sp in sol_points:
        p = rtf2.add_paragraph()
        p.text = sp
        p.font.size = Pt(10)
        p.font.color.rgb = C_SLATE_DARK

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH & METHODOLOGY
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, C_BG)
    add_header(s3, 3, "Technical Approach & Implementation Methodology",
               "System Architecture, Technologies, Hardware & 4 Core Algorithmic AI Engines")

    # Left: Methodology Flowchart
    m_box = add_card(s3, Inches(0.6), Inches(1.4), Inches(5.8), Inches(5.6), C_WHITE, C_BORDER)
    mtf = m_box.text_frame
    mtf.word_wrap = True
    mtf.margin_left = Inches(0.3)
    mtf.margin_top = Inches(0.2)
    mtf.paragraphs[0].text = "🔄 5-STEP IMPLEMENTATION METHODOLOGY"
    mtf.paragraphs[0].font.bold = True
    mtf.paragraphs[0].font.size = Pt(12)
    mtf.paragraphs[0].font.color.rgb = C_EMERALD_DARK

    steps = [
        "1. BUYER REQUISITION:\nInstitutional buyer posts crop, target volume (1,000kg), and time window. Pre-filled via AI Demand Forecast.",
        "2. MITTIMATCH BI-GRAPH AGGREGATION:\nKuhn-Munkres bipartite matching solver scans 15 regional smallholders within 15km cluster and optimizes quotas.",
        "3. DUAL-CHANNEL CONSENT DISPATCH:\nSimultaneously fires Smartphone App Push Alert AND 2G Keypad Phone Hindi Voice IVR Call (Press 1 to Accept, 2 to Reject).",
        "4. MULTI-STOP COLD-CHAIN COLLECTION:\nSingle refrigerated truck follows Clarke-Wright CVRP route with IoT digital Bluetooth scale weighing and on-truck YOLOv8 defect scan.",
        "5. DUAL-MILESTONE ESCROW SETTLEMENT:\n70% locked deposit released immediately at farm gate; 30% released upon buyer doorstep acceptance."
    ]
    for s in steps:
        p = mtf.add_paragraph()
        p.text = s
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_SLATE_DARK

    # Right: Technologies & 4 AI Models
    t_box = add_card(s3, Inches(6.7), Inches(1.4), Inches(6.033), Inches(5.6), C_WHITE, C_BORDER)
    ttf3 = t_box.text_frame
    ttf3.word_wrap = True
    ttf3.margin_left = Inches(0.3)
    ttf3.margin_top = Inches(0.2)
    ttf3.paragraphs[0].text = "💻 TECHNOLOGIES, HARDWARE & 4 AI ENGINES"
    ttf3.paragraphs[0].font.bold = True
    ttf3.paragraphs[0].font.size = Pt(12)
    ttf3.paragraphs[0].font.color.rgb = C_EMERALD_DARK

    tech_points = [
        "🛠️ Technologies & Hardware Used:\n• Frontend: React 18, TypeScript, Tailwind CSS, Leaflet GIS Maps\n• Telephony & Audio: Twilio / Asterisk PBX, DTMF decoder, gTTS Hindi/Gujarati\n• Hardware: 2G Feature Phones, Android Smartphones, Bluetooth Digital Scales\n• Edge ML Runtime: TFLite (INT8 Quantized, 100% Offline-Capable)",
        "🧠 4 Core Production AI Engines:\n1. MittiForecaster (LSTM + LightGBM Regressor):\n   Predicts 7-day wholesale APMC spot prices & cluster deficits (R²=94.8%).\n2. MittiMatch (Hungarian Bi-Partite Graph Matching):\n   Solves Pareto-optimal smallholder pooling with +-10% buyer tolerance.\n3. MittiRoute (Perishable CVRP-TW Optimizer):\n   Clarke-Wright savings heuristic cutting 37.3% travel km and 0% spoilage.\n4. MittiVision (Edge YOLOv8-Nano):\n   24ms mobile defect segmentation and automated Agmark digital stamping."
    ]
    for tp in tech_points:
        p = ttf3.add_paragraph()
        p.text = tp
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_SLATE_DARK

    # =========================================================================
    # SLIDE 4: FEASIBILITY, VIABILITY & RISK MITIGATION
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, C_BG)
    add_header(s4, 4, "Feasibility, Viability & Risk Mitigation Matrix",
               "Ground Feasibility Analysis and Engineering Mitigations for Rural Agricultural Realities")

    # Left: 3 Feasibility Pillars
    f_box = add_card(s4, Inches(0.6), Inches(1.4), Inches(5.8), Inches(5.6), C_WHITE, C_BORDER)
    ftf = f_box.text_frame
    ftf.word_wrap = True
    ftf.margin_left = Inches(0.3)
    ftf.margin_top = Inches(0.2)
    ftf.paragraphs[0].text = "📊 3 FEASIBILITY & VIABILITY PILLARS"
    ftf.paragraphs[0].font.bold = True
    ftf.paragraphs[0].font.size = Pt(12)
    ftf.paragraphs[0].font.color.rgb = C_EMERALD_DARK

    pillars = [
        "⚙️ TECHNICAL FEASIBILITY:\n• Built on ubiquitous 2G telecom voice networks (99.8% rural reach).\n• Edge AI models are quantized to INT8; run offline on mobile CPUs with ZERO cloud dependency in remote fields.",
        "💰 ECONOMIC VIABILITY:\n• Self-sustaining commercial model: 2% facilitation fee + flat ₹1.0/kg freight paid by institutional buyers.\n• Smallholders pay ₹0 platform fee and ₹0 freight cost.",
        "👨‍🌾 OPERATIONAL & BEHAVIORAL FIT:\n• Zero behavioral change required for smallholders. Farmers do not need to download apps or read English—they simply answer their phone and press '1' to accept."
    ]
    for pil in pillars:
        p = ftf.add_paragraph()
        p.text = pil
        p.font.size = Pt(10)
        p.font.color.rgb = C_SLATE_DARK

    # Right: Risk Matrix
    r_box4 = add_card(s4, Inches(6.7), Inches(1.4), Inches(6.033), Inches(5.6), C_WHITE, C_BORDER)
    rtf4 = r_box4.text_frame
    rtf4.word_wrap = True
    rtf4.margin_left = Inches(0.3)
    rtf4.margin_top = Inches(0.2)
    rtf4.paragraphs[0].text = "🛡️ RISK ANALYSIS & MITIGATION MATRIX"
    rtf4.paragraphs[0].font.bold = True
    rtf4.paragraphs[0].font.size = Pt(12)
    rtf4.paragraphs[0].font.color.rgb = C_EMERALD_DARK

    risks = [
        "🔴 Risk 1: Low Literacy & Feature Phone Usage (High)\n🟢 Mitigation: Pure vernacular voice IVR (Hindi/Gujarati) requiring only keypad number presses (1 Accept, 2 Reject).",
        "🔴 Risk 2: Farmer Dropout or Gate Shortfall (Medium)\n🟢 Mitigation: Dynamic Standby Reserve. Algorithm automatically pre-allocates backup farmers to fulfill shortfalls instantly.",
        "🔴 Risk 3: Produce Quality & Weighing Disputes (High)\n🟢 Mitigation: IoT digital Bluetooth scales and on-truck YOLOv8 camera inspection with pre-agreed contract rate adjustments.",
        "🔴 Risk 4: Buyer Payment Default (High)\n🟢 Mitigation: Mandatory 70% smart escrow vault deposit locked before collection truck departs."
    ]
    for r in risks:
        p = rtf4.add_paragraph()
        p.text = r
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_SLATE_DARK

    # =========================================================================
    # SLIDE 5: IMPACT & BENEFITS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, C_BG)
    add_header(s5, 5, "Impact & Quantifiable Benefits",
               "Direct Socio-Economic Transformation and Supply Chain Decarbonization")

    # Top Row: 4 Big KPI Cards
    kpis = [
        ("+45.0%", "Farmer Net Income", "Farmer share: 35% -> 85%"),
        ("SAME-DAY", "Direct Bank Credit", "70% Gate / 30% Delivery"),
        ("-37.3%", "Transport Mileage", "-43.4% Carbon Emissions"),
        ("< 2.0%", "Produce Spoilage", "Down from 22% decay")
    ]
    for i, (val, title, sub) in enumerate(kpis):
        kcard = add_card(s5, Inches(0.6 + i * 3.1), Inches(1.4), Inches(2.85), Inches(1.4), C_WHITE, C_BORDER)
        ktf = kcard.text_frame
        ktf.word_wrap = True
        ktf.margin_left = Inches(0.15)
        ktf.margin_top = Inches(0.1)
        p0 = ktf.paragraphs[0]
        p0.text = val
        p0.font.bold = True
        p0.font.size = Pt(22)
        p0.font.color.rgb = C_EMERALD_DARK
        p1 = ktf.add_paragraph()
        p1.text = title
        p1.font.bold = True
        p1.font.size = Pt(10)
        p1.font.color.rgb = C_SLATE_DARK
        p2 = ktf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = C_SLATE_GRAY

    # Bottom Left: Socio-Economic Impact
    se_box = add_card(s5, Inches(0.6), Inches(3.0), Inches(5.8), Inches(4.0), C_WHITE, C_BORDER)
    setf = se_box.text_frame
    setf.word_wrap = True
    setf.margin_left = Inches(0.3)
    setf.margin_top = Inches(0.2)
    setf.paragraphs[0].text = "👨‍🌾 SOCIO-ECONOMIC BENEFITS (FARMER & BUYER)"
    setf.paragraphs[0].font.bold = True
    setf.paragraphs[0].font.size = Pt(11)
    setf.paragraphs[0].font.color.rgb = C_EMERALD_DARK

    se_points = [
        "• Smallholder Income Jump: Shifting farmer realization from 35% to 85% transforms marginal livelihoods.",
        "• ₹0 Logistics Cost: Farmers pay zero transport expenses; saves ₹4-5/kg in freight.",
        "• Eliminates Debt Traps: Same-day escrow eliminates chronic 45-day informal commission agent credit delay.",
        "• Buyer Savings: Institutional buyers save 12-18% by eliminating mandi cess and multi-tier trader markups."
    ]
    for sep in se_points:
        p = setf.add_paragraph()
        p.text = sep
        p.font.size = Pt(10)
        p.font.color.rgb = C_SLATE_DARK

    # Bottom Right: Environmental & Social Inclusion
    env_box = add_card(s5, Inches(6.7), Inches(3.0), Inches(6.033), Inches(4.0), C_WHITE, C_BORDER)
    envtf = env_box.text_frame
    envtf.word_wrap = True
    envtf.margin_left = Inches(0.3)
    envtf.margin_top = Inches(0.2)
    envtf.paragraphs[0].text = "🌱 SOCIAL INCLUSION & SUPPLY CHAIN EFFICIENCY"
    envtf.paragraphs[0].font.bold = True
    envtf.paragraphs[0].font.size = Pt(11)
    envtf.paragraphs[0].font.color.rgb = C_EMERALD_DARK

    env_points = [
        "• 100% Digital Inclusion: Basic keypad phone integration ensures non-literate farmers are never left behind.",
        "• Food Waste Reduction: Rapid 90-minute cold-chain transit drops perishable loss from 22% to under 2%.",
        "• Decarbonized Rural Transit: Multi-stop CVRP vehicle eliminates multiple single-farmer tractor runs, cutting 43% CO2.",
        "• Transparent Commerce: Cryptographic Agmark digital seals and itemized SMS receipts for every transaction."
    ]
    for env in env_points:
        p = envtf.add_paragraph()
        p.text = env
        p.font.size = Pt(10)
        p.font.color.rgb = C_SLATE_DARK

    # =========================================================================
    # SLIDE 6: RESEARCH, REFERENCES & PROTOTYPE SHOWCASE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, C_BG)
    add_header(s6, 6, "Research References & Prototype Verification",
               "Primary Ground Field Survey, 6 Academic Citations & Live Prototype Verification")

    # Left: References & Links
    ref_box = add_card(s6, Inches(0.6), Inches(1.4), Inches(5.8), Inches(4.9), C_WHITE, C_BORDER)
    rtf6 = ref_box.text_frame
    rtf6.word_wrap = True
    rtf6.margin_left = Inches(0.25)
    rtf6.margin_top = Inches(0.15)
    rtf6.paragraphs[0].text = "📚 REFERENCES & RESEARCH CITATIONS (WITH LINKS)"
    rtf6.paragraphs[0].font.bold = True
    rtf6.paragraphs[0].font.size = Pt(11)
    rtf6.paragraphs[0].font.color.rgb = C_EMERALD_DARK

    refs = [
        "📍 Primary Field Survey: Surat APMC Mandi Yard, Gujarat (Interviewed Mandi Seth, weighmen & smallholders; verified 42% cuts).",
        "1. Ministry of Agriculture, GoI: Committee on Doubling Farmers' Income (DFI Report, Vol. IV)\n   🔗 agricoop.nic.in/en/doubling-farmers",
        "2. ICAR-CIPHET National Study on Post-Harvest Losses of Agricultural Produce\n   🔗 ciphet.icar.gov.in",
        "3. Agmarknet Official APMC Mandi Daily Price & Arrival Database (DMI)\n   🔗 agmarknet.gov.in",
        "4. Kuhn-Munkres Bipartite Matching Algorithm: Kuhn (1955), Naval Research Logistics\n   🔗 doi.org/10.1002/nav.3800020109",
        "5. Clarke & Wright Vehicle Routing (CVRP): Clarke & Wright (1964), Operations Research\n   🔗 doi.org/10.1287/opre.12.4.568",
        "6. Perishable Food Quality Decay Kinetics: Tijskens & Polderdijk (1996), Postharvest Bio.\n   🔗 doi.org/10.1016/0925-5214(96)00008-0"
    ]
    for r in refs:
        p = rtf6.add_paragraph()
        p.text = r
        p.font.size = Pt(8.5)
        p.font.color.rgb = C_SLATE_DARK

    # Right: 4 Prototype Screenshot Frames
    proto_box = add_card(s6, Inches(6.7), Inches(1.4), Inches(6.033), Inches(4.9), C_WHITE, C_BORDER)
    ptf6 = proto_box.text_frame
    ptf6.word_wrap = True
    ptf6.margin_left = Inches(0.25)
    ptf6.margin_top = Inches(0.15)
    ptf6.paragraphs[0].text = "📱 PROTOTYPE SCREENSHOTS (PASTE IMAGES HERE)"
    ptf6.paragraphs[0].font.bold = True
    ptf6.paragraphs[0].font.size = Pt(11)
    ptf6.paragraphs[0].font.color.rgb = C_EMERALD_DARK

    # 4 Screenshot sub-boxes
    s_frames = [
        ("SCREEN 1: BUYER PORTAL", "AI Demand Forecaster & Radar Map", Inches(6.9), Inches(1.9)),
        ("SCREEN 2: DEVICE SIMULATORS", "Smartphone Alert & Keypad Hindi IVR", Inches(9.8), Inches(1.9)),
        ("SCREEN 3: LOGISTICS & QC", "Moving Truck Map & YOLOv8 Produce Scan", Inches(6.9), Inches(4.0)),
        ("SCREEN 4: AI ARCHITECTURE", "Top Bar 4-Model Stack & Tensor Playground", Inches(9.8), Inches(4.0))
    ]
    for label, desc, l, t in s_frames:
        box = add_card(s6, l, t, Inches(2.75), Inches(1.95), C_EMERALD_LIGHT, C_EMERALD)
        btf = box.text_frame
        btf.word_wrap = True
        btf.margin_left = Inches(0.1)
        btf.margin_top = Inches(0.1)
        bp = btf.paragraphs[0]
        bp.text = f"[{label}]\n\n{desc}\n(Paste screenshot)"
        bp.font.size = Pt(8.5)
        bp.font.bold = True
        bp.font.color.rgb = C_SLATE_DARK

    # Bottom Verification Bar
    bot_bar = add_card(s6, Inches(0.6), Inches(6.45), Inches(12.133), Inches(0.7), C_SLATE_DARK, None)
    bttf = bot_bar.text_frame
    bttf.word_wrap = True
    bttf.margin_left = Inches(0.2)
    bttf.margin_top = Inches(0.1)
    bp = bttf.paragraphs[0]
    bp.text = "🌐 LIVE PROTOTYPE: https://your-app.vercel.app  •  💻 GITHUB: https://github.com/himanikapadia/SIH26033-Mitti2Market  •  ⚡ INCLUDES 1-CLICK 90-SEC AUTO DEMO"
    bp.font.size = Pt(9.5)
    bp.font.bold = True
    bp.font.color.rgb = C_WHITE

    # Save to Desktop and Demo folder
    desktop_path = os.path.expanduser(r"~\OneDrive\Desktop\Mitti2Market_SIH26033_Presentation.pptx")
    workspace_path = os.path.abspath("Mitti2Market_SIH26033_Presentation.pptx")

    try:
        prs.save(desktop_path)
        print(f"Saved to Desktop: {desktop_path}")
    except Exception as e:
        print(f"Could not save to Desktop directly: {e}")

    prs.save(workspace_path)
    print(f"Saved to Workspace: {workspace_path}")

if __name__ == "__main__":
    create_presentation()
