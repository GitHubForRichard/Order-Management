import re


def to_snake_case(s):
    s = s.strip()
    s = s.replace("\n", " ")
    s = re.sub(r'(?<!^)(?=[A-Z])', '_', s)
    s = re.sub(r'\s+', '_', s)
    return s.lower()
