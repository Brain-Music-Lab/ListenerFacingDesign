from pathlib import Path
import os


ASSETS_DIR = os.path.join(Path(__file__).parent.parent, "assets")

def consent_form_contents():
    with open(os.path.join(ASSETS_DIR, "consent-form-contents.txt")) as f:
        consent = f.read()

    return consent


def consent_form_title():
    with open(os.path.join(ASSETS_DIR, "consent-form-title.txt")) as f:
        title = f.read()

    return title
