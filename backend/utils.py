import re


def to_snake_case(s):
    s = s.strip()  # remove leading/trailing spaces
    s = s.replace("\n", " ")  # replace newlines with space
    s = re.sub(r"\s+", "_", s)  # replace 1+ spaces with single underscore
    return s.lower()
