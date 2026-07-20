#!/bin/bash

# This script will copy the improved structure to all OTC product pages
cd /home/vercel-sandbox/proomedics-website

echo "✓ Ibuprofen already updated"
echo "Updating remaining 14 OTC products..."

# Update acetaminophen
sed -i 's|Buy Acetaminophen 500mg (100ct) Online | OTC Pain Reliever & Fever Reducer | Promedic|Buy Acetaminophen 500mg (100ct) Online | Gentle Pain & Fever Relief | Promedic|g' acetaminophen-500mg.html

# Update naproxen
sed -i 's|<title>.*</title>|<title>Buy Naproxen 220mg (80ct) Online | Long-Lasting Pain Relief | Promedic</title>|g' naproxen-220mg.html

# Update aspirin
sed -i 's|<title>.*</title>|<title>Buy Aspirin 325mg (100ct) Online | Pain Relief & Heart Health | Promedic</title>|g' aspirin-325mg.html

# Update omeprazole  
sed -i 's|<title>.*</title>|<title>Buy Omeprazole 20mg OTC (42ct) Online | Acid Reflux Relief | Promedic</title>|g' omeprazole-20mg.html

# Update loratadine
sed -i 's|<title>.*</title>|<title>Buy Loratadine 10mg (30ct) Online | 24-Hour Allergy Relief | Promedic</title>|g' loratadine-10mg.html

# Update cetirizine
sed -i 's|<title>.*</title>|<title>Buy Cetirizine 10mg (45ct) Online | Allergy Relief OTC | Promedic</title>|g' cetirizine-10mg.html

# Update diphenhydramine
sed -i 's|<title>.*</title>|<title>Buy Diphenhydramine 25mg (24ct) Online | Sleep Aid & Allergy Relief | Promedic</title>|g' diphenhydramine-25mg.html

# Update mucinex
sed -i 's|<title>.*</title>|<title>Buy Mucinex 400mg (20ct) Online | Chest Congestion Relief | Promedic</title>|g' mucinex-400mg.html

# Update nyquil
sed -i 's|<title>.*</title>|<title>Buy NyQuil Cold & Flu (12oz) Online | Nighttime Relief | Promedic</title>|g' nyquil-cold-flu.html

# Update dayquil
sed -i 's|<title>.*</title>|<title>Buy DayQuil Liquicaps (24ct) Online | Daytime Cold Relief | Promedic</title>|g' dayquil-liquicaps.html

# Update loperamide
sed -i 's|<title>.*</title>|<title>Buy Loperamide 2mg (24ct) Online | Anti-Diarrheal Relief | Promedic</title>|g' loperamide-2mg.html

# Update miralax
sed -i 's|<title>.*</title>|<title>Buy MiraLax Laxative (30 doses) Online | Gentle Constipation Relief | Promedic</title>|g' miralax-laxative.html

# Update meclizine
sed -i 's|<title>.*</title>|<title>Buy Meclizine 25mg (30ct) Online | Motion Sickness Relief | Promedic</title>|g' meclizine-25mg.html

# Update phenylephrine
sed -i 's|<title>.*</title>|<title>Buy Phenylephrine 10mg (24ct) Online | Nasal Decongestant | Promedic</title>|g' phenylephrine-10mg.html

echo "✓ All title tags updated"

