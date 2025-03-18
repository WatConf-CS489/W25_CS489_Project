from unittest.mock import patch
import pytest
import src.auth.ticket as ticket

@pytest.fixture(autouse=True)
def mock_rsa_key():
    ticket.get_private_key.cache_clear()
    with patch(
        "src.auth.ticket.getenv", 
        return_value="MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDmzAaur7h1FrURv3hY/NYA8wQkkC+vwfJ9fGu/F5agWAnvuaZ6JF/5ZQLeZxbaPLMz/A+vGq2V5WQ80xmTcJwNYMmpFaFRQof9Kal0cHd/WXlXBuVwgJqNdMz3RI8DdGv6bWo8GrwDpOAOQVOGc4WaSmrQ+3z+wH2RUnQwgL6jFLvabt97sbJPQP+OHg/Q1z0EKcJ8NXhyGGiLByPI0r3FDGfRCw+H77FiWrtBPQHMRrfTkZLH+reg0uuflfLloJJlc7s56SyFkcR3N+ZOlZk4jELJrQO4kdnt0ht4iQC/ZKYx1LDM7wq3qhePnQHo5FAbzR0VidfuQ7QgybsR4edBAgMBAAECggEAIOUH98peRzv5C0JHuCEzLDf2yXJOhaWmNununnIReyGJKwSCHIsGLdDOj53QVUMNBJYCs0GhZ4mmF4A79zZ323VF0MZfM2qA4N2ZBBpKgdliELwQJBCEVrCEzSJVoterUypYl5/0160ebRG1AqcA7gx4vHf3qQSM8RM4MbiL00jKL3ziXhB9y1Oeb4B9rIEpV+iC4/tAPsi4cAlyuvDx0e7lNl+hW/UYHKQ0J6FGoEpxI1TOoTHqwDLUSo7h48K3LrHz4lnejUt/svHyZwE/CcOXXNoV2/MsI8Mouhn/8m7KAhaq1e9n5BtELz77rA2+WJnt6+bkVSguqaMA1FjppQKBgQD3gHFN8xuPkVFxlEwozudJ0o+1p7Zk2+Ob/Kspc7FjRUnDsF9RFce709FlJEL/cEjuM7EdQTl0WLIeZhcW+UkKPLWS1DFqKYtzHkfXnbiaUxbn0pmYqsDEQ1JGWa+ra26JBpMy79VFYpuZMnCUTEBkCFwTgUPip2WQuN923Kh7LQKBgQDuuL9hLPgsdm8OuQoFEqx1Q7U6vlWJCZ/BPKRoHQ0bP153HkiwfJJrQzNDmr3NnPbSRU5CNQUOFP3g+yrw3y1K71ClGob1DPmpsBndIIO0A4pp+pCWCKEPAgkJvcLS+615Tp6Wdx7G/zNVhUkgFXqrvGPY5wpAufSOHoWi782Y5QKBgEDOGNzYMvc8jZ63vdlRk634vDhMWa2/BbHqTsbjzCa6Fb5viAWrNkkwBTv+aqyHshDs6AtI8MpODxV2lcUmMMHFc6WmeenaRvE1lIoYeiWua+j3c9BNpXu+ROS2xxCTaLXoStKjiaxJTYSneGLcNF/88F8LEcNfIXDrd1egH11hAoGAV22uGabglVgiwF+gfc8i/id3/jWrGe8+ZQUSqVbKcAo7TKD4ujpFXadU5RONI/qyorvjN3g3i7rAaF9UkLcL3X/cJzuZ5bGE1lK6hjPcSFdrn/i2b1xlsBtst/aZna+zDtRuXGjwCq14XX/dEjULok3yu4OSS7ZPDKW9B7mPsMkCgYAaHNEPjDUN/DemWSPYpIQhLNQ3l9tw46U/Ruurxxzl8zMBLgxaTGCNOWZKPj9GZt6dwwAkpjFgywM+2farsh6GMKHQ0SRLu1Yfrz5RN3a3Y8D1O+Fj8hqZzq1uGlt0YB34Tdr4vI2vpi8ou7ZIKack3HthmWCNAg1O9YchzG15Dw=="
    ):
        yield
    ticket.get_private_key.cache_clear()


def test_sign_ticket():
    signed = ticket.sign_blinded_ticket("93c14465f8d7efc8b561dab90948dcd1fedf2ebcf5a45779b20a5c027e848baeaece31a4c406a4f04897f36bceeedc96417c7381da042b66a7e815bf002d2a37053e4110bed3468eb3a18de5a8157e829b2e8070fe85dfb15ed06a3640703852175b3a3658214570c2702ec598ef3da54bf4bd5bc666138ebdb2d9db0307cf88cba5ceaf79d1574f729a34235d1c83719865e4688af771746ef35f86dc290c935b9b1d1608a52a7a624f68ea8caa991d04fb93c51ff0c59bb2f6717805f156f8aa64dabf4c4ed9e43f35b8a53e8cc4bcebc1d7a59847349e23bb9b8eddcf6eb6b33447a77d94392bffc2ad608e7f6da4ab04f93a5d1db26e40816c4b12b122ea")
    assert signed == "c6e196a07032ce92260bc05584a99b4c331d90579969b66b16910d5e3b5f43cd87429eb417dca506ad12dcc9592783056df06c769ccbe8a714b39c6b15aedfe6e8c1df3bb831c9d5a90c3561060792add64233a3675344a1c55da3c4171b3e651cc2c3f1c44df8cdb494eda17ce75dc258eef62479856f948a1b48cf598c1a6ed1c936d0423c98abbf36b4d1ae82ab9f9f53e5283a09f937d8486e841cf445ad76a5cea279573351cd9f72312c09aab9e535c25e5e74516838b84d141c0e561dc67935e26bb8ef15e44ee02e8939de5770eebfa77a552c22e9228be0fc7ea33e0383e37ef8d485b558fdb4e64ca574aed559f88596e6c02d633e3669d2187ac4"

def test_bad_ticket():
    # slightly longer than the expected length
    signed = ticket.sign_blinded_ticket("93c14465f8d7efc8b561dab90948dcd1fedf2ebcf5a45779b20a5c027e848baeaece31a4c406a4f04897f36bceeedc96417c7381da042b66a7e815bf002d2a37053e4110bed3468eb3a18de5a8157e829b2e8070fe85dfb15ed06a3640703852175b3a3658214570c2702ec598ef3da54bf4bd5bc666138ebdb2d9db0307cf88cba5ceaf79d1574f729a34235d1c83719865e4688af771746ef35f86dc290c935b9b1d1608a52a7ab26e4081624f68ea8caa991d04fb93c51ff0c59bb2f6717805f156f8aa64dabf4c4ed9e43f35b8a53e8cc4bcebc1d7a59847349e23bb9b8eddcf6eb6b33447a77d94392bffc2ad608e7f6da4ab04f93a5d1db26e40816c4b12b122ea")
    assert signed is None

def test_verify_ticket():
    expected_ticket = "16377d09-dcaa-417d-99c4-0deffba601f5"
    expected_signature = "d82dae6db88db24614242ba6b9bcb9623320990d923f1ca046e1515b30e7dc6e05e8f6cd331f0a7389ae5e86fc56176029b99aba6ce81a8a813a942278bb5e3db64755d397f62bd6d6c984557ab7b1c029850df0897fbaeba43f6765a1a779fc66211696c4363df9bcebb16c433611ba362c3594326c6f3569ae6ad178515abb8e7e5f6d40554688decd10bb0c61e318a4476ff5fbdb4d13583e6f41ac89673ea7d766ac1063b6be96381d0f0df9bb553c56c571f8d28f2d4e4f685b8a86e8d9743173e16e4cb32c51ed7acbf22e01fcc539326656becb6da761f6bdcf77b6a374d4dfb023887e47a5460ef3478c991573e3d324b22ea83aa29bf26a88577fe8"
    assert ticket.verify_ticket(expected_ticket, expected_signature)
    assert not ticket.verify_ticket(f"9{expected_ticket[1:]}", expected_signature)
    assert not ticket.verify_ticket(expected_ticket, f"9{expected_signature[1:]}")

def test_get_public_key_pem():
    assert ticket.get_public_key_pem() == """
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5swGrq+4dRa1Eb94WPzW
APMEJJAvr8HyfXxrvxeWoFgJ77mmeiRf+WUC3mcW2jyzM/wPrxqtleVkPNMZk3Cc
DWDJqRWhUUKH/SmpdHB3f1l5VwblcICajXTM90SPA3Rr+m1qPBq8A6TgDkFThnOF
mkpq0Pt8/sB9kVJ0MIC+oxS72m7fe7GyT0D/jh4P0Nc9BCnCfDV4chhoiwcjyNK9
xQxn0QsPh++xYlq7QT0BzEa305GSx/q3oNLrn5Xy5aCSZXO7OekshZHEdzfmTpWZ
OIxCya0DuJHZ7dIbeIkAv2SmMdSwzO8Kt6oXj50B6ORQG80dFYnX7kO0IMm7EeHn
QQIDAQAB
-----END PUBLIC KEY-----
""".strip()
