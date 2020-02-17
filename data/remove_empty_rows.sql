SELECT count(*) FROM articles WHERE headline = '';
SELECT count(*) FROM articles WHERE authors = '';
SELECT count(*) FROM articles WHERE short_description = '';
SELECT count(*) FROM articles WHERE link = '';
SELECT count(*) FROM articles WHERE category = '';
SELECT count(*) FROM articles WHERE published = '';
DELETE FROM articles WHERE headline = '';
DELETE FROM articles WHERE authors = '';
DELETE FROM articles WHERE short_description = '';
DELETE FROM articles WHERE link = '';
DELETE FROM articles WHERE category = '';
DELETE FROM articles WHERE published = '';

SELECT count(*) FROM article_text WHERE body = '';
SELECT count(*) FROM article_text WHERE fk_article_id = '';
DELETE FROM article_text WHERE body  = '';
DELETE FROM article_text WHERE fk_article_id = '';

SELECT count(*) FROM article_summary WHERE summary = '';
SELECT count(*) FROM article_summary WHERE fk_article_id = '';
DELETE FROM article_summary WHERE summary = '';
DELETE FROM article_summary WHERE fk_article_id = '';

SELECT count(*) FROM keywords WHERE words = '';
SELECT count(*) FROM keywords WHERE fk_article_id = '';
DELETE FROM keywords WHERE words = '';
DELETE FROM keywords WHERE fk_article_id = '';

SELECT count(*) from articles;
SELECT count(*) from article_text;
SELECT count(*) from article_summary;
SELECT count(*) from keywords;