#!/bin/bash

# This script will create placeholder images for OTC medicines
# The user will replace these with actual product images later

products=(
  "ibuprofen-200mg:Ibuprofen:Advil/Motrin"
  "acetaminophen-500mg:Acetaminophen:Tylenol"  
  "naproxen-220mg:Naproxen:Aleve"
  "aspirin-325mg:Aspirin:Bayer"
  "omeprazole-20mg:Omeprazole:Prilosec"
  "loratadine-10mg:Loratadine:Claritin"
  "cetirizine-10mg:Cetirizine:Zyrtec"
  "diphenhydramine-25mg:Diphenhydramine:Benadryl"
  "mucinex-400mg:Mucinex:Mucinex"
  "nyquil-cold-flu:NyQuil:Vicks"
  "dayquil-liquicaps:DayQuil:Vicks"
  "loperamide-2mg:Loperamide:Imodium"
  "miralax-laxative:MiraLax:MiraLax"
  "meclizine-25mg:Meclizine:Dramamine"
  "phenylephrine-10mg:Phenylephrine:Sudafed PE"
)

for product in "${products[@]}"; do
  filename=$(echo "$product" | cut -d: -f1)
  name=$(echo "$product" | cut -d: -f2)
  brand=$(echo "$product" | cut -d: -f3)
  
  # Create a simple placeholder image text file that indicates where images should go
  echo "Placeholder for ${name} image - brand: ${brand}" > "images/${filename}-placeholder.txt"
done

echo "Placeholder indicators created in images/ folder"
ls -la images/*placeholder.txt
