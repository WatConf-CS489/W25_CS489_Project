import sys
from typing import Callable
from pythonfuzz.main import PythonFuzz

all_targets: dict[str, PythonFuzz] = {}

def target(fn: Callable[[bytes], None]):
    fuzz = PythonFuzz(fn)
    all_targets[fn.__name__] = fuzz
    return fuzz

@target
def crypto(buf):
    from src.auth.ticket import sign_blinded_ticket
    sign_blinded_ticket(buf)

def print_help():
    print("Usage: fuzz.sh <target> [args...]")
    print("Available targets:")
    for t in all_targets:
        print(f"- {t}")
    sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print_help()
    tgt_name = sys.argv.pop(1)
    if tgt := all_targets.get(tgt_name, None):
        if len(sys.argv) == 1:
            sys.argv += [f"src/fuzz/data/{tgt_name}/inputs", f"src/fuzz/data/{tgt_name}/seeds"]
        tgt()
    else:
        print_help()
