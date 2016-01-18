import urllib2
import sys
from bs4 import BeautifulSoup as BS


#link1 = sys.argv[1]
#link2 = sys.argv[2]

#link1 = raw_input("Enter link for Course 1: ")
#link2 = raw_input("Enter link for Course 2: ")

def getData(link):
    html = urllib2.urlopen(link)
    soup = BS(html)
    data = []
    crsCode = []
    
    for each_course in soup.findAll('li',{'class':'acalog-course'}):
        inner_text = each_course.text
        pos = str(inner_text).find(' ')
        crsCode.append(str(inner_text)[pos:8])
        data.append(inner_text)
    return data, crsCode

def compare(link1, link2):
    data1, code1 = getData(link1)
    data2, code2 = getData(link2)

    data3 = []
    max = 0

    if (range(len(code2)))>range((len(code1))):
        max = range(len(code1))
        for index in max:
            for crs in code2:
                if crs == code1[index]:
                    data3.append(crs)
    else:
        max = range(len(code2))
        for index in max:
            for crs in code1:
                if crs == code2[index]:
                    data3.append(data1[index])

    return data3


def data_to_html_table(data):
    html = '<table><tbody>'
    for item in data:
        html += '<tr><td>' + str(item) + '</td></tr>'
    html += '</tbody></table>'
    return html

def printData(data):
    text = "Common Courses:\n"
    i = 1;
    for item in data:
        text+= str(i) + ". " + str(item) + "\n"
        i = i+1
    return text


def createHTML(data):
    f = open('commonCrs.html','w')
    html = data_to_html_table(data);
    f.write(html)
    f.close()


data = compare(link1, link2)
return data
createHTML(data)
print printData(data)

# Test Links:

# Soc: http://catalog.aucegypt.edu/preview_program.php?catoid=15&poid=1781
# Anthro: http://catalog.aucegypt.edu/preview_program.php?catoid=15&poid=1663

# CE: http://catalog.aucegypt.edu/preview_program.php?catoid=15&poid=1693&returnto=474
# CS: http://catalog.aucegypt.edu/preview_program.php?catoid=15&poid=1694&returnto=474
# EE: http://catalog.aucegypt.edu/preview_program.php?catoid=4&poid=337&returnto=58


#createHTML(data)
#print data_to_html_table("")


# sock = urllib.urlopen()
# htmlSource = sock.read()
# mydivs = soup.findAll("div", class_="acalog-core")
#for td in tds:
# sock.close()

