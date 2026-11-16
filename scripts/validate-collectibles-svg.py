import json,xml.etree.ElementTree as ET
from pathlib import Path
folder=Path('www/assets/collectibles-draft');files=sorted(folder.glob('*.svg'));assert len(files)==240
allowed={'svg','title','desc','g','path','ellipse','rect','text'}
for file in files:
 root=ET.parse(file).getroot();assert root.attrib['viewBox']=='0 0 100 100'
 for node in root.iter():
  tag=node.tag.split('}')[-1];assert tag in allowed,(file,tag)
  for key,value in node.attrib.items():
   assert key!='id' and not key.startswith('on') and key not in ['href','src'],(file,key)
   assert 'url(' not in value and ('http' not in value),(file,key)
  assert not ('NaN'in ''.join(node.attrib.values())or'undefined'in ''.join(node.attrib.values())),file
print(json.dumps({'parsedSVG':len(files),'externalResources':0,'svgIds':0,'valid':True}))
Path('docs/art-col-01/xml-report.json').write_text(json.dumps({'parsedSVG':len(files),'externalResources':0,'svgIds':0,'valid':True},indent=2)+'\n')
