# Converts Meeting-in-a-Pocket-3x5.docx into public/readings.html.
# One-off generator: walks the docx paragraphs in order, turns Heading1 into
# <section>s (with a table of contents), Heading2/3 into sub-headings, runs of
# "1. ..." / "a) ..." lines into lists, and short prayer lines into verse blocks.
import html, re, sys, zipfile

DOCX, OUT = sys.argv[1], sys.argv[2]

x = zipfile.ZipFile(DOCX).read("word/document.xml").decode("utf-8")
paras = []
for p in re.findall(r"<w:p[ >].*?</w:p>", x, re.S):
    st = re.search(r'<w:pStyle w:val="([^"]+)"', p)
    text = html.unescape("".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", p))).strip()
    paras.append((st.group(1) if st else "Normal", text))

# Sections whose body lines are short prayer/verse lines -> keep line breaks.
VERSE = {"Serenity Prayer", "Prayer of Saint Francis of Assisi", "Gratitude",
         "The Lord’s Prayer", "How to Have a Good Day", "The Four Absolutes"}
# Headings that continue the previous section rather than starting a new one.
MERGE = {"The Twelve Traditions (cont)", "the “Big Book”"}

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

e = html.escape
sections = []            # list of (id, title, [html chunks])
cover = []               # Subtitle/Title lines before the first heading

for style, text in paras:
    if style == "Heading1":
        if text in MERGE:
            if text == "the “Big Book”":   # "AN INDEX TO Alcoholics Anonymous" + "the Big Book"
                sid, title, body = sections[-1]
                sections[-1] = (sid, "An Index to the Big Book", body)
            continue
        title = text.strip()
        if title.endswith(".") and not title.endswith("A.A."):   # "ABCs of Meeting Topics." -> no dot
            title = title[:-1]
        sections.append((slug(title), title, []))
        continue
    if not sections:
        if text:
            cover.append((style, text))
        continue
    if not text:
        continue
    body = sections[-1][2]
    if style == "Heading2":
        body.append(f"<h3>{e(text)}</h3>")
    elif style == "Heading3":
        body.append(f"<h4>{e(text)}</h4>")
    elif style == "Subtitle":
        body.append(f'<p class="lead">{e(text)}</p>')
    else:
        body.append(("P", text))

def render(sid, title, body):
    """Group raw paragraph tuples into lists / verse / dl as appropriate."""
    out, i = [], 0
    verse = title in VERSE
    while i < len(body):
        item = body[i]
        if isinstance(item, str):
            out.append(item); i += 1; continue
        t = item[1]
        # Numbered list: "1. text" runs
        if re.match(r"^\d+\.\s", t):
            items = []
            while i < len(body) and not isinstance(body[i], str) and re.match(r"^\d+\.\s", body[i][1]):
                items.append(re.sub(r"^\d+\.\s*", "", body[i][1])); i += 1
            start = re.match(r"^(\d+)\.", t).group(1)
            attr = f' start="{start}"' if start != "1" else ""
            out.append(f"<ol{attr}>" + "".join(f"<li>{e(s)}</li>" for s in items) + "</ol>")
            continue
        # Lettered list: "a) text"
        if re.match(r"^[a-z]\)\s", t):
            items = []
            while i < len(body) and not isinstance(body[i], str) and re.match(r"^[a-z]\)\s", body[i][1]):
                items.append(body[i][1][3:]); i += 1
            out.append('<ol type="a">' + "".join(f"<li>{e(s)}</li>" for s in items) + "</ol>")
            continue
        # Keyword index: "Term  description.  reference" (two-space separated)
        if sid == "keyword-subject-index" and "  " in t:
            parts = [s.strip() for s in re.split(r"\s{2,}", t)]
            term, desc, ref = (parts + ["", ""])[:3]
            out.append(f'<div class="kw"><dt>{e(term)}</dt><dd>{e(desc)}'
                       + (f' <span class="ref">{e(ref)}</span>' if ref and ref != "—" else "")
                       + "</dd></div>")
            i += 1; continue
        # Chapter map lines "Chapter — pages"
        if sid == "chapter-appendix-map" and " — " in t:
            name, pages = t.rsplit(" — ", 1)
            out.append(f'<div class="kw"><dt>{e(name)}</dt><dd>{e(pages)}</dd></div>')
            i += 1; continue
        # Attribution lines like "Alcoholics Anonymous p. 88"
        if re.match(r"^Alcoholics Anonymous p", t):
            out.append(f'<p class="cite">{e(t)}</p>'); i += 1; continue
        if verse:
            lines = []
            while i < len(body) and not isinstance(body[i], str):
                lines.append(e(body[i][1])); i += 1
            out.append('<p class="verse">' + "<br>\n".join(lines) + "</p>")
            continue
        out.append(f"<p>{e(t)}</p>"); i += 1
    html_body = "\n".join(out)
    # Wrap consecutive keyword rows in a <dl>
    html_body = re.sub(r'((?:<div class="kw">.*?</div>\n?)+)', r"<dl>\n\1</dl>", html_body)
    return html_body

toc, secs = [], []
for sid, title, body in sections:
    if sid == "names-numbers":
        # Blank lines in the booklet for phone numbers -> a private, on-device note.
        content = ('<p class="hint">Jot down phone numbers here. They stay on this phone only '
                   '(saved in this browser, never sent anywhere).</p>\n'
                   '<label class="sr-only" for="names">Names and numbers</label>\n'
                   '<textarea id="names" rows="10" placeholder="Name – number"></textarea>\n'
                   '<p class="hint" id="namesStatus" role="status"></p>')
    else:
        content = render(sid, title, body)
    toc.append(f'<li><a href="#{sid}">{e(title)}</a></li>')
    secs.append(f'<section id="{sid}">\n<h2>{e(title)}</h2>\n{content}\n'
                f'<p class="top"><a href="#contents">Back to contents</a></p>\n</section>')

cover_html = "\n".join(f'<p class="tag">{e(t)}</p>' for s, t in cover if s == "Subtitle")

page = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Meeting in a Pocket</title>
  <!-- Generated from Meeting-in-a-Pocket-3x5.docx. Relative paths so it works under /aa/. -->
  <link rel="stylesheet" href="style.css">
  <script src="readings.js" defer></script>
</head>
<body>
  <header class="bar">
    <a class="back" href="./">Home</a>
    <h1>Meeting in a Pocket</h1>
  </header>
  <main>
    <div class="cover">
{cover_html}
    </div>
    <p><a class="btn" href="signoff.html">Sign off a meeting</a></p>

    <nav id="contents" aria-label="Contents">
      <details open>
        <summary>Contents</summary>
        <ol class="toc">
{chr(10).join(toc)}
        </ol>
      </details>
    </nav>

{chr(10).join(secs)}

    <footer>
      <p><a href="files/Meeting-in-a-Pocket-3x5.docx" download>Download the printable booklet (Word, 3×5)</a></p>
    </footer>
  </main>
</body>
</html>
"""
open(OUT, "w", encoding="utf-8", newline="\n").write(page)
print("sections:", len(sections))
