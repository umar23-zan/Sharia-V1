from flask import Flask, jsonify, request
from flask_cors import CORS  
import yfinance as yf
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  

@app.route('/api/price-history/<symbol>')
def get_price_history(symbol):
    try:
        period = request.args.get('period', '3mo')  
        interval = request.args.get('interval', '1d') 

        ticker = yf.Ticker(symbol)

        
        period_settings = {
            '1d': {'period': '1d', 'interval': '5m'},     
            '1w': {'period': '1w', 'interval': '1h'},    
            '1mo': {'period': '1mo', 'interval': '1d'},    
            '3mo': {'period': '3mo', 'interval': '1d'},    
            '6mo': {'period': '6mo', 'interval': '1d'},    
            '1y': {'period': '1y', 'interval': '1d'},      
            'max': {'period': 'max', 'interval': '1wk'}     
        }

        
        settings = period_settings.get(period, {'period': period, 'interval': interval})

        
        hist = ticker.history(period=settings['period'], interval=settings['interval'])

        if hist.empty: 
            return jsonify({
                "prices": [],
                "meta": {
                    "lastPrice": None,
                    "priceChange": None,
                    "priceChangePercent": None,
                    "period": period,
                    "interval": settings['interval'],
                    "message": f"No price history data found for {symbol} for the selected period."
                }
            })

        
        price_data = []
        for date, row in hist.iterrows():
            
            if settings['interval'] in ['5m', '15m', '1h']:
                date_str = date.strftime('%Y-%m-%d %H:%M')
            else:
                date_str = date.strftime('%Y-%m-%d')

            price_data.append({
                "date": date_str,
                "price": round(row['Close'], 2),
                "volume": row['Volume']
            })

        
        first_price = price_data[0]['price'] if price_data else 0
        last_price = price_data[-1]['price'] if price_data else 0
        price_change = round(last_price - first_price, 2)
        price_change_percent = round((price_change / first_price * 100), 2) if first_price != 0 else 0

        response_data = {
            "prices": price_data,
            "meta": {
                "lastPrice": last_price,
                "priceChange": price_change,
                "priceChangePercent": price_change_percent,
                "period": period,
                "interval": settings['interval']
            }
        }

        return jsonify(response_data)

    except Exception as e:
        print(f"Error fetching price history for {symbol} with period={period} and interval={interval}: {e}") 
        return jsonify({"error": str(e), "message": f"Could not fetch price history for symbol: {symbol}"}), 500

@app.route('/api/company-details/<symbol>')
def get_company_details(symbol):
    try:
        yf_ticker = yf.Ticker(symbol)
        info = yf_ticker.info

        if not info:
            return jsonify({"message": f"Company data not found for symbol: {symbol}"}), 404
        
        hist = yf_ticker.history(period="1d", interval="1d")
        if not hist.empty:
            current_price = round(hist['Close'].iloc[-1], 2)
            high24 = round(hist['High'].iloc[-1], 2)
            low24 = round(hist['Low'].iloc[-1], 2)
        else:
            current_price = high24 = low24  = None

        previous_close = round(info.get('previousClose', 0), 2)
        price_change = round((current_price - previous_close), 2) if current_price is not None else None

        company_data = {
           "symbol": symbol.upper(),
            "company_name": info.get('longName'),
            "company_description": info.get('longBusinessSummary'),
            "current_price": current_price,
            "price_change": price_change,
            "high24": high24,
            "low24": low24,
            "previous_close": previous_close,
            "volume": info.get('volume'),
            "pe_ratio": info.get('trailingPE'),
        }

        return jsonify(company_data)

    except Exception as e:
        return jsonify({"error": str(e), "message": f"Could not fetch data for symbol: {symbol}"}), 500

if __name__ == '__main__':
    app.run(debug=True)