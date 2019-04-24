from bs4 import BeautifulSoup as bs
import urllib3 as ul
import sys, csv, os
import re


base_url = "https://www.opensecrets.org/orgs/recips.php?id="

cycle_arr = [cycle for cycle in range(1998, 2020, 2)]

org_data_header = ["Recipient", "Office", "Contributions(Total)", "Cycle"]

# supress urllib3 warning
ul.disable_warnings(ul.exceptions.InsecureRequestWarning)
http = ul.PoolManager()


def swap_column_arr(arr, a, b):
    temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp


def read_org_id():
    with open('opensecrets_org_id.csv', 'r') as f:
        data_list = []
        cline = 0
        for line in csv.reader(f):
            if cline > 0:
                data_list.append(line)
            cline += 1
        print(data_list)
        return data_list


def get_org_data(org_id, cycle):
    page = 1
    loop = True
    all_data = []

    ## scrape data based on <tbody>
    while loop:
        url = base_url+org_id+"&page="+str(page)+"&cycle="+str(cycle)

        # get a response from http request
        response = http.request('GET', url)
        print("page", page)
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
                this_row.append(re.sub(' +',' ',td.text.strip().replace("\n","\t").replace("\t","")))
            this_row.append(cycle) 
            #print(this_row)
            all_data.append(this_row)
        page += 1
    return all_data


def write_org_data_csv(org_data_list, org_id):
    path_dir = "../../data/opensecrets_company_csv_dump/"
    with open(path_dir+'opensecrets_org_summary_'+org_id+'.csv', 'w') as f:
        writer = csv.writer(f)
        for line in org_data_list:
            writer.writerow(line)
        print(org_id,"done...")


if __name__ == '__main__':
    for item in read_org_id():
        [orgname, orgid] = item
        org_data_list = [org_data_header]
        for cycle in cycle_arr:
            print(orgname, cycle)
            org_data_list.extend(get_org_data(orgid, cycle))
        print(len(org_data_list))
        write_org_data_csv(org_data_list, orgid)
