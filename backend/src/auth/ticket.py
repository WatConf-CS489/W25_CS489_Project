import os
import Cryptodome.Hash.SHA384 as SHA384
import Cryptodome.Signature.pss as pss
import Cryptodome.PublicKey.RSA as RSA
from Cryptodome.Util.number import bytes_to_long
from src.base import app

rsa_key_b64 = os.getenv("RSA_KEY")
rsa_key_pem = f"""-----BEGIN RSA PRIVATE KEY-----
{rsa_key_b64}
-----END RSA PRIVATE KEY-----
"""
rsa_key = RSA.import_key(rsa_key_pem)

scheme = pss.new(rsa_key)


def sign_blinded_ticket(blinded_ticket: str) -> str:
    ticket_bytes = bytes.fromhex(blinded_ticket)

    # these are the last two steps of `PSS_SigScheme.sign`. We can't use that
    # function directly since it calls `EMSA-PSS-ENCODE`, but in the case of
    # RSA-PSS the *client* is responsible for calling EMSA-PSS-ENCODE during
    # the blinding operation.
    em_int = bytes_to_long(ticket_bytes)
    signature: bytes = rsa_key._decrypt_to_bytes(em_int)  # type: ignore

    return signature.hex()


def verify_ticket(ticket: str, signature: str) -> bool:
    signature_bytes = bytes.fromhex(signature)
    try:
        scheme.verify(
            msg_hash=SHA384.new(ticket.encode("utf-8")),
            signature=signature_bytes
        )
    except ValueError:
        return False
    return True
