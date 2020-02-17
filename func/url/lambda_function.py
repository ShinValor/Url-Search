import json
import pymysql

# Secrets Manager
import json
import boto3
import base64
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    
    logger.info("Inside lambda_handler...")

    search_keywords = event['keywords']
    print(search_keywords)

    # SecretsManager
    database_cred = json.loads(get_secret("MyTestDatabaseMasterSecret"))
    
    rds_host = database_cred['host']
    name = database_cred['username']
    password = database_cred['password']
    db_name = database_cred['database']

    urls = []
    article_ids = []
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
    with conn.cursor() as cur:
        cur.execute('SELECT words,fk_article_id FROM keywords')
        for row in cur:
            row = list(row)

            words = row[0].split(', ')
            article_id = str(row[1])
            if set(words) & set(search_keywords):
                article_ids.append(article_id)
        if len(article_ids) == 0:
            conn.commit()
            cur.close()
            return None
        placeholders= ', '.join(['%s']*len(article_ids))
        query = 'SELECT * FROM articles WHERE id IN ({})'.format(placeholders)
        cur.execute(query, tuple(article_ids))
        for row in cur:
            urls.append(list(row))
        conn.commit()
        cur.close()
        return urls

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