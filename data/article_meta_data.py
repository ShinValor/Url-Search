import pymysql
import json
import uuid

def main():

  data = []

  with open('News_Category_Dataset_v2.json') as fp:
    line = fp.readline()
    while line:
      data.append(json.loads(line))
      line = fp.readline()

  data = data[10269:10769]

  rds_host = "host"
  name = "username"
  password = "password"
  db_name = "database"
  
  conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
  with conn.cursor() as cur:
    count = 1
    for d in data:
      uni_id = uuid.uuid4().hex
      cur.execute('INSERT INTO articles(id,headline,authors,short_description,link,category,published) VALUES(%s,%s,%s,%s,%s,%s,%s)',(uni_id,d['headline'],d['authors'],d['short_description'],d['link'],d['category'],d['date']))
      print("Current line: ",count)
      count += 1
    conn.commit()
    cur.close()

main()