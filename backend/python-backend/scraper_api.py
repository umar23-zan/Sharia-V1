from flask import Flask, jsonify
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import undetected_chromedriver as uc
from fake_useragent import UserAgent
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

app = Flask(__name__)

def get_random_user_agent():
    ua = UserAgent()
    return ua.random

def get_driver():
    options = uc.ChromeOptions()
    options.add_argument(f"user-agent={get_random_user_agent()}")
    options.add_argument("--headless")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return uc.Chrome(options=options)

def random_delay():
    time.sleep(random.uniform(3, 7))

def get_company_about(driver, symbol):
    url = f"https://www.screener.in/company/{symbol}/"
    driver.get(url)
    company_data = {"Company Name": "N/A", "About": "N/A"}
    try:
        company_name_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "h1.margin-0.show-from-tablet-landscape"))
        )
        company_data["Company Name"] = company_name_element.text.strip()
        try:
            about_div = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.about p"))
            )
            company_data["About"] = about_div.text.strip()
        except:
            company_data["About"] = "Not available"
    except Exception as e:
        company_data["error"] = str(e)
    return company_data

def get_financials(driver, symbol):
    url = f"https://www.screener.in/company/{symbol}/consolidated/"
    driver.get(url)
    random_delay()
    financials = {}
    balance_sheet = {}
    cash_flow = {}
    try:
        rows = driver.find_elements(By.CSS_SELECTOR, "table.data-table tbody tr")
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "td")
            if len(cols) > 1:
                key = cols[0].text.strip()
                value = cols[-1].text.strip()
                if "Sales" in key or "Net Profit" in key or "EPS" in key or "ROCE" in key:
                    financials[key] = value
                elif "Reserves" in key or "Liabilities" in key or "Assets" in key:
                    balance_sheet[key] = value
                elif "Cash from" in key or "Net Cash Flow" in key:
                    cash_flow[key] = value
                else:
                    financials[key] = value
    except Exception as e:
        return {"error": str(e)}
    return {"Financials": financials, "Balance Sheet": balance_sheet, "Cash Flow": cash_flow}

@app.route("/company/about/<symbol>", methods=["GET"])
def company_about(symbol):
    driver = get_driver()
    try:
        data = get_company_about(driver, symbol)
        return jsonify(data)
    finally:
        driver.quit()

@app.route("/company/financials/<symbol>", methods=["GET"])
def company_financials(symbol):
    driver = get_driver()
    try:
        data = get_financials(driver, symbol)
        return jsonify(data)
    finally:
        driver.quit()

if __name__ == "__main__":
    app.run(debug=True)
