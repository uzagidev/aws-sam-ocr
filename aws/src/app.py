from __future__ import print_function
import boto3
from decimal import Decimal
import json
import urllib
import uuid
import datetime
import time
import os
import base64

textract_client = boto3.client("textract")
s3_client = boto3.client("s3")
dynamo_client = boto3.client("dynamodb")

table_name = os.environ["TABLE_NAME"]
BUCKET_NAME = os.environ["BUCKET_NAME"]


def add_cors_headers(response):
    response["headers"] = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    return response


def lambda_handler(event, context):
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])

    try:
        response = textract_client.detect_document_text(
            Document={"S3Object": {"Bucket": bucket, "Name": key}}
        )

        detected_text = []
        for block in response["Blocks"]:
            if block["BlockType"] == "LINE":
                detected_text.append(block["Text"])

        full_text = " ".join(detected_text)

        ts = time.time()
        timestamp = datetime.datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M:%S")

        table = boto3.resource("dynamodb").Table(table_name)
        item = {
            "id": key,
            "DateTime": timestamp,
            "DetectedText": detected_text,
            "FullText": full_text,
        }
        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "body": json.dumps("Text extracted and stored successfully!"),
        }

    except Exception as e:
        print(
            f"Error processing object {key} from bucket {bucket}. Event: {json.dumps(event)}"
        )
        print(e)
        raise e


def upload_handler(event, context):
    try:
        body = json.loads(event["body"])
        image_data = base64.b64decode(body["image"])

        image_id = str(uuid.uuid4())
        key = f"{image_id}.jpg"

        s3_client.put_object(
            Bucket=BUCKET_NAME, Key=key, Body=image_data, ContentType="image/jpeg"
        )

        response = {"statusCode": 200, "body": json.dumps({"image_id": key})}
        return add_cors_headers(response)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {str(e)}")
        response = {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON in request body"}),
        }
        return add_cors_headers(response)
    except Exception as e:
        print(f"Error uploading image: {str(e)}")
        response = {
            "statusCode": 500,
            "body": json.dumps({"error": "Failed to upload image"}),
        }
        return add_cors_headers(response)


def results_handler(event, context):
    try:
        table = boto3.resource("dynamodb").Table(table_name)

        image_id = None
        if "pathParameters" in event and event["pathParameters"]:
            image_id = event["pathParameters"].get("imageId")

        if image_id:
            response = table.get_item(Key={"id": image_id})
            items = [response["Item"]] if "Item" in response else []
        else:
            response = table.scan()
            items = response.get("Items", [])

        formatted_items = []
        for item in items:
            formatted_items.append(
                {
                    "id": item["id"],
                    "DateTime": item["DateTime"],
                    "DetectedText": item["DetectedText"],
                    "FullText": item["FullText"],
                    "TranslatedText": item.get(
                        "TranslatedText", "Translation not available"
                    ),
                }
            )

        result = {"statusCode": 200, "body": json.dumps(formatted_items, default=str)}
        return add_cors_headers(result)
    except Exception as e:
        print(f"Error retrieving results: {str(e)}")
        result = {
            "statusCode": 500,
            "body": json.dumps({"error": "Failed to retrieve results"}),
        }
        return add_cors_headers(result)
