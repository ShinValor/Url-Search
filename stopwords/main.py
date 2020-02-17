import json
import entity_recognition
import stopwords

def main():
  text = "Azure Functions is a solution for easily running small pieces of code, or “functions,” in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. Functions can make development even more productive, and you can use your development language of choice, such as C#, Java, JavaScript, Python, or PHP. Pay only for the time your code runs and trust Azure to scale as needed. Azure Functions lets you develop serverless applications on Microsoft Azure."
  processed_text = stopwords.remove_stop_words(text)
  entities = entity_recognition.get_entities(text)
  print("Processed Text",processed_text)
  print("Entities",entities)

main()