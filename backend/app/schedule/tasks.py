import json

from typing import Optional
from datetime import date


def check_if_birthday_and_return_name() -> Optional[list]:
    birthdays_today_names = list()
    with open("app/settings/birthdays.json", "r") as f:
        json_data = (json.load(f))["data"]
    today_date = date.today()
    for i in json_data:
        if today_date.month == i["month"] + 1 and today_date.day == i["date"]:
            birthdays_today_names.append(i["name"])
    print(birthdays_today_names)
    return birthdays_today_names
    
