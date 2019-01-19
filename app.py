from flask import Flask
from flask.templating import render_template
from flask import request
from flask import jsonify
from calc import DelLinCalculator


app = Flask(__name__)
DELLIN_API_KEY = 'DF8DC7DC-DB1A-4C4A-A537-D8A51C77D770'
dellin = DelLinCalculator(appkey=DELLIN_API_KEY)


@app.route('/')
def index():
    return render_template('calc.html')


@app.route('/calculate/', methods=['POST'])
def calc():
    j = request.get_json()
    try:
        result = dellin.calculate(derivalPoint=j['from_kladr'],
                                  arrivalPoint=j['to_kladr'],
                                  arrivalDoor=j['arrival'],
                                  derivalDoor=j['derival'],
                                  sizedVolume=1.0,
                                  sizedWeight=j['weight'])
    except ValueError as e:
        return jsonify({'error': str(e)})
    return jsonify({
        'total': result.total_price,
        'derival': result.derival_price,
        'intercity': result.intercity_price,
        'arrival': result.arrival_price,
    })


if __name__ == '__main__':
    app.run()
