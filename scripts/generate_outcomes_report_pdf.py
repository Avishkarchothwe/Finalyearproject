# -*- coding: utf-8 -*-
import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)

def build_outcomes_pdf(output_paths):
    page_w, page_h = letter
    margin = 0.50 * inch
    usable_w = page_w - 2 * margin

    c_primary = colors.HexColor('#0f172a')     # Slate 900
    c_accent = colors.HexColor('#0284c7')      # Cyan 600
    c_teal = colors.HexColor('#0d9488')        # Teal 600
    c_emerald = colors.HexColor('#059669')     # Emerald 600
    c_dark = colors.HexColor('#1e293b')        # Slate 800
    c_card_bg = colors.HexColor('#f8fafc')     # Slate 50
    c_card_border = colors.HexColor('#cbd5e1') # Slate 300

    title_style = ParagraphStyle(
        'RepTitle',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        alignment=TA_LEFT,
        spaceAfter=3
    )
    subtitle_style = ParagraphStyle(
        'RepSubtitle',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_accent,
        alignment=TA_LEFT,
        spaceAfter=8
    )
    meta_style = ParagraphStyle(
        'RepMeta',
        fontName='Helvetica',
        fontSize=8.0,
        leading=11.5,
        textColor=colors.HexColor('#475569')
    )
    h1_style = ParagraphStyle(
        'RepH1',
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=c_primary,
        spaceBefore=8,
        spaceAfter=4
    )
    h2_style = ParagraphStyle(
        'RepH2',
        fontName='Helvetica-Bold',
        fontSize=9.2,
        leading=12,
        textColor=c_accent,
        spaceBefore=5,
        spaceAfter=2
    )
    body_style = ParagraphStyle(
        'RepBody',
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        textColor=c_dark,
        alignment=TA_JUSTIFY,
        spaceAfter=4
    )
    bullet_style = ParagraphStyle(
        'RepBullet',
        fontName='Helvetica',
        fontSize=8.0,
        leading=11.2,
        textColor=c_dark,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2.5
    )
    caption_style = ParagraphStyle(
        'RepCaption',
        fontName='Helvetica-Oblique',
        fontSize=7.2,
        leading=9.2,
        textColor=colors.HexColor('#475569'),
        alignment=TA_CENTER,
        spaceBefore=2,
        spaceAfter=4
    )
    card_title_style = ParagraphStyle(
        'CardTitle',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=c_primary,
        alignment=TA_CENTER
    )
    card_val_style = ParagraphStyle(
        'CardVal',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=17,
        textColor=c_accent,
        alignment=TA_CENTER
    )
    card_sub_style = ParagraphStyle(
        'CardSub',
        fontName='Helvetica',
        fontSize=7.0,
        leading=9,
        textColor=colors.HexColor('#64748b'),
        alignment=TA_CENTER
    )

    story = []

    # Header / Meta
    story.append(Paragraph('AI-Based Natural Resource Potential Mapping Platform', title_style))
    story.append(Paragraph('Executive Capstone Project Outcomes, Architecture & Engineering Validation Report', subtitle_style))
    
    meta_text = '<b>Academic Focus:</b> B.Tech CSE (Artificial Intelligence) Final Year Capstone Project<br/>' \
                '<b>Target Study Catchment:</b> Pune Metropolitan Region, Maharashtra, India (18.40°N–18.65°N, 73.70°E–74.00°E)<br/>' \
                '<b>Lead Author & Developer:</b> Avishkar & Project Team • Academic Session 2025–2026'
    meta_table = Table([[Paragraph(meta_text, meta_style)]], colWidths=[usable_w])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_card_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 6))

    # KPI Banner
    card1 = [Paragraph('Classification Accuracy', card_title_style), Paragraph('81.11%', card_val_style), Paragraph('Spatial Block CV', card_sub_style)]
    card2 = [Paragraph('Spatial Macro F1', card_title_style), Paragraph('0.7314', card_val_style), Paragraph('Zero Data Leakage', card_sub_style)]
    card3 = [Paragraph('Leakage Correction', card_title_style), Paragraph('-17.26%', card_val_style), Paragraph('Drop vs Random CV', card_sub_style)]
    card4 = [Paragraph('Depth Regressor', card_title_style), Paragraph('1.42 m', card_val_style), Paragraph('RMSE Water Level', card_sub_style)]
    
    c_w = usable_w / 4.0
    kpi_table = Table([[card1, card2, card3, card4]], colWidths=[c_w, c_w, c_w, c_w])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0f9ff')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#bae6fd')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e0f2fe')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 6))

    # SECTION 1
    story.append(Paragraph('1. Problem Statement & Motivation', h1_style))
    story.append(HRFlowable(width='100%', thickness=1, color=c_accent, spaceBefore=1, spaceAfter=4))
    story.append(Paragraph(
        "In Maharashtra's Deccan Volcanic Province, groundwater supplies over 60% of irrigated agriculture and 85% of rural drinking supplies. Yet Pune Metropolitan Region faces accelerating water stress caused by rapid urban expansion, high impermeable runoff from concrete surfaces, and erratic monsoons. Basalt formations have virtually zero primary porosity; groundwater storage is confined exclusively to secondary cooling fractures, fault lineaments, and weathered vesicular horizons.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Prior Limitations Overcome:</b> Traditional GIS Analytical Hierarchy Process (AHP) relies on subjective expert scoring, producing up to 38% variation across expert panels. Simultaneously, previous machine learning studies systematically used <i>random K-fold cross-validation</i>. Under Tobler's First Law of Geography, random train/test splitting permits test borewells to lie within the spatial autocorrelation range of training borewells, causing massive <b>spatial data leakage</b> that artificially inflates performance metrics by up to 18%. This platform resolves this critical flaw using <b>Spatial Block Cross-Validation</b>.",
        body_style
    ))

    # SECTION 2
    story.append(Paragraph('2. Technical Architecture & End-to-End Implementation Stack', h1_style))
    story.append(HRFlowable(width='100%', thickness=1, color=c_accent, spaceBefore=1, spaceAfter=4))
    
    arch_col1 = usable_w * 0.50
    arch_col2 = usable_w * 0.48
    
    arch_bullets = [
        Paragraph('<b>Backend REST Microservice & Machine Learning Engine:</b>', h2_style),
        Paragraph('• <b>FastAPI High-Speed Service:</b> 11 modular endpoints handling real-time point prediction, GeoJSON raster grids, scenario simulations, and well telemetry.', bullet_style),
        Paragraph('• <b>16-D Multi-Source Feature Extractor:</b> Fuses SRTM 30m DEM (elevation, slope, aspect, TWI, TRI), Mula-Mutha drainage network, GSI basalt lithology, SoilGrids hydraulic conductivity, IMD Western Ghats precipitation, Sentinel-2 MSI (NDVI, NDWI, NDMI), and ESA WorldCover imperviousness.', bullet_style),
        Paragraph('• <b>Spatial Block K-Fold Engine:</b> Partitions Pune into 5 geographic holdout blocks (NW, SW, Central, E, NE) ensuring zero spatial proximity between train and test data.', bullet_style),
        Paragraph('• <b>XGBoost Classification & Regression:</b> Extreme Gradient Boosted trees predicting potential class (Low, Mod, High) and continuous water-table depth (mbgl).', bullet_style),
        Paragraph('• <b>TreeSHAP Explainable AI:</b> Real-time Shapley attribution decomposing individual predictions into positive recharge drivers and negative urban bottlenecks.', bullet_style),
        Paragraph('<b>Frontend Web GIS Mission Control:</b>', h2_style),
        Paragraph('• <b>React 18 + TypeScript + Vite:</b> Modern scientific dashboard with interactive Leaflet GIS, raster overlays, well catalogue, and scenario simulation.', bullet_style)
    ]
    
    fig2_path = 'docs/figures/fig2_system_architecture.png'
    if os.path.exists(fig2_path):
        arch_table = Table([[arch_bullets, [Image(fig2_path, width=arch_col2, height=arch_col2*0.62), Paragraph('Fig. 1. End-to-End Multi-Source GeoAI Platform Architecture', caption_style)]]], colWidths=[arch_col1, arch_col2])
        arch_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(arch_table)
    else:
        for b in arch_bullets:
            story.append(b)

    story.append(PageBreak())

    # SECTION 3
    story.append(Paragraph('3. Key Experimental Outcomes & Multi-Model Benchmarks', h1_style))
    story.append(HRFlowable(width='100%', thickness=1, color=c_accent, spaceBefore=1, spaceAfter=4))
    
    story.append(Paragraph(
        '<b>Outcome 1: Empirical Proof of Spatial Data Leakage.</b> Evaluating models under standard random cross-validation yields falsely inflated F1 scores of 0.8694 to 0.8840. When subjected to our rigorous Spatial Block Cross-Validation, models experience a sharp performance penalty of <b>-14.96% to -17.88%</b>. This statistically validates that published literature overestimates real-world geospatial transferability.',
        body_style
    ))

    # Benchmark Table
    bench_data = [
        [Paragraph('<b>Model Architecture</b>', caption_style), Paragraph('<b>Accuracy</b>', caption_style), Paragraph('<b>Macro F1</b>', caption_style), Paragraph('<b>Spatial Block F1</b>', caption_style), Paragraph('<b>Random Split F1</b>', caption_style), Paragraph('<b>Leakage Drop</b>', caption_style)],
        [Paragraph('Logistic Regression', caption_style), Paragraph('91.65%', caption_style), Paragraph('0.6006', caption_style), Paragraph('0.7430', caption_style), Paragraph('0.8738', caption_style), Paragraph('-14.96%', caption_style)],
        [Paragraph('SVM (RBF Kernel)', caption_style), Paragraph('78.93%', caption_style), Paragraph('0.6717', caption_style), Paragraph('0.7156', caption_style), Paragraph('0.8694', caption_style), Paragraph('-17.68%', caption_style)],
        [Paragraph('Random Forest (200 Trees)', caption_style), Paragraph('79.52%', caption_style), Paragraph('0.6822', caption_style), Paragraph('0.7161', caption_style), Paragraph('0.8720', caption_style), Paragraph('-17.88%', caption_style)],
        [Paragraph('<b>XGBoost (Production Engine)</b>', caption_style), Paragraph('<b>81.11%</b>', caption_style), Paragraph('<b>0.7171</b>', caption_style), Paragraph('<b>0.7314</b>', caption_style), Paragraph('<b>0.8840</b>', caption_style), Paragraph('<b>-17.26%</b>', caption_style)],
    ]
    bench_table = Table(bench_data, colWidths=[usable_w*0.28, usable_w*0.13, usable_w*0.13, usable_w*0.17, usable_w*0.15, usable_w*0.14])
    bench_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, c_card_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_card_border),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BACKGROUND', (0,4), (-1,4), colors.HexColor('#e0f2fe')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(bench_table)
    story.append(Spacer(1, 6))

    # 2 Figures side by side
    fig4_path = 'docs/figures/fig4_leakage_drop.png'
    fig5_path = 'docs/figures/fig5_ablation_curve.png'
    half_w = usable_w * 0.49
    if os.path.exists(fig4_path) and os.path.exists(fig5_path):
        two_fig_table = Table([[
            [Image(fig4_path, width=half_w, height=half_w*0.50), Paragraph('Fig. 2. Spatial Autocorrelation Leakage Drop Across Models', caption_style)],
            [Image(fig5_path, width=half_w, height=half_w*0.50), Paragraph('Fig. 3. 6-Stage Progressive Feature Ablation Trajectory', caption_style)]
        ]], colWidths=[half_w, half_w])
        two_fig_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(two_fig_table)
        story.append(Spacer(1, 5))

    story.append(Paragraph(
        '<b>Outcome 2: 6-Stage Feature Ablation & Hydrological Jump.</b> Single-source DEM topography achieved only 50.90% Spatial F1. The addition of Western Ghats orographic precipitation gradients increased F1 to 52.72%. Introducing Mula-Mutha drainage network features (EXP 3) triggered a massive <b>+45.5% jump</b> to 76.74% F1, proving that river corridors and alluvial buffers are the physical lifeblood of recharge in Pune. Full-stack fusion balances the model to capture concrete infiltration bottlenecks in downtown areas.',
        body_style
    ))

    # SECTION 4
    story.append(Paragraph('4. Explainable AI Insights & Hydrogeological Interpretability', h1_style))
    story.append(HRFlowable(width='100%', thickness=1, color=c_accent, spaceBefore=1, spaceAfter=4))
    
    fig6_path = 'docs/figures/fig6_shap_attribution.png'
    shap_bullets = [
        Paragraph('<b>Dominant Global & Local Features (TreeSHAP):</b>', h2_style),
        Paragraph('• <b>Topographic Wetness Index (22.8%):</b> Major positive driver; concave topography collects surface runoff into recharge pools.', bullet_style),
        Paragraph('• <b>Stream Channel Proximity (17.5%):</b> Alluvial riverbeds maintain strong perennial recharge buffers.', bullet_style),
        Paragraph('• <b>Basalt Fracture Permeability (14.1%):</b> Vesicular and fractured lava units provide key secondary storage capacity.', bullet_style),
        Paragraph('• <b>Urban Impervious Cover (10.4%):</b> Strong negative bottleneck; heavy concrete paving blocks infiltration in city wards.', bullet_style)
    ]
    if os.path.exists(fig6_path):
        shap_table = Table([[
            shap_bullets,
            [Image(fig6_path, width=half_w*0.95, height=half_w*0.50), Paragraph('Fig. 4. Global Feature Importance via TreeSHAP', caption_style)]
        ]], colWidths=[usable_w*0.50, usable_w*0.50])
        shap_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(shap_table)

    # SECTION 5
    story.append(Paragraph('5. Real-World Impact & Natural Resource Extensibility', h1_style))
    story.append(HRFlowable(width='100%', thickness=1, color=c_accent, spaceBefore=1, spaceAfter=4))
    story.append(Paragraph(
        '<b>Municipal Implementation (PMC / PCMC / GSDA):</b> The platform allows urban planners and hydrogeologists to identify optimal sites for artificial rainwater harvesting, check dams, and percolation tanks before committing capital expenditure. Planners can run interactive scenario simulations (e.g., +20% rainfall or +30% urban sprawl) to assess aquifer vulnerability under climate change.',
        body_style
    ))
    story.append(Paragraph(
        '<b>Extensibility to Other Natural Resources:</b> The underlying GeoAI microservice architecture is modular by design. By swapping target telemetry layers and retraining the XGBoost/SHAP pipeline, this platform can be readily extended to: (1) Soil Fertility & Agricultural Suitability Mapping, (2) Surface Water Catchment Runoff Modeling, (3) Urban Heat Island Mitigation, and (4) Mineral Prospecting across peninsular basalt regions.',
        body_style
    ))

    for path in output_paths:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        doc = SimpleDocTemplate(
            path,
            pagesize=letter,
            leftMargin=margin,
            rightMargin=margin,
            topMargin=margin,
            bottomMargin=margin
        )
        doc.build(story)
        print(f'Outcomes PDF successfully generated at: {path}')

if __name__ == '__main__':
    targets = [
        'docs/Project_Outcomes_and_Implementation_Report.pdf',
        'frontend/public/Project_Outcomes_and_Implementation_Report.pdf'
    ]
    build_outcomes_pdf(targets)
