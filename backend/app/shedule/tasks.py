import shedule
import time
import json
from typing import Optional

def check_if_birthday_and_return_name() -> Optional[str]:
    with open("app/settings/birthdays.json", "r") as f:
        json_data = json.load(f, indent=3)

    
