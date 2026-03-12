def sumator(grades=None, **_):
    total = 0
    for g in grades:
        total += g
    return float(total) / float(len(grades)) if len(grades) > 0 else 0.0