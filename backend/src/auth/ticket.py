import Cryptodome.Hash.SHA384 as SHA384
import Cryptodome.Signature.pss as pss
import Cryptodome.PublicKey.RSA as RSA
from Cryptodome.Util.number import bytes_to_long
from src.base import app

# TODO: move to env secrets
rsa_key_pem = """-----BEGIN RSA PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClCYXRKmshg88eAm4YnFgRVnsVXakPL+xfDDQ6rsx1nN9bYNVnLjIKpaBQUMi7doYjHFemN4XnY9rUgre8wWt/zrT0IgEe0d3ad1oT8IbIkztqZjDINQ7TZ1hletaJsmR3VfPrViniA0XXklR+3m3Xw9qRxbyaiPplaBcdd1hDwgrkC8hbFMM8ESuwOTs65peVa1CwpAEacayy9RmKsxxzJM+aHJ7kqPpzbtzQzFYbbIXCKMpgYyGQsFToksf+4+Ihir5muBP9hlIfDABmkqIIAWXOU+BGTwl/+gle2M8xKsiBe+NQrMu4zD5RzXNDtseRbttxXS1FyhvXSFEX1MwxAgMBAAECggEATqVDkiHrLGzyAaR5z5uNcjGqdMuNuTGGq+KWbxKGV1O6soJqH4HJkf5Mb4mXppG8KTYj5I8X7eTNTrC+GyJ29lBMNfyQWR38YVO35sGbkTBsQ29QNs/l8UMRwkYvvy12J9Ibax3D1rLlkO1n+49Ge+gWm5nFn0TAQhvAzCdntd2ZDTnnsaWYwOqojItxj3aSsiVFxUHe/l38lOKkJX7BkT/yIW0ZvIXs6aOGIALzZOrs9lj9777oV356gnjt0YDDxZMgr8os4aiCGeuYO/TnP18TU4Ks4yPe/5h27nf0oOQo6U1vUvfnNQPQexm6IkroJlLpCxvy802E+N0kXAO8awKBgQDgHo+3JDSH5ZR84GmfhfRvujAAhbsuJY6o3W1tLC0Y648OkXQYwWviX3iAvmWMH0SpZo4LT3/Q/ek13Olfnbmyg7FeehmqZd1Bn17vAl/bMzBEpkaM8AqJVi6N3MhN4yJuzF+xJa8f//dlio++Uh9uHarUr6q6T+cXfVKVSpeqrwKBgQC8g3Lz5JIFE7GN9czxfH3FkSvHwlmaHJsmuvLx0XOyYuccg8GvBhrSi6Dhz8ZV2W4bYACqvUEKMqS+FymtixNx6HGVtMwt/hi4JY84ka/mXhIjo7Sc8+NGBXpToj00Aulx33QfDIhcRap3vdVJM19quL1nenOv9yhXgxifby8vHwKBgBEqxh9lKpDuSP13wx9xB1Q3ks23cKsMPW056NPf+mRaRs763UW4Kydf4L8b1nNxQbUoIeFD6ap8iIyTq1yjnEHMTJ3MBINE4jnQl1j/eZA0z5GymtzY1jXG4DIFo2Iz78NE7F+JX2y4Ep84ieIuMDIjG57HBfDXhgAKnXTKDewJAoGAYRySPkQUWNsxT4E9Z3WLURic5hYflH2CC6yo9JvCrzW1+wGA6EoLzUSyx0EC2jzdNOr6zPobpEY8idRi2wzXIons4YM238aTM2Hd6vVaGSGC1KtDossc3Hh78NOWFdIeMlQ7fLc3E9mrnG3FjyUQ1Wh/4eu55v864AIf0Bo1w18CgYApU8WZAfFM/ECwN4NPTNlObcL+ItXNPeJtB17+QV8Jg+KIz0v1Rak4dja0YW6L54IytKAxcGx1264V7GyaOtVGBbQT/FmvOHv64dW5bA9A5uGt+B5B5Rj+zBKmhGB+OyX7CcfGnn9bZBi/cXfnzpu4ORTIKv/pMWJCoUMsiyRhvA==
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
    signature: bytes = scheme._key._decrypt_to_bytes(em_int)  # type: ignore

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
