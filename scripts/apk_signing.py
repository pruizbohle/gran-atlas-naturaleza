"""Read PUBLIC signing-certificate fingerprints, without installing an APK."""
import hashlib,re,struct,subprocess,zipfile
from pathlib import Path

def signer_fingerprints(apk):
    with zipfile.ZipFile(apk) as archive:
        signatures=[name for name in archive.namelist() if name.upper().startswith('META-INF/') and name.upper().endswith(('.RSA','.DSA','.EC'))]
        if signatures:
            certificates=[]
            for name in signatures:
                pem=subprocess.run(['openssl','pkcs7','-inform','DER','-print_certs'],input=archive.read(name),stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout
                for cert in re.findall(b'-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----',pem,re.S):
                    der=subprocess.run(['openssl','x509','-outform','DER'],input=cert,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout
                    certificates.append(hashlib.sha256(der).hexdigest())
            if certificates:return sorted(set(certificates))
    # v2/v3-only APKs: locate the signing block before the central directory.
    data=Path(apk).read_bytes();eocd=data.rfind(b'PK\x05\x06');assert eocd>=0,'Missing ZIP footer'
    central=struct.unpack_from('<I',data,eocd+16)[0];assert data[central-16:central]==b'APK Sig Block 42','Missing signing block'
    size=struct.unpack_from('<Q',data,central-24)[0];start=central-size-8
    assert struct.unpack_from('<Q',data,start)[0]==size,'Invalid signing block'
    def lp(blob,position=0):
        length=struct.unpack_from('<I',blob,position)[0];end=position+4+length
        assert end<=len(blob),'Invalid length-prefixed signing data'
        return blob[position+4:end],end
    position=start+8
    while position<central-24:
        length=struct.unpack_from('<Q',data,position)[0];identifier=struct.unpack_from('<I',data,position+8)[0]
        if identifier in (0x7109871a,0xf05368c0):
            value=data[position+12:position+8+length];signers,_=lp(value);index=0;result=[]
            while index<len(signers):
                signer,index=lp(signers,index);signed,_=lp(signer);_,at=lp(signed);certificates,_=lp(signed,at);certificate,_=lp(certificates)
                result.append(hashlib.sha256(certificate).hexdigest())
            return sorted(set(result))
        position+=8+length
    raise ValueError('No supported signing certificate found')
