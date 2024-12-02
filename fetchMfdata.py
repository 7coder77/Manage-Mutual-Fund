import requests

def get_nav(fund_name, starts_with=False):
    url = "https://www.amfiindia.com/spages/NAVAll.txt"
    try:
        # Fetch the NAV data
        response = requests.get(url)
        if response.status_code != 200:
            return {"error": "Failed to fetch NAV data"}
        
        # Split data into lines
        data = response.text.split("\n")

        # Write the data to a file (optional)
        with open("NAV.txt", "w") as f:
            f.write("\n".join(data))
        
        # Search for funds
        results = []
        for line in data:
            details = line.split(";")
            if len(details) < 5:
                continue  # Skip incomplete lines
            fund_name_in_line = details[3].strip().lower()
            
            if starts_with:
                if fund_name_in_line.startswith(fund_name.lower()):
                    results.append({"Fund Code": details[0], "Fund Name": details[3], "NAV": details[4]})
            else:
                if fund_name.lower() in fund_name_in_line:
                    return {"Fund Code": details[0], "Fund Name": details[3], "NAV": details[4]}
        
        # Return results based on search type
        if starts_with:
            return results if results else {"error": "No funds found starting with the given string"}
        else:
            return {"error": "Fund not found"}

    except Exception as e:
        return {"error": str(e)}

# Search for funds starting with a specific string
prefix = "edelweiss mid cap"
starting_nav_data = get_nav(prefix, starts_with=True)
print("\nFunds Starting with Prefix:")
for fund in starting_nav_data:
    print(f"Fund Code: {fund['Fund Code']}, Name: {fund['Fund Name']}, NAV: {fund['NAV']}")
