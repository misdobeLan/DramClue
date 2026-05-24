from flask import Flask, render_template, jsonify
from services.data_service import DataService

app = Flask(__name__)
data_service = DataService()

@app.route('/')
def index():
    """
    Handles the root route, serving the main financial analysis dashboard.
    Fetches data and passes it to the template context.
    """
    try:
        # Fetch data using the service layer
        data = data_service.fetch_all_data()

        # Pass the structured data to the template
        return render_template('index.html', data=data)
    except Exception as e:
        # Handle critical failure gracefully
        print(f"Error rendering dashboard: {e}")
        return "<h1>Error loading dashboard. Check server logs.</h1>", 500

@app.route('/api/data')
def api_data():
    """
    API endpoint to serve the structured data payload, consumed by client-side JS.
    """
    data = data_service.fetch_all_data()
    return jsonify(data)

def main():
    """
    Main entry point for running the application.
    """
    print("Starting ETF Insight Platform...")
    # In a real environment, we might need to handle migrations or database connections here.
    app.run(debug=True)

if __name__ == '__main__':
    main()
