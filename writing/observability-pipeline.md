---
title: Observability Pipeline
layout: post.njk
date: 2025-09-09
---

<img src='/assets/images/post/observability-pipeline/observability-pipeline.png' height='500px' width='100%' />

## Introduction

An observability pipeline is the end-to-end flow to capture, process, and visualize logs and metrics to gain insights into system health, performance, and user activity.

There are several ways to build the pipeline using different tools and technologies. We will try to understand the components of the pipeline with the help of simple example.

## Pipeline Overview

An observability pipeline typically handles the following operations on ***telemetry data***,

- Collection
- Ingestion
- Processing
- Enrichment
- Storage
- Querying
- Correlation
- Visualisation
- Analytics
- Alerting
- Governance

> **Telementry Data**: Collected information about a system’s performance, behavior, and health that is transmitted for monitoring and analysis

The observability pipeline can include many components and operations as shown in the diagram below:

<img src='/assets/images/post/observability-pipeline/observability-pipeline-stages.png' height='350px' width='100%' />

Pipeline components often overlap with data pipelines, and technology choices vary by architecture and scale.

- **Data Source** : The origin of telemetry data - including application logs, system metrics, traces, and infrastructure logs. _Examples_: Applications (Java, Python etc.), Infrastructure (Kubernetes, Linux Servers etc.)

- **Collection** : The lightweight mechanism that gathers telemetry from data sources via agents, SDKs, or APIs.
_Examples_: Prometheus (Metric Collection), Filebeat

- **Processing** : This can be a data pipeline to clean, filter, enrich, and transfortm the data into a processable format. _Examples_: Kafka, Datadog Processor

- **Storage**: Telemetry data is persistently stored in suitable data stores. _Examples_: Elasticsearch, Grafana Loki, S3, Prometheus (Metric Store)

- **Query**: Enables fast retrieval of telemetry data via domain specific query language. _Examples_: PromQL (Prometheus), Lucene/KQL (Elasticsearch), LogQL (Loki)

- **Visualisation**: Present telemetry data through charts, graphs, heatmaps, geo-visualizations etc. to identify patterns, problems, trends and  anomalies. _Examples_: Grafana, Kibana, PowerBI

- **Alert**: Define thresholds and rules that trigger notifications when systems behave abnormally or violate the rules. _Examples_: Grafana, Elastcsearch security

- **Automation**: To triggers functions, workflows or events for respective action of scaling, remediation, rollback etc. _Examples_: Lambda, Ansible

- **Security**: Controls and policies to secure telemetry data at every stage. Includes encryption, access controls, masking PII, and auditing. _Examples_: TLS, Okta, Secret Manager, IAM

- **Governance & Compliance**: Data management policies for usage, retention, and operational transparency. Ensures observability pipelines align with organizational and legal obligations. _Examples_: Open Policy Agent (OPA), IAM, Elastic Security

## Example

Let's build a very simple pipeline where we are ingesting user location detail and want to view the users on a world map. We will going to use following tools,

- Filebeat (Ingestion)
- Elastic Search (Search and Storage)
- Kibana (Visualisation and Analytics)

Make sure you have docker already installed on your system, we will going to use it for a quick setup. If you are not familiar with it, you can visit [this](https://www.docker.com/get-started/) page to get some basic understanding.

Our goal is to generate some random logs, filebeat will ingest it to elastic search and kibana can help to view it on the world map. This small exercise will help us to understand the pipeline better.

### Generating Sample Logs

We may need to write a small program to generate the random logs which we will ingest to filebeat.

```python
import json
import time
import random

users = ["mark", "bob", "charlie", "david", "james", "carl", "jennie", "jane", "alex"]

log_file = "logs.json"

while True:
    user = random.choice(users)
    log = {
        "username": user,
        "location": {
            "lat": round(random.uniform(-90, 90), 6),
            "lon": round(random.uniform(-180, 180), 6)
        }
    }
    with open(log_file, "a") as f:
        f.write(json.dumps(log) + "\n")
    time.sleep(1)
```

This script will keep on appending logs in `logs.json` file in following format,

```json
...
{"username": "david", "location": {"lat": 46.638099, "lon": -141.664286}}
{"username": "jennie", "location": {"lat": 2.067681, "lon": 6.107782}}
{"username": "charlie", "location": {"lat": -68.763366, "lon": -138.960341}}
{"username": "bob", "location": {"lat": -62.107125, "lon": -119.426837}}
...
```

### Docker Compose Setup

Now, let's create `docker-compose.yml`,

```yml
version: "3.9"
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.15.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.15.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
  
  filebeat:
    image: docker.elastic.co/beats/filebeat:8.15.0
    container_name: filebeat
    user: root
    volumes:
      - ./filebeat.yml:/usr/share/filebeat/filebeat.yml
      - ./logs.json:/usr/share/filebeat/logs/logs.json
    depends_on:
      - elasticsearch
    
volumes:
  es_data:
```

### Filebeat Configuration

We have added Elasticsearch, Kibana and Filebeat. For Filebeat we may need to supply additional configuration through `filebeat.yml`.

```yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /usr/share/filebeat/logs/logs.json
    start_position: beginning
    json.keys_under_root: true 
    json.add_error_key: true
    json.overwrite_keys: true

output.elasticsearch:
  hosts: ["http://elasticsearch:9200"]
```

### Running the Pipeline

Once we have these files we can run following commands.

1. Execute python scripts to keep on adding new log every second,

```shell
python3 log-generator.py
```

2. Run `docker-compose` in separate terminal,

```shell
docker-compose up -d
```

### Accessing Services

This will spin the containers, first run will take few seconds to minutes. Once all the containers are running we can check following URLs,

- ElasticSearch: [http://localhost:9200/](http://localhost:9200/)
- Kibana: [http://localhost:5601/](http://localhost:5601/)

### Kibana: Create Data View

In Kibana we will need to create a data view which specifies which elasticseach indices to use. This way we will be able to see our logs based on the time filter configured on top right.

In the side bar, 

- Analytics > Discover > Create a data view. 
- Define an index pattern matching Filebeat indices, commonly `filebeat-*`.
- Save

<img src='/assets/images/post/observability-pipeline/kibana-edit-data-view.png' height='350px' width='550px' />

<sub> <i>(*Index pattern is matching with three sources in my case which I created manually using dev tool but for your case it would be only one - data stream.)</i></sub>

Once we save this data view we can see logs are coming getting updated (update time filter or press refresh).

<img src='/assets/images/post/observability-pipeline/kibana-data-view.png' height='400px' width='100%' />

This confirms that the logs are properly getting ingested.

### Visualizing User Locations on Map

Now we want to view these location on the map, 

- In Kibana’s sidebar, go to Analytics > Maps.
- Create a new map and add a new layer.
- Select the data view created earlier.
- Choose the location field (latitude/longitude) for geo mapping.
- Green dots representing user locations will appear on the world map.

<img src='/assets/images/post/observability-pipeline/kibana-add-map-layer.png' height='400px' width='100%' />

<img src='/assets/images/post/observability-pipeline/kibana-add-layer-green-dots.png' height='400px' width='100%' />

There are many other features in Kibana you can explore and experiment with to deepen your understanding.

## Summary

The simple setup that we tried can be extended to more complex observability scenarios, enabling real-time insights into applications, infrastructure, and user activity across the globe.

The starting point of any observability pipeline is the data source itself, along with a clear understanding of what you expect from that data—whether it’s querying, visualization, alerting, or automation.
