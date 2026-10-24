#!/usr/bin/env python3
"""Parse phpMyAdmin mysqldump INSERTs → JSON (no MySQL server required)."""
from __future__ import annotations

import json
import re
import sys
from typing import Any

TABLES = [
    "settings",
    "plans",
    "users",
    "user_plans",
    "deposits",
    "withdrawals",
]


def parse_sql_value(s: str, i: int) -> tuple[Any, int]:
    while i < len(s) and s[i] in " \t\n\r":
        i += 1
    if i >= len(s):
        return None, i
    if s.startswith("NULL", i) and (i + 4 >= len(s) or s[i + 4] in ",)"):
        return None, i + 4
    if s[i] == "'":
        i += 1
        chars: list[str] = []
        while i < len(s):
            c = s[i]
            if c == "\\" and i + 1 < len(s):
                chars.append(s[i + 1])
                i += 2
                continue
            if c == "'":
                if i + 1 < len(s) and s[i + 1] == "'":
                    chars.append("'")
                    i += 2
                    continue
                i += 1
                break
            chars.append(c)
            i += 1
        return "".join(chars), i
    start = i
    while i < len(s) and s[i] not in ",)":
        i += 1
    raw = s[start:i].strip()
    if not raw:
        return None, i
    if re.fullmatch(r"-?\d+", raw):
        return int(raw), i
    if re.fullmatch(r"-?\d+\.\d+", raw):
        return float(raw), i
    return raw, i


def parse_row(s: str, i: int) -> tuple[list[Any], int]:
    while i < len(s) and s[i] in " \t\n\r":
        i += 1
    if i >= len(s) or s[i] != "(":
        return [], i
    i += 1
    vals: list[Any] = []
    while i < len(s):
        while i < len(s) and s[i] in " \t\n\r":
            i += 1
        if i < len(s) and s[i] == ")":
            i += 1
            break
        v, i = parse_sql_value(s, i)
        vals.append(v)
        while i < len(s) and s[i] in " \t\n\r":
            i += 1
        if i < len(s) and s[i] == ",":
            i += 1
    return vals, i


def extract_table(content: str, table: str) -> list[dict[str, Any]]:
    pattern = rf"INSERT INTO `{re.escape(table)}` \(([^)]+)\) VALUES\s*(.+?);"
    rows: list[dict[str, Any]] = []
    for m in re.finditer(pattern, content, re.DOTALL | re.IGNORECASE):
        cols = [c.strip().strip("`") for c in m.group(1).split(",")]
        blob = m.group(2)
        i = 0
        while i < len(blob):
            while i < len(blob) and blob[i] in " \t\n\r,":
                i += 1
            if i >= len(blob):
                break
            vals, i = parse_row(blob, i)
            if vals and len(vals) == len(cols):
                rows.append(dict(zip(cols, vals)))
    return rows


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: extract_mysql_dump.py path/to/dump.sql", file=sys.stderr)
        sys.exit(1)
    path = sys.argv[1]
    content = open(path, encoding="utf-8", errors="replace").read()
    out = {t: extract_table(content, t) for t in TABLES}
    json.dump(out, sys.stdout)


if __name__ == "__main__":
    main()
