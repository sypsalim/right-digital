import os
import base64

def build():
    cwd = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(cwd, "index.html")
    css_path = os.path.join(cwd, "src/css/index.css")
    js_path = os.path.join(cwd, "src/js/app.js")
    logo_path = os.path.join(cwd, "src/assets/logo.png")
    logo_print_path = os.path.join(cwd, "src/assets/logo_print.png")
    standalone_path = os.path.join(cwd, "index_standalone.html")

    # Read base files
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()

    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()

    # Read and base64-encode logo
    with open(logo_path, "rb") as f:
        logo_data = f.read()
        logo_base64 = base64.b64encode(logo_data).decode("utf-8")
        logo_data_uri = f"data:image/png;base64,{logo_base64}"

    # Read and base64-encode print logo
    with open(logo_print_path, "rb") as f:
        logo_print_data = f.read()
        logo_print_base64 = base64.b64encode(logo_print_data).decode("utf-8")
        logo_print_data_uri = f"data:image/png;base64,{logo_print_base64}"

    # Replace CSS link (supporting optional version query string)
    import re
    if re.search(r'<link rel="stylesheet" href="src/css/index\.css[^"]*">', html):
        html = re.sub(r'<link rel="stylesheet" href="src/css/index\.css[^"]*">', f"<style>\n{css}\n</style>", html)
    else:
        print("Warning: CSS link not found")

    # Replace JS link (supporting optional version query string)
    if re.search(r'<script src="src/js/app\.js[^"]*"></script>', html):
        html = re.sub(r'<script src="src/js/app\.js[^"]*"></script>', f"<script>\n{js}\n</script>", html)
    else:
        print("Warning: JS link not found")

    # Inline the logo images (replaces all occurrences with the base64 Data URIs)
    html = html.replace("src/assets/logo.png", logo_data_uri)
    html = html.replace("src/assets/logo_print.png", logo_print_data_uri)

    with open(standalone_path, "w", encoding="utf-8") as f:
        f.write(html)

    print("index_standalone.html built successfully with base64 logo inlined!")

if __name__ == "__main__":
    build()
