# import requests
import json
import pymysql
import boto3
import base64
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("Inside lambda_handler...")

    article_id = event['id']

    # SecretsManager
    database_cred = json.loads(get_secret("MyTestDatabaseMasterSecret"))
    
    rds_host = database_cred['host']
    name = database_cred['username']
    password = database_cred['password']
    db_name = database_cred['database']
    
    # rapid_api_key = json.loads(get_secret("Rapid_Api_Key"))

    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
    with conn.cursor() as cur:
        cur.execute('SELECT summary FROM article_summary WHERE fk_article_id = %s',article_id)
        conn.commit()
        cur.close()
        summary = cur.fetchone()
        return summary

    # url = "https://meaningcloud-summarization-v1.p.rapidapi.com/summarization-1.0"
    
    # querystring = {"txt":text,"sentences":"3"}
    
    # headers = {
    #     'x-rapidapi-host': "meaningcloud-summarization-v1.p.rapidapi.com",
    #     'x-rapidapi-key': rapid_api_key['api_key'],
    #     'accept': "application/json"
    #     }
    
    # res = requests.request("GET", url, headers=headers, params=querystring)
    # return res.json()['summary']

def get_secret(key_name):
    logger.info("Inside get_secret...")
    secret_name = key_name
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name

    )

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
        logger.info("Received Response")
    except ClientError as e:
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            logger.info("Inside string response...")
            return get_secret_value_response['SecretString']
        else:
            logger.info("Inside binary response...")
            return base64.b64decode(get_secret_value_response['SecretBinary'])  
