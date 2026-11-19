"""Dibuja las seis parejas cartográficas de OBJ-04 desde Natural Earth 1:110m."""
import json
import math
from pathlib import Path
from random import Random

from PIL import Image, ImageChops, ImageColor, ImageDraw, ImageFilter
from importlib import import_module

export_sprite = import_module('preparar-arte').export_sprite
FOLDER = Path(__file__).resolve().parent
MASTER = FOLDER / 'maestras-obj-04'
SOURCE = json.loads((MASTER / 'ne_110m_land.geojson').read_text())
PLAN = json.loads((FOLDER / 'obj-04.json').read_text())['cartography']
COAST = '#555b49'
GRID = '#a6a48c'


def polygons():
    for feature in SOURCE['features']:
        geometry = feature['geometry']
        shapes = geometry['coordinates']
        if geometry['type'] == 'Polygon':
            shapes = [shapes]
        yield from shapes


LAND = tuple(polygons())


def outline(draw, ring, project, color):
    points = [project(lon, lat) for lon, lat in ring]
    draw.polygon(points, fill=color)
    draw.line(points, fill=COAST, width=2, joint='curve')


def rectangular(extent, fill):
    west, south, east, north = extent
    ratio = (east - west) * max(.62, math.cos(math.radians((south + north) / 2))) / (north - south)
    width, height = round(575 * min(1, ratio)), round(575 * min(1, 1 / ratio))
    image = Image.new('RGB', (width, height), '#d0c8a9')
    draw = ImageDraw.Draw(image)

    def project(lon, lat):
        return ((lon - west) * width / (east - west), (north - lat) * height / (north - south))

    for lat in range(-80, 81, 10):
        draw.line([project(west, lat), project(east, lat)], fill=GRID)
    for lon in range(-180, 211, 15):
        draw.line([project(lon, south), project(lon, north)], fill=GRID)
    for rings in LAND:
        for shift in (-360, 0, 360):
            ring = rings[0]
            if max(p[0] for p in ring) + shift < west or min(p[0] for p in ring) + shift > east:
                continue
            outline(draw, ring, lambda lon, lat: project(lon + shift, lat), fill)
            for hole in rings[1:]:
                draw.polygon([project(lon + shift, lat) for lon, lat in hole], fill='#d0c8a9')
    draw.rectangle((0, 0, width - 1, height - 1), outline='#766e53', width=2)
    return image


def polar_inset(north, color):
    side = 278
    radius = 134
    center = side / 2
    layer = Image.new('RGB', (side, side), '#c1c4b3')
    draw = ImageDraw.Draw(layer)

    def project(lon, lat):
        co_lat = 90 - lat if north else 90 + lat
        distance = radius * math.tan(math.radians(co_lat / 2)) / math.tan(math.radians(22.5))
        angle = math.radians(lon)
        return center + distance * math.sin(angle), center + distance * math.cos(angle) * (1 if north else -1)

    for ring in LAND:
        if any((lat if north else -lat) >= 44 for lon, lat in ring[0]):
            outline(draw, ring[0], project, color)
    for latitude in (50, 60, 70, 80):
        x, y = project(0, latitude if north else -latitude)
        r = abs(y - center)
        draw.ellipse((center-r, center-r, center+r, center+r), outline='#8d9588')
    for longitude in range(0, 360, 30):
        draw.line([(center, center), project(longitude, 45 if north else -45)], fill='#8d9588')
    clipped = Image.new('L', (side, side))
    ImageDraw.Draw(clipped).ellipse((center-radius, center-radius, center+radius, center+radius), fill=255)
    draw.ellipse((center-radius, center-radius, center+radius, center+radius), outline=COAST, width=2)
    layer.putalpha(clipped)
    return layer


def polar(color):
    image = Image.new('RGBA', (575, 292), '#d9c9a8')
    for x, north in [(4, True), (293, False)]:
        image.alpha_composite(polar_inset(north, color), (x, 7))
    return image


def paper(panel, seed):
    margin = 19
    width, height = panel.width + margin * 2, panel.height + margin * 2
    image = Image.new('RGB', (width, height), '#d9c59e')
    image.paste(panel, (margin, margin), panel.getchannel('A') if panel.mode == 'RGBA' else None)
    random = Random(seed)
    coarse = Image.frombytes('L', (35, 35), bytes(random.randrange(106, 150) for _ in range(35 * 35)))
    grain = Image.frombytes('L', image.size, bytes(random.randrange(111, 144) for _ in range(width * height)))
    texture = Image.blend(coarse.resize(image.size, Image.Resampling.BICUBIC), grain, .46)
    rgb = [ImageChops.add(channel, texture, offset=-127) for channel in image.split()]
    image = Image.merge('RGB', rgb)
    draw = ImageDraw.Draw(image, 'RGBA')
    for x in (width // 3, width * 2 // 3):
        draw.line((x, 6, x+2, height-5), fill=(107, 87, 54, 58), width=2)
        draw.line((x+3, 6, x+5, height-5), fill=(247, 231, 189, 70), width=2)
    edges = Image.new('L', image.size)
    perimeter = [(5, 8), (width*.25, 5), (width*.57, 7), (width*.84, 3), (width-6, 6),
                 (width-3, height*.47), (width-6, height-6), (width*.58, height-3),
                 (width*.32, height-7), (5, height-5), (3, height*.45)]
    draw.line(perimeter + [perimeter[0]], fill=(112, 86, 47, 106), width=2)
    ImageDraw.Draw(edges).polygon(perimeter, fill=255)
    image.putalpha(edges.filter(ImageFilter.GaussianBlur(.65)))
    return image


def make_fragment(map_image, points):
    cut = Image.new('L', map_image.size)
    border = [(round(x * map_image.width), round(y * map_image.height)) for x, y in points]
    ImageDraw.Draw(cut).polygon(border, fill=255)
    result = map_image.copy()
    paint = ImageDraw.Draw(result, 'RGBA')
    paint.line(border + [border[0]], fill='#927650', width=2)
    result.putalpha(ImageChops.multiply(map_image.getchannel('A'), cut.filter(ImageFilter.GaussianBlur(.5))))
    return result.crop(result.getbbox())


for number, region in enumerate(PLAN):
    color = ImageColor.getrgb(region['land'])
    chart = rectangular(region['extent'], color) if 'extent' in region else polar(color)
    master = paper(chart, 1842 + number)
    master.save(MASTER / (region['id'] + '.png'))
    fragment = make_fragment(master, region['fragment'])
    export_sprite(region['id'], master.crop(master.getbbox()))
    export_sprite(region['id'] + '_piece', fragment)
