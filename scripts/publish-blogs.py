"""
Auto-publish scheduled blog posts to blog/index.html
Runs daily via GitHub Actions. Adds blog cards for any post
whose publish_date is today or earlier and not yet in index.
"""
import json
import re
from datetime import date

SCHEDULE_FILE = "blog-schedule.json"
INDEX_FILE = "blog/index.html"
INSERTION_MARKER = "<!-- END BLOG GRID -->"

with open(SCHEDULE_FILE) as f:
    schedule = json.load(f)

with open(INDEX_FILE) as f:
    index_html = f.read()

today = date.today()
added = 0

for blog in schedule["blogs"]:
    publish_date = date.fromisoformat(blog["publish_date"])
    slug = blog["slug"]
    link = f"/blog/{slug}"

    # Skip if not yet due
    if publish_date > today:
        continue

    # Skip if already in index
    if link in index_html:
        continue

    # Format date nicely: "July 15, 2026"
    formatted_date = publish_date.strftime("%B %-d, %Y")

    card = f"""
            <div class="blog-card">
                <span class="blog-card-badge">{blog['badge']}</span>
                <div class="blog-card-body">
                    <p class="blog-card-meta">{formatted_date} &nbsp;·&nbsp; {blog['read_time']}</p>
                    <h2>{blog['title']}</h2>
                    <p>{blog['excerpt']}</p>
                    <a href="{link}" class="blog-card-link">Read Article &rarr;</a>
                </div>
            </div>"""

    index_html = index_html.replace(
        INSERTION_MARKER,
        card + "\n            " + INSERTION_MARKER
    )
    print(f"Published: {slug} ({formatted_date})")
    added += 1

if added > 0:
    with open(INDEX_FILE, "w") as f:
        f.write(index_html)
    print(f"\nTotal published today: {added}")
else:
    print("No new blogs due for publication today.")
