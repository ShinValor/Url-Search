import pymysql
import json
from newspaper import Article
import uuid

def main():

  rds_host = "host"
  name = "username"
  password = "password"
  db_name = "database"
  
  conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
  with conn.cursor() as cur:
    count = 1
    fk_ids = []
    urls = []
    cur.execute('SELECT id,link FROM articles limit 10000,500')
    for row in cur:
      fk_ids.append(row[0])
      urls.append(row[1])
    
    for i in range(len(fk_ids)):
      article = Article(urls[i])
      article.download()
      article.parse()
      article.nlp()
      article_text_id = uuid.uuid4().hex
      article_summary_id = uuid.uuid4().hex
      keywords_id = uuid.uuid4().hex
      keyword_list = ", ".join(article.keywords)
      cur.execute('INSERT INTO article_text(id,body,fk_article_id) VALUES(%s,%s,%s)',(article_text_id,article.text,fk_ids[i]))
      cur.execute('INSERT INTO article_summary(id,summary,fk_article_id) VALUES(%s,%s,%s)',(article_summary_id,article.summary,fk_ids[i]))
      cur.execute('INSERT INTO keywords(id,words,fk_article_id) VALUES(%s,%s,%s)',(keywords_id,keyword_list,fk_ids[i]))
      print("Current line: ",count)
      count += 1
    conn.commit()
    cur.close()

main()