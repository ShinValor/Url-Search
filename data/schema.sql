Create Table users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

Create Table user_search (
  id VARCHAR(255) PRIMARY KEY,
  searched_keywords VARCHAR(255) NOT NULL,
  fk_user_id VARCHAR(255) NOT NULL,
  FOREIGN KEY(fk_user_id) REFERENCES users(id)
);

Create table articles (
  id VARCHAR(255) PRIMARY KEY,
  headline VARCHAR(255) NOT NULL,
  authors VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  link VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  published VARCHAR(255) NOT NULL
);

CREATE TABLE article_text (
  id VARCHAR(255) PRIMARY KEY,
  body TEXT NOT NULL,
  fk_article_id VARCHAR(255) NOT NULL,
  FOREIGN KEY(fk_article_id) REFERENCES articles(id)
);

CREATE TABLE article_summary (
  id VARCHAR(255) PRIMARY KEY,
  summary TEXT NOT NULL,
  fk_article_id VARCHAR(255) NOT NULL,
  FOREIGN KEY(fk_article_id) REFERENCES articles(id)
);

Create table keywords (
  id VARCHAR(255) PRIMARY KEY,  
  words VARCHAR(255) NOT NULL, 
  fk_article_id VARCHAR(255) NOT NULL,
  FOREIGN KEY(fk_article_id) REFERENCES articles(id)
);