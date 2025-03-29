from enum import Enum
import os


class Environment(Enum):
    DEV = "DEV"
    PROD = "PROD"
    LIVE = "LIVE"

current_env = Environment(os.getenv("WATCONF_ENV"))

def get_base_url():
    match current_env:
        case Environment.DEV:
            return "local.kabir.dev"
        case Environment.PROD:
            return "local.kabir.dev"
        case Environment.LIVE:
            return "watconf.kabir.dev"
