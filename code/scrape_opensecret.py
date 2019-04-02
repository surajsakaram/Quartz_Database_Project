from bs4 import BeautifulSoup as bs
import urllib3 as ul
import sys, csv
import re

if len(sys.argv) != 3:
  print("usage: python3 file.py \"first name\" \"last name\"")
  sys.exit(1)

page = 1
loop = True
all_data = []
http = ul.PoolManager()

donor = " ".join(sys.argv[1:])

while (loop):
  url = "https://www.opensecrets.org/donor-lookup/results?name="+donor.replace(" ","+")+"&page="+str(page)

  response = http.request('GET', url)

  print(response.status)
  if response.status != 200: 
    print("status:",response.status)
    sys.exit(1)

  soup = bs(response.data, "html.parser")
  tbody = soup.find("tbody")
  if not tbody:
    print("no more")
    loop = False
    continue

  
  for tr in tbody.find_all("tr"):
    this_row = []
    for td in tr.find_all("td"):
      class_attr = td.get("class", [])
      if not "c-red" in class_attr:
        this_row.append(re.sub(' +',' ',td.text.strip().replace("\n","\t")))
    if this_row:
      temp = this_row[0]
      this_row[0] = this_row[1]
      this_row[1] = temp
      all_data.append(this_row)

  page += 1

print(all_data)
print(len(all_data))

with open('opensecret_'+donor.replace(" ","_")+'.csv','w', newline="") as f:
  writer = csv.writer(f)
  for line in all_data:
    writer.writerow(line)
