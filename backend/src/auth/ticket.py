from os import getenv
from base64 import b64decode
from functools import lru_cache
import Cryptodome.Hash.SHA384 as SHA384
import Cryptodome.Signature.pss as pss
import Cryptodome.PublicKey.RSA as RSA
from Cryptodome.Util.number import bytes_to_long

@lru_cache(maxsize=1)
def get_private_key() -> RSA.RsaKey:
    # generate with:
    #   openssl genrsa | grep -Fv '-' | tr -d '\n'
    key = getenv("RSA_KEY")
    if key is None:
        raise ValueError("RSA_KEY is not set")
    return RSA.import_key(b64decode(key))

def get_public_key_pem() -> str:
    return get_private_key().publickey().export_key().decode("utf-8")

def sign_blinded_ticket(blinded_ticket: str) -> str | None:
    try:
        ticket_bytes = bytes.fromhex(blinded_ticket)

        # these are the last two steps of `PSS_SigScheme.sign`. We can't use that
        # function directly since it calls `EMSA-PSS-ENCODE`, but in the case of
        # RSA-PSS the *client* is responsible for calling EMSA-PSS-ENCODE during
        # the blinding operation.
        em_int = bytes_to_long(ticket_bytes)
        signature: bytes = get_private_key()._decrypt_to_bytes(em_int)  # type: ignore

        return signature.hex()
    except:
        return None


def verify_ticket(ticket: str, signature: str) -> bool:
    signature_bytes = bytes.fromhex(signature)
    try:
        pss.new(get_private_key()).verify(
            msg_hash=SHA384.new(ticket.encode("utf-8")),
            signature=signature_bytes
        )
    except ValueError:
        return False
    return True
