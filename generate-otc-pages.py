#!/usr/bin/env python3
"""
Generate comprehensive OTC product pages with:
- Product images
- 800+ words SEO content
- FAQ schema
- Transactional keywords
- Improved footer
"""

import json
from pathlib import Path

# Product data
products = {
    "acetaminophen-500mg": {
        "name": "Acetaminophen 500mg",
        "count": "100ct",
        "brand": "Tylenol",
        "price": "$7–10",
        "title": "Buy Acetaminophen 500mg (100ct) Online | Gentle Pain & Fever Relief | Promedic",
        "meta_desc": "Buy Acetaminophen 500mg tablets (100 count) online USA. Gentle OTC pain reliever and fever reducer, safe for most people. Order acetaminophen from licensed US pharmacy with discreet delivery.",
        "tagline": "Order FDA-Approved Acetaminophen 500mg — Gentle on Stomach, Effective Relief",
        "transactional_kw": ["buy acetaminophen online", "order acetaminophen 500mg", "purchase tylenol generic"]
    },
    "naproxen-220mg": {
        "name": "Naproxen 220mg",
        "count": "80ct",
        "brand": "Aleve",
        "price": "$9–13",
        "title": "Buy Naproxen 220mg (80ct) Online | Long-Lasting Pain Relief | Promedic",
        "meta_desc": "Buy Naproxen 220mg tablets (80 count) online USA. Long-lasting OTC pain relief up to 12 hours. Order naproxen for arthritis, back pain, muscle aches from licensed US pharmacy.",
        "tagline": "Order FDA-Approved Naproxen 220mg — 12-Hour Extended Pain Relief",
        "transactional_kw": ["buy naproxen online", "order naproxen 220mg", "purchase aleve generic"]
    },
    "aspirin-325mg": {
        "name": "Aspirin 325mg",
        "count": "100ct",
        "brand": "Bayer",
        "price": "$6–9",
        "title": "Buy Aspirin 325mg (100ct) Online | Pain Relief & Heart Health | Promedic",
        "meta_desc": "Buy Aspirin 325mg tablets (100 count) online USA. OTC pain relief plus cardiovascular support. Order aspirin for pain, fever, heart health from licensed US pharmacy.",
        "tagline": "Order FDA-Approved Aspirin 325mg — Dual Action for Pain & Heart Health",
        "transactional_kw": ["buy aspirin online", "order aspirin 325mg", "purchase bayer aspirin"]
    },
    "omeprazole-20mg": {
        "name": "Omeprazole 20mg",
        "count": "42ct",
        "brand": "Prilosec OTC",
        "price": "$15–20",
        "title": "Buy Omeprazole 20mg OTC (42ct) Online | Acid Reflux Relief | Promedic",
        "meta_desc": "Buy Omeprazole 20mg OTC tablets (42 count) online USA. Treats frequent heartburn and acid reflux. Order omeprazole prilosec from licensed US pharmacy with fast delivery.",
        "tagline": "Order FDA-Approved Omeprazole 20mg — 24-Hour Heartburn Relief",
        "transactional_kw": ["buy omeprazole online", "order omeprazole 20mg", "purchase prilosec otc"]
    },
    "loratadine-10mg": {
        "name": "Loratadine 10mg",
        "count": "30ct",
        "brand": "Claritin",
        "price": "$10–14",
        "title": "Buy Loratadine 10mg (30ct) Online | 24-Hour Allergy Relief | Promedic",
        "meta_desc": "Buy Loratadine 10mg tablets (30 count) online USA. Non-drowsy 24-hour allergy relief. Order loratadine claritin for seasonal allergies from licensed US pharmacy.",
        "tagline": "Order FDA-Approved Loratadine 10mg — Non-Drowsy Allergy Relief",
        "transactional_kw": ["buy loratadine online", "order loratadine 10mg", "purchase claritin generic"]
    },
    "cetirizine-10mg": {
        "name": "Cetirizine 10mg",
        "count": "45ct",
        "brand": "Zyrtec",
        "price": "$11–15",
        "title": "Buy Cetirizine 10mg (45ct) Online | Allergy Relief OTC | Promedic",
        "meta_desc": "Buy Cetirizine 10mg tablets (45 count) online USA. Powerful OTC allergy relief for seasonal and indoor allergies. Order cetirizine zyrtec from licensed US pharmacy.",
        "tagline": "Order FDA-Approved Cetirizine 10mg — Fast-Acting Allergy Relief",
        "transactional_kw": ["buy cetirizine online", "order cetirizine 10mg", "purchase zyrtec generic"]
    },
    "diphenhydramine-25mg": {
        "name": "Diphenhydramine 25mg",
        "count": "24ct",
        "brand": "Benadryl",
        "price": "$8–11",
        "title": "Buy Diphenhydramine 25mg (24ct) Online | Sleep Aid & Allergy Relief | Promedic",
        "meta_desc": "Buy Diphenhydramine 25mg tablets (24 count) online USA. OTC antihistamine for allergies and sleep aid. Order diphenhydramine benadryl from licensed US pharmacy.",
        "tagline": "Order FDA-Approved Diphenhydramine 25mg — Allergy Relief & Sleep Support",
        "transactional_kw": ["buy diphenhydramine online", "order benadryl 25mg", "purchase antihistamine"]
    },
    "mucinex-400mg": {
        "name": "Mucinex 400mg",
        "count": "20ct",
        "brand": "Mucinex",
        "price": "$14–18",
        "title": "Buy Mucinex 400mg (20ct) Online | Chest Congestion Relief | Promedic",
        "meta_desc": "Buy Mucinex 400mg extended-release tablets (20 count) online USA. Relieves chest congestion and thins mucus. Order mucinex guaifenesin from licensed US pharmacy.",
        "tagline": "Order FDA-Approved Mucinex 400mg — 12-Hour Chest Congestion Relief",
        "transactional_kw": ["buy mucinex online", "order mucinex 400mg", "purchase guaifenesin"]
    },
    "nyquil-cold-flu": {
        "name": "NyQuil Cold & Flu",
        "count": "12oz",
        "brand": "Vicks NyQuil",
        "price": "$12–16",
        "title": "Buy NyQuil Cold & Flu (12oz) Online | Nighttime Relief | Promedic",
        "meta_desc": "Buy NyQuil Cold & Flu liquid (12oz) online USA. Nighttime relief for cold and flu symptoms. Order nyquil for cough, congestion, fever from licensed US pharmacy.",
        "tagline": "Order NyQuil Cold & Flu — Nighttime Multi-Symptom Relief",
        "transactional_kw": ["buy nyquil online", "order nyquil cold flu", "purchase vicks nyquil"]
    },
    "dayquil-liquicaps": {
        "name": "DayQuil Liquicaps",
        "count": "24ct",
        "brand": "Vicks DayQuil",
        "price": "$11–15",
        "title": "Buy DayQuil Liquicaps (24ct) Online | Daytime Cold Relief | Promedic",
        "meta_desc": "Buy DayQuil LiquiCaps (24 count) online USA. Non-drowsy daytime cold and flu relief. Order dayquil for cough, congestion, pain from licensed US pharmacy.",
        "tagline": "Order DayQuil LiquiCaps — Non-Drowsy Daytime Cold Relief",
        "transactional_kw": ["buy dayquil online", "order dayquil liquicaps", "purchase vicks dayquil"]
    },
    "loperamide-2mg": {
        "name": "Loperamide 2mg",
        "count": "24ct",
        "brand": "Imodium",
        "price": "$8–12",
        "title": "Buy Loperamide 2mg (24ct) Online | Anti-Diarrheal Relief | Promedic",
        "meta_desc": "Buy Loperamide 2mg caplets (24 count) online USA. Fast-acting OTC anti-diarrheal medication. Order loperamide imodium from licensed US pharmacy with discreet delivery.",
        "tagline": "Order FDA-Approved Loperamide 2mg — Fast-Acting Anti-Diarrheal",
        "transactional_kw": ["buy loperamide online", "order loperamide 2mg", "purchase imodium generic"]
    },
    "miralax-laxative": {
        "name": "MiraLax Laxative",
        "count": "30 doses",
        "brand": "MiraLax",
        "price": "$16–22",
        "title": "Buy MiraLax Laxative (30 doses) Online | Gentle Constipation Relief | Promedic",
        "meta_desc": "Buy MiraLax powder laxative (30 doses) online USA. Gentle, effective relief from occasional constipation. Order miralax polyethylene glycol from licensed US pharmacy.",
        "tagline": "Order MiraLax Laxative — Gentle, Effective Constipation Relief",
        "transactional_kw": ["buy miralax online", "order miralax laxative", "purchase polyethylene glycol"]
    },
    "meclizine-25mg": {
        "name": "Meclizine 25mg",
        "count": "30ct",
        "brand": "Dramamine",
        "price": "$9–13",
        "title": "Buy Meclizine 25mg (30ct) Online | Motion Sickness Relief | Promedic",
        "meta_desc": "Buy Meclizine 25mg tablets (30 count) online USA. Prevents and treats motion sickness, vertigo, dizziness. Order meclizine dramamine from licensed US pharmacy.",
        "tagline": "Order FDA-Approved Meclizine 25mg — Motion Sickness & Vertigo Relief",
        "transactional_kw": ["buy meclizine online", "order meclizine 25mg", "purchase dramamine generic"]
    },
    "phenylephrine-10mg": {
        "name": "Phenylephrine 10mg",
        "count": "24ct",
        "brand": "Sudafed PE",
        "price": "$8–12",
        "title": "Buy Phenylephrine 10mg (24ct) Online | Nasal Decongestant | Promedic",
        "meta_desc": "Buy Phenylephrine 10mg tablets (24 count) online USA. OTC nasal decongestant for sinus pressure and congestion. Order phenylephrine sudafed pe from licensed US pharmacy.",
        "tagline": "Order FDA-Approved Phenylephrine 10mg — Fast Nasal Decongestant",
        "transactional_kw": ["buy phenylephrine online", "order phenylephrine 10mg", "purchase sudafed pe"]
    }
}

# Generate summary
print("=" * 60)
print("OTC PRODUCT DATA STRUCTURE READY")
print("=" * 60)
print(f"\nTotal products to update: {len(products)}")
print("\nProducts list:")
for slug, data in products.items():
    print(f"  - {data['name']} ({data['count']}) - ${data['price']}")

print("\n✓ Data structure complete")
print("✓ Ready to generate full HTML pages")
print("\nNote: Image files should be added to /images/ folder")
print("      Format: {slug}.webp (e.g., acetaminophen-500mg.webp)")
