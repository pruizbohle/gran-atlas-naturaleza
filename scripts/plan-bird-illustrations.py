#!/usr/bin/env python3
"""Assign the live catalogue's birds to the five planned scientific illustration editions."""
import argparse
import collections
import json
from pathlib import Path

from openpyxl import load_workbook


IOC_NAMES = {
    "Accipiter gentilis": "Astur gentilis",
    "Anthropoides virgo": "Grus virgo",
    "Haliaeetus vociferoides": "Icthyophaga vociferoides",
    "Musophaga violacea": "Tauraco violaceus",
    "Falcipennis canadensis": "Canachites canadensis",
    "Cicinnurus respublica": "Diphyllodes respublica",
    "Drepanoptila holosericea": "Ptilinopus holosericea",
}
RAPTORS = {"Accipitriformes", "Falconiformes", "Strigiformes"}
WATERBIRDS = {
    "Anseriformes", "Charadriiformes", "Ciconiiformes", "Gaviiformes", "Gruiformes",
    "Pelecaniformes", "Phoenicopteriformes", "Podicipediformes", "Procellariiformes",
    "Sphenisciformes", "Suliformes",
}
GROUND_BIRDS = {
    "Apterygiformes", "Cariamiformes", "Casuariiformes", "Eurypygiformes",
    "Galliformes", "Rheiformes", "Struthioniformes",
}
GROUND_EXCEPTIONS = {
    "Geococcyx californianus": "El correcaminos se desplaza y caza principalmente en el suelo.",
    "Gallirallus australis": "El weka es un rálido forestal terrestre y no volador.",
    "Porphyrio hochstetteri": "El takahē es un rálido no volador de pastizal.",
    "Geronticus eremita": "El ibis eremita se alimenta principalmente en terrenos abiertos y secos.",
}
FISHING_KINGFISHERS = {"Alcedo atthis", "Ceryle rudis", "Corythornis cristatus"}
COAST = {
    "costa", "costa_marina", "arrecife", "mar_austral", "oceano_abierto",
    "plataforma_marina", "archipielago", "agua_polar", "banquisa_artica",
    "banquisa_antartica", "costa_antartica",
}
EDITIONS = {
    "4.7.0": "Rapaces diurnas y nocturnas",
    "4.7.1": "Aves acuáticas y marinas",
    "4.7.2": "Aves terrestres, corredoras y galliformes",
    "4.7.3": "Arborícolas y demás no paseriformes",
    "4.7.4": "Paseriformes",
}
WORKBOOK = Path("docs/gm02/scientific-evidence/ioc-master-15.2.xlsx")


def ioc_names():
    order = family = genus = None
    workbook = load_workbook(WORKBOOK, read_only=True, data_only=True)
    data = {}
    for row in workbook["Master"].iter_rows(min_row=5, values_only=True):
        _, _, new_order, new_family, _, new_genus, epithet, *_ = row
        order = new_order.title() if new_order else order
        family = new_family or family
        genus = new_genus or genus
        if epithet:
            data[f"{genus} {epithet}"] = (order, family)
    workbook.close()
    return data


def assign(latin, order):
    if order == "Passeriformes":
        return "4.7.4", None
    if order in RAPTORS:
        return "4.7.0", None
    if latin in GROUND_EXCEPTIONS:
        return "4.7.2", GROUND_EXCEPTIONS[latin]
    if order in GROUND_BIRDS:
        return "4.7.2", None
    if latin in FISHING_KINGFISHERS:
        return "4.7.1", "Martín pescador asociado al agua por su forma de alimentación."
    if order in WATERBIRDS:
        return "4.7.1", None
    return "4.7.3", None


def summarize(records):
    pigment = collections.Counter(kind for row in records for kind in row["pigmentation"])
    families = collections.Counter(row["family"] for row in records)
    dimorphic = sum(row["dimorphism"] for row in records)
    legends = [row["legendary"]["name"] for row in records if row["legendary"]]
    return {
        "species": len(records), "families": dict(sorted(families.items())),
        "pigmentation": dict(sorted(pigment.items())), "dimorphicSpecies": dimorphic,
        "legendary": legends, "estimatedPlates": len(records) + pigment.total() + 2 * dimorphic + len(legends),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("catalog", type=Path, help="Aves extraídas con audit-scientific-catalog.cjs --birds")
    args = parser.parse_args()
    birds = json.loads(args.catalog.read_text())
    ioc = ioc_names()
    lots = collections.defaultdict(list)
    for bird in sorted(birds, key=lambda row: row["latin"].casefold()):
        binomial = " ".join(bird["latin"].split()[:2])
        accepted = IOC_NAMES.get(binomial, binomial)
        order, family = ioc[accepted]
        edition, placement = assign(binomial, order)
        entry = {**bird, "order": order, "family": family, "iocTaxon": accepted}
        if placement:
            entry["placement"] = placement
        if edition == "4.7.1":
            water = next((h for h in bird["habitats"] if h in COAST or h in {"rio", "humedal"}), "")
            pelagic = order in {"Procellariiformes", "Sphenisciformes"} or family in {"Sulidae", "Fregatidae"}
            entry["wave"] = "Marinas y costeras" if pelagic or water in COAST else "Ribereñas y humedales"
        if bird["legendary"]:
            entry["legendaryFile"] = f"{bird['id']}--{bird['legendary']['id']}.webp"
        lots[edition].append(entry)
    total = [row for records in lots.values() for row in records]
    if len({row["id"] for row in total}) != len(birds):
        raise ValueError("Cada ID del catálogo debe figurar una sola vez")
    editions = {}
    for edition, title in EDITIONS.items():
        entries = lots[edition]
        summary = summarize(entries)
        if edition == "4.7.1":
            waves = sorted({row["wave"] for row in entries})
            summary["internalWaves"] = {wave: summarize([row for row in entries if row["wave"] == wave]) for wave in waves}
        editions[edition] = {"title": title, **summary, "inventory": entries}
    print(json.dumps({
        "source": {"taxonomy": "IOC World Bird List 15.2", "doi": "10.14344/IOC.ML.15.2", "synonymMapping": IOC_NAMES},
        "summary": summarize(total), "editions": editions,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
