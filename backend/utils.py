import re


def to_snake_case(text: str) -> str:
    # Replace spaces or hyphens with underscores
    text = re.sub(r'[\s\-]+', '_', text)

    # Insert underscore before any uppercase letter (not at start)
    text = re.sub(r'(?<!^)(?=[A-Z])', '_', text)

    # Lowercase everything
    text = text.lower()

    # Remove any duplicate underscores
    text = re.sub(r'_+', '_', text)

    # Strip leading/trailing underscores
    return text.strip('_')
