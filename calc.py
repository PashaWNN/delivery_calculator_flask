import requests
import json
from collections import namedtuple


class DelLinCalculator:
    def __init__(self, appkey):
        self.appkey = appkey
        self.url = 'https://api.dellin.ru/v1/public/calculator.json'

    @staticmethod
    def _normalize_kladr(kladr: str) -> str:
        return kladr.strip('0') + '0' * (25 - len(kladr.strip('0')))

    def calculate(self, derivalPoint: str, arrivalPoint: str, sizedVolume: float, sizedWeight: float, **kwargs):
        derivalPoint = self._normalize_kladr(derivalPoint)
        arrivalPoint = self._normalize_kladr(arrivalPoint)
        payload = {
            'appkey': self.appkey,
            'arrivalPoint': arrivalPoint,
            'derivalPoint': derivalPoint,
            'sizedVolume': sizedVolume,
            'sizedWeight': sizedWeight,
            **kwargs
        }
        response = requests.post(self.url, json=payload)
        result = json.loads(response.text)
        total_price = result.get('price')
        derival = result.get('derival')
        derival_price = derival.get('price') if derival is not None else None
        intercity = result.get('intercity')
        intercity_price = intercity.get('price') if intercity is not None else None
        arrival = result.get('arrival')
        arrival_price = arrival.get('price') if arrival is not None else None
        Results = namedtuple('Results', 'total_price derival_price intercity_price arrival_price')
        return Results(total_price, derival_price, intercity_price, arrival_price)


