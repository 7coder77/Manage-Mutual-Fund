from fastapi import FastAPI, Query, HTTPException
import requests

app = FastAPI()

def fetch_amfi_data():
    """
    Fetch the latest mutual fund data from AMFI.
    Returns the data as a list of lines from the `NAVAll.txt` file.
    """
    url = "https://www.amfiindia.com/spages/NAVAll.txt"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text.split("\n")
        else:
            raise Exception("Failed to fetch AMFI data")
    except Exception as e:
        return str(e)

def search_funds(fund_name: str):
    """
    Search for mutual funds containing the given fund name.
    Args:
        fund_name (str): The name or part of the name to search for.
    Returns:
        List of matching funds or an error message.
    """
    data = fetch_amfi_data()
    if isinstance(data, str):  # If fetch_amfi_data returned an error
        return {"error": data}
    
    results = []
    for line in data:
        details = line.split(";")
        if len(details) >= 5 and fund_name.lower() in details[3].lower():
            results.append({
                "Fund Code": details[0],
                "Fund Name": details[3],
                "NAV": details[4]
            })
    return results

@app.get("/search_fund")
async def search_fund(fund_name: str = Query(..., description="The name or part of the name of the mutual fund to search for")):
    """
    API endpoint to search for mutual funds by name.
    Args:
        fund_name (str): Query parameter for the mutual fund name.
    Returns:
        A list of matching funds or an error message.
    """
    if not fund_name:
        raise HTTPException(status_code=400, detail="Fund name parameter is required")
    
    results = search_funds(fund_name)
    if "error" in results:
        raise HTTPException(status_code=500, detail=results["error"])
    
    if not results:
        raise HTTPException(status_code=404, detail="No matching funds found")

    return {"results": results}
