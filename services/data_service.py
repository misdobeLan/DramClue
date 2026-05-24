import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
from typing import Dict, Any, List

ROUNDHILL_URL = "https://www.roundhillinvestments.com/"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

class DataService:
    """
    DataService handles fetching and normalizing data from external sources
    (Roundhill Investments website) and provides structured data models for the application.
    This replaces the client-side 'data.js' service layer.
    """

    def __init__(self):
        # Placeholder for local cache or initial dummy data
        self.dummy_etf_data = {
            "name": "Round Hill Core ETF (RHC)",
            "ticker": "RHC",
            "category": "Broad Market",
            "exchange": "NASDAQ",
            "daily_insight": {
                "sentiment": "Bullish",
                "thesis": "Market showing strong momentum, focusing on tech and growth sectors."
            }
        }

    def _fetch_html(self) -> BeautifulSoup | None:
        """Fetches the HTML content of the target URL."""
        try:
            response = requests.get(ROUNDHILL_URL, headers=HEADERS, timeout=15)
            response.raise_for_status()
            return BeautifulSoup(response.text, 'html.parser')
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Roundhill URL: {e}")
            # Fallback mechanism is implemented here, mirroring the spec's data.js fallback
            return None

    def fetch_all_data(self) -> Dict[str, Any]:
        """
        Coordinates fetching all required data types: ETF Info, Market Metrics, and Insights.
        Returns a structured dictionary ready for the application views.
        """
        soup = self._fetch_html()

        # 1. ETF Core Info (Primary Data)
        etf_data = self._extract_etf_data(soup)

        # 2. Market Metrics (Quantitative Data)
        market_metrics = self._extract_market_metrics(soup)

        # 3. Insights/News (Event Data)
        insights_data = self._extract_insights(soup)

        return {
            "etf": etf_data,
            "market": market_metrics,
            "insights": insights_data
        }

    def _extract_etf_data(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extracts core ETF metadata from the scraped page."""
        # --- SCRAPING LOGIC HERE (Placeholder, needs refinement based on actual HTML inspection) ---
        # Example: Finding the title/ticker element
        ticker_element = soup.find('meta', {'name': 'citation_title'})
        ticker = ticker_element.get('content') if ticker_element else "N/A"

        # Using hardcoded/default values for the blueprint structure
        return self.dummy_etf_data

    def _extract_market_metrics(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extracts key performance indicators (KPIs) and market stats."""
        # Logic to find and parse financial metrics (Price, NAV, YTD, etc.)
        # Placeholder implementation:
        return {
            "price": 123.45,
            "nav": 123.00,
            "ytd_return": "15.2%",
            "volatility": "1.2%",
            "momentum": "strong"
        }

    def _extract_insights(self, soup: BeautifulSoup) -> List[Dict[str, str]]:
        """Extracts key commentary/opinion pieces and news feed items."""
        # Logic to find and parse insight/news blocks
        # Placeholder implementation:
        return [
            {"type": "Bullish", "thesis": "Strong buy signal based on volume and sector rotation.", "timestamp": "2026-05-24T10:00:00Z"},
            {"type": "Neutral", "thesis": "Metrics are stable, waiting for next economic data point.", "timestamp": "2026-05-23T15:30:00Z"}
        ]

# Example usage (for testing):
if __name__ == "__main__":
    data_service = DataService()
    data = data_service.fetch_all_data()
    print(json.dumps(data, indent=4))