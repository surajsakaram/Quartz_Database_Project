from bs4 import BeautifulSoup as bs
import urllib3 as ul
import sys, csv
import re


def swap_column_arr(arr, a, b):
    temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp


debug_mode = False
# supress urllib3 warning
ul.disable_warnings(ul.exceptions.InsecureRequestWarning)

## define usage: python3 filename <first_name> (<intial>) <last_name>
if len(sys.argv) != 2:
    print("usage: python3 file.py \"first name <optional: initial> last name\"")
    sys.exit(1)


page = 1
loop = True
all_data = []
http = ul.PoolManager()

## define donor 
donor_url = sys.argv[1].replace(" ","+")
output_file_name = sys.argv[1].replace(" ","-")

## scrape data based on <tbody>
while loop:
    url = "https://www.opensecrets.org/donor-lookup/results?name="+donor_url+"&page="+str(page)

    # get a response from http request
    response = http.request('GET', url)
    print("page",page)
    # if request is not successful, quit the program
    if response.status != 200: 
        print("status:",response.status)
        sys.exit(1)

    # convert html to beautiful soup object
    soup = bs(response.data, "html.parser")
  
    # stop looping if no more result can be found
    tbody = soup.find("tbody")
    if not tbody:
        if page == 1:
            print("no result found...")
        else:
            print("no more record...")
        loop = False
        continue

    # iterate all table row 
    for tr in tbody.find_all("tr"):
        this_row = []
        # iterate all table data
        for td in tr.find_all("td"):

            # ignore the "WARNING row" by checking if <td> has class "c-red"
            class_attr = td.get("class", [])
            if not "c-red" in class_attr:
                this_row.append(re.sub(' +',' ',td.text.strip().replace("\n","\t")))
        if this_row:
            swap_column_arr(this_row, 0, 1)
            all_data.append(this_row)

    page += 1


if debug_mode:
    print(all_data)
    print(len(all_data))


with open('opensecret_'+output_file_name+'.csv','w', newline="") as f:
    writer = csv.writer(f)
    header = ['Contributor', 'Category', 'Occupation', 'Date', 'Amount', 'Recipient']
    writer.writerow(header)
    for line in all_data:
        writer.writerow(line)
