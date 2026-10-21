import { DomainSummary } from "./types";

// Study notes for AWS Certified Cloud Practitioner (CLF-C02),
// Data Engineer – Associate (DEA-C01) and Machine Learning Engineer – Associate (MLA-C02).
// Structure follows the official exam guides. Check aws.amazon.com/certification for updates.

export const clfSummaries: DomainSummary[] = [
  {
    domain: "cloud-concepts",
    overview: "Why organisations use the cloud: the benefits of AWS, the Well-Architected Framework, migration strategies and cloud economics.",
    sections: [
      {
        heading: "Benefits of the AWS Cloud",
        points: [
          "Trade fixed (capital) expense for variable expense: pay only for what you use.",
          "Economies of scale: aggregated usage across customers lowers prices.",
          "Stop guessing capacity: scale up and down with demand (elasticity).",
          "Increase speed and agility, stop spending money on running data centres, go global in minutes.",
          "High availability = deploy across multiple Availability Zones; fault tolerance = keep working with no interruption when components fail.",
        ],
      },
      {
        heading: "AWS Well-Architected Framework (6 pillars)",
        points: [
          "Operational excellence: operations as code, small reversible changes, learn from failures.",
          "Security: strong identity foundation, traceability, security at all layers, protect data in transit and at rest.",
          "Reliability: automatically recover from failure, scale horizontally, stop guessing capacity.",
          "Performance efficiency: use the right resource types, go global, use serverless, experiment more often.",
          "Cost optimization: consumption model, measure efficiency, stop paying for undifferentiated heavy lifting.",
          "Sustainability: minimise environmental impact, maximise utilisation. Review workloads with the Well-Architected Tool.",
        ],
      },
      {
        heading: "Migration",
        points: [
          "AWS CAF perspectives: Business, People, Governance (business side) and Platform, Security, Operations (technical side).",
          "7 Rs: Retire, Retain, Rehost (lift and shift), Relocate (e.g. VMware Cloud on AWS), Repurchase (move to SaaS), Replatform (lift, tinker and shift — e.g. to RDS), Refactor (re-architect, e.g. serverless).",
          "Tools: AWS Application Migration Service (servers), AWS DMS (databases with minimal downtime; Schema Conversion Tool for different engines), Snowball Edge (offline transfer of large datasets), DataSync (online file transfer).",
        ],
      },
      {
        heading: "Cloud economics",
        points: [
          "Removed costs: data centre space, power, cooling, hardware refreshes, physical security.",
          "Remaining costs: what you consume, plus people and licences (BYOL vs licence-included).",
          "Rightsizing: match instance type and size to measured needs (AWS Compute Optimizer helps).",
          "Managed services reduce operational costs (less patching, backups and maintenance).",
        ],
      },
    ],
    examTips: [
      "'Pay as you go instead of buying servers' → trade capex for variable expense.",
      "'Automatically add/remove capacity' → elasticity (Auto Scaling).",
      "Move to managed DB without code changes → replatform. Move to SaaS → repurchase.",
      "Six pillars — remember sustainability is one of them.",
    ],
  },
  {
    domain: "security-compliance",
    overview: "The largest security share of the exam: the shared responsibility model, IAM, security and governance services, and data protection.",
    sections: [
      {
        heading: "Shared responsibility model",
        points: [
          "AWS: security OF the cloud — facilities, hardware, network, hypervisor, managed service infrastructure.",
          "Customer: security IN the cloud — data, IAM, guest OS and patches on EC2, security groups, encryption choices, application code.",
          "Managed services shift more to AWS: on RDS AWS patches the OS and engine; on Lambda AWS manages the runtime environment.",
        ],
      },
      {
        heading: "Identity and access",
        points: [
          "Root user: enable MFA, don't use it daily, don't create access keys.",
          "IAM users (people or apps with long-term credentials), groups (collections of users), roles (temporary credentials for services, apps and federated users), policies (JSON permissions).",
          "Use roles for EC2/Lambda instead of storing access keys. Apply least privilege.",
          "IAM Identity Center: single sign-on for the workforce across accounts. Amazon Cognito: sign-in for customers of your apps.",
          "AWS Organizations: manage many accounts, OUs, consolidated billing and service control policies (SCPs) that cap permissions.",
        ],
      },
      {
        heading: "Security services",
        points: [
          "Shield Standard (free, automatic DDoS protection) / Shield Advanced (paid, 24/7 response team, cost protection).",
          "AWS WAF: layer 7 filtering (SQL injection, XSS, rate limiting) on CloudFront, ALB, API Gateway.",
          "GuardDuty: threat detection from logs. Inspector: vulnerability scanning of EC2, ECR images and Lambda. Macie: sensitive data in S3. Detective: investigate root cause. Security Hub: central view of findings.",
          "Network: security groups (stateful, instance-level, allow only) and network ACLs (stateless, subnet-level, allow and deny).",
        ],
      },
      {
        heading: "Governance, compliance and data protection",
        points: [
          "AWS Artifact: download AWS compliance reports (SOC, ISO, PCI) and agreements.",
          "CloudTrail: who did what, when, from where (API audit). AWS Config: resource configuration history and compliance rules. CloudWatch: metrics, logs, alarms.",
          "Encryption: KMS manages keys (at rest), ACM provides TLS certificates (in transit), CloudHSM for dedicated hardware.",
          "Secrets Manager stores secrets with automatic rotation; Systems Manager Parameter Store stores configuration and secure strings.",
          "Trusted Advisor checks for security, cost, performance, fault tolerance and service limits.",
        ],
      },
    ],
    examTips: [
      "Patch the guest OS on EC2 → customer. Patch the RDS engine → AWS.",
      "Compliance report download → Artifact. Who deleted it → CloudTrail. Is it configured correctly → Config.",
      "SQL injection → WAF. DDoS → Shield. PII in S3 → Macie. CVEs → Inspector. Threats → GuardDuty.",
      "Restrict all accounts in an organisation → SCP.",
    ],
  },
  {
    domain: "cloud-tech",
    overview: "The largest domain: deployment methods, global infrastructure and the core services across compute, storage, databases, networking, analytics and AI.",
    sections: [
      {
        heading: "Deployment and global infrastructure",
        points: [
          "Ways to use AWS: Management Console, CLI, SDKs, and infrastructure as code (CloudFormation, AWS CDK).",
          "Regions contain multiple isolated Availability Zones; edge locations serve CloudFront and Route 53.",
          "Local Zones (compute near big cities), Wavelength (inside 5G networks), Outposts (AWS in your own data centre).",
        ],
      },
      {
        heading: "Compute",
        points: [
          "EC2 families: general purpose (M/T), compute optimised (C), memory optimised (R/X), storage optimised (I/D), accelerated (P/G/Inf/Trn).",
          "Lambda: serverless functions triggered by events, up to 15 minutes per invocation.",
          "Containers: ECS, EKS (Kubernetes), Fargate (serverless containers), ECR (image registry).",
          "Elastic Beanstalk (PaaS for web apps), Lightsail (simple VPS bundles), AWS Batch (batch jobs).",
          "Elastic Load Balancing (ALB layer 7, NLB layer 4) + EC2 Auto Scaling.",
        ],
      },
      {
        heading: "Storage and databases",
        points: [
          "S3 classes: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant Retrieval, Glacier Flexible Retrieval, Glacier Deep Archive (cheapest). Lifecycle rules move objects between classes.",
          "EBS: block storage for one instance in one AZ (snapshots to S3). Instance store: ephemeral. EFS: shared NFS for Linux. FSx: Windows, Lustre, NetApp ONTAP, OpenZFS. Storage Gateway: hybrid storage.",
          "RDS (managed relational: MySQL, PostgreSQL, etc.), Aurora (AWS's high-performance MySQL/PostgreSQL), DynamoDB (serverless NoSQL), ElastiCache (in-memory cache), Redshift (data warehouse), Neptune (graph), DocumentDB (MongoDB-compatible).",
        ],
      },
      {
        heading: "Networking, analytics, integration and AI",
        points: [
          "VPC with public/private subnets, internet gateway, NAT gateway; Direct Connect (private line) vs Site-to-Site VPN (encrypted over internet); Route 53 (DNS); CloudFront (CDN); Global Accelerator.",
          "Analytics: Athena (SQL on S3), Glue (ETL + Data Catalog), Kinesis (streaming), EMR (Spark/Hadoop), QuickSight (BI dashboards), OpenSearch.",
          "Integration: SQS (queues, decoupling), SNS (pub/sub notifications), EventBridge (event bus), Step Functions (workflows).",
          "AI/ML: SageMaker AI (build/train/deploy models), Bedrock (foundation models via API), Amazon Q (AI assistant), Rekognition (images/video), Comprehend (text NLP), Textract (documents), Transcribe (speech-to-text), Polly (text-to-speech), Translate, Lex (chatbots).",
        ],
      },
    ],
    examTips: [
      "Run code without servers → Lambda; containers without servers → Fargate.",
      "Shared file system for many Linux instances → EFS.",
      "Cheapest archive → Glacier Deep Archive; unknown access pattern → Intelligent-Tiering.",
      "Private dedicated line → Direct Connect; CDN → CloudFront; DNS → Route 53.",
    ],
  },
  {
    domain: "billing-support",
    overview: "How AWS charges, how to control and analyse cost, and which support plan or resource fits a situation.",
    sections: [
      {
        heading: "Pricing models",
        points: [
          "On-Demand: pay per second/hour, no commitment — short or unpredictable workloads.",
          "Savings Plans (1 or 3 years, $/hour commitment): Compute Savings Plans are the most flexible (any family, Region, Fargate, Lambda); EC2 Instance Savings Plans give bigger discounts for one family in one Region.",
          "Reserved Instances: 1 or 3 years for a specific instance configuration; also exist for RDS, Redshift, ElastiCache.",
          "Spot Instances: up to 90% off, can be interrupted with two minutes' notice.",
          "Dedicated Hosts (physical server, BYOL licensing) vs Dedicated Instances (single-tenant hardware).",
          "Data transfer in is generally free; out to the internet and between Regions is charged.",
        ],
      },
      {
        heading: "Cost management tools",
        points: [
          "Pricing Calculator: estimate before you build.",
          "Cost Explorer: visualise and forecast past/current spend. Cost and Usage Report (CUR): most detailed billing data.",
          "AWS Budgets: alerts and actions when cost/usage passes thresholds. Cost Anomaly Detection: ML-based unusual spend alerts.",
          "Cost allocation tags group costs by project/team. Organizations consolidated billing combines usage for volume discounts.",
        ],
      },
      {
        heading: "Support plans and resources",
        points: [
          "Basic (free): documentation, re:Post, core Trusted Advisor checks, Health Dashboard.",
          "Developer: business-hours email to Cloud Support Associates.",
          "Business: 24/7 phone/chat/email, < 1 h for production down, full Trusted Advisor.",
          "Enterprise On-Ramp: pool of TAMs, < 30 min business-critical. Enterprise: designated TAM, < 15 min business-critical, concierge billing support.",
          "Other help: AWS re:Post, Knowledge Center, AWS Partner Network, AWS Marketplace (third-party software), AWS Professional Services.",
        ],
      },
    ],
    examTips: [
      "Interruptible job, lowest cost → Spot. Steady 24/7 with flexibility → Compute Savings Plan.",
      "Estimate future cost → Pricing Calculator; analyse past cost → Cost Explorer; alert → Budgets.",
      "Designated TAM → Enterprise. 24/7 phone at lowest cost → Business.",
    ],
  },
];

export const deaSummaries: DomainSummary[] = [
  {
    domain: "data-ingestion",
    overview: "The heaviest domain: getting data into AWS in batch and streaming form, transforming it with Glue, EMR and Lambda, and orchestrating pipelines.",
    sections: [
      {
        heading: "Streaming ingestion",
        points: [
          "Kinesis Data Streams: ordered per shard (partition key), replay within retention (24 h default, up to 365 days); provisioned or on-demand capacity. Hot partition key → ProvisionedThroughputExceeded.",
          "Enhanced fan-out gives each consumer its own 2 MB/s per shard throughput.",
          "Amazon Data Firehose: fully managed delivery to S3, Redshift, OpenSearch, Splunk and HTTP; buffers by size/time (near real-time); optional Lambda transform and Parquet/ORC conversion using a Glue table schema.",
          "Managed Service for Apache Flink (formerly Kinesis Data Analytics): stateful stream processing, windowed aggregations.",
          "Amazon MSK: managed Apache Kafka (provisioned or serverless); MSK Connect for connectors.",
        ],
      },
      {
        heading: "Batch ingestion and migration",
        points: [
          "AWS DMS: full load plus ongoing change data capture (CDC); use the Schema Conversion Tool for heterogeneous engines.",
          "AWS DataSync: move files from on-premises NFS/SMB/HDFS to S3, EFS or FSx. AWS Transfer Family: SFTP/FTPS into S3.",
          "Amazon AppFlow: ingest from SaaS apps such as Salesforce and ServiceNow.",
          "Zero-ETL integrations replicate data from Aurora, RDS or DynamoDB into Redshift without building pipelines.",
          "S3 event notifications (to Lambda, SQS, SNS or EventBridge) trigger processing when files arrive.",
        ],
      },
      {
        heading: "Transformation",
        points: [
          "AWS Glue ETL: serverless Spark (or Python shell); DynamicFrames handle messy schemas; job bookmarks process only new data; Glue Streaming for continuous jobs.",
          "Glue crawlers infer schemas and create/update tables in the Glue Data Catalog.",
          "Amazon EMR (on EC2, on EKS, or EMR Serverless): Spark, Hive, Presto for large or custom processing; transient clusters for cost.",
          "Lambda for lightweight, event-driven transforms (max 15 minutes, limited memory).",
          "Prefer columnar formats (Parquet/ORC) with compression (Snappy, ZSTD), avoid many small files, and partition on common filter columns.",
        ],
      },
      {
        heading: "Orchestration",
        points: [
          "AWS Step Functions: serverless state machines with retries, error catching and parallel branches; native integrations with Glue, EMR, Lambda, Athena.",
          "Amazon MWAA: managed Apache Airflow when teams already use DAGs.",
          "Glue workflows and triggers for Glue-only pipelines; EventBridge (Scheduler) for cron and event-based starts.",
          "Make pipelines idempotent so retries don't create duplicates.",
        ],
      },
    ],
    examTips: [
      "Replay and multiple consumers with ordering → Kinesis Data Streams. Just land data in S3/Redshift → Firehose.",
      "Database migration with ongoing changes → DMS with CDC.",
      "Only process new files in Glue → job bookmarks.",
      "Existing Airflow DAGs → MWAA; serverless workflow with retries → Step Functions.",
    ],
  },
  {
    domain: "data-store",
    overview: "Choosing and designing data stores: S3 data lakes, Redshift, DynamoDB and relational databases, catalogues, open table formats and lifecycle management.",
    sections: [
      {
        heading: "S3 data lakes",
        points: [
          "Partition by common filters (e.g. year=/month=/day=) so Athena and Spectrum scan less data; Athena partition projection avoids managing huge partition lists.",
          "Lifecycle rules move data to cheaper classes (Standard-IA, Glacier) and expire it; Intelligent-Tiering for unknown access patterns.",
          "Open table formats (Apache Iceberg, Hudi, Delta Lake) add ACID transactions, upserts/deletes, schema evolution and time travel on S3. Athena and Glue support Iceberg natively.",
          "Glue Data Catalog is the central metastore for Athena, EMR, Redshift Spectrum and Glue.",
        ],
      },
      {
        heading: "Amazon Redshift",
        points: [
          "Distribution styles: KEY (co-locate rows joined on the same column), ALL (copy small dimension tables to every node), EVEN (round-robin), AUTO (Redshift decides).",
          "Sort keys speed up range filters and joins; zone maps skip blocks.",
          "COPY loads in parallel from S3 — split input into multiple files (multiple of slices); UNLOAD exports query results to S3 (e.g. as Parquet).",
          "Redshift Spectrum queries data in S3 without loading it; Serverless removes cluster management; materialized views pre-compute results; concurrency scaling handles bursts; data sharing shares live data across clusters/accounts.",
        ],
      },
      {
        heading: "Other stores",
        points: [
          "DynamoDB: design partition keys for even access; GSI (different partition/sort key, eventually consistent, any time) vs LSI (same partition key, defined at creation); TTL to expire items; Streams for CDC; on-demand vs provisioned capacity; DAX for microsecond reads.",
          "RDS/Aurora for OLTP; read replicas offload reads; Aurora Serverless v2 scales automatically.",
          "OpenSearch Service for log analytics and full-text search; Neptune for graphs; Keyspaces for Cassandra; MemoryDB/ElastiCache for in-memory.",
          "Pick stores by access pattern: OLTP vs OLAP, key-value lookups, search, time-series, graph.",
        ],
      },
    ],
    examTips: [
      "Large fact table joined on customer_id → KEY distribution on customer_id; small dimension → ALL.",
      "Query S3 from Redshift without loading → Spectrum.",
      "Upserts/time travel on S3 → Apache Iceberg tables.",
      "Query by a non-key attribute in DynamoDB → global secondary index.",
    ],
  },
  {
    domain: "data-ops",
    overview: "Running pipelines in production: automation, monitoring, data quality, troubleshooting and query performance.",
    sections: [
      {
        heading: "Monitoring and troubleshooting",
        points: [
          "CloudWatch metrics, logs and alarms for Glue, EMR, Lambda, Kinesis and Redshift; SNS for notifications; CloudWatch Logs Insights for log queries.",
          "Glue job metrics and Spark UI show skew, memory pressure and slow stages; increase workers or change worker type (G.1X, G.2X) for memory errors.",
          "Kinesis: IteratorAgeMilliseconds rising means consumers are falling behind.",
          "DMS: use CloudWatch metrics and task logs, and enable data validation to compare source and target.",
          "Step Functions execution history shows which state failed; configure Retry and Catch.",
        ],
      },
      {
        heading: "Data quality and preparation",
        points: [
          "AWS Glue Data Quality: rules in DQDL (e.g. completeness, uniqueness, value ranges) in jobs or on catalogue tables; fail or quarantine bad data.",
          "AWS Glue DataBrew: no-code visual profiling, cleaning and normalisation with 250+ transforms; recipes can run as jobs.",
          "Handle late and duplicate data with deduplication keys and idempotent writes (e.g. Iceberg MERGE).",
        ],
      },
      {
        heading: "Analytics and query performance",
        points: [
          "Athena: cost per TB scanned — use Parquet/ORC, compression, partitions, and CTAS to convert data; workgroups enforce limits and separate costs.",
          "Redshift: use EXPLAIN to inspect plans, VACUUM to re-sort/reclaim space, ANALYZE to update statistics, workload management (WLM, auto WLM) and query monitoring rules to protect queues.",
          "EMR: managed scaling; use Spot for task nodes, On-Demand for primary/core nodes.",
          "QuickSight with SPICE in-memory engine for fast dashboards.",
        ],
      },
    ],
    examTips: [
      "Athena too slow/expensive → convert to partitioned Parquet (CTAS) and filter on partition columns.",
      "Consumer lag on Kinesis → IteratorAge metric.",
      "Rule-based data validation in Glue → Glue Data Quality (DQDL); no-code cleaning → DataBrew.",
      "Redshift query slow after big deletes → VACUUM and ANALYZE.",
    ],
  },
  {
    domain: "data-governance",
    overview: "Securing and governing data: authentication and authorisation, encryption, auditing, privacy and fine-grained lake permissions.",
    sections: [
      {
        heading: "Access control",
        points: [
          "Give Glue, EMR and Redshift IAM roles with least-privilege policies; avoid long-term keys.",
          "AWS Lake Formation: central permissions for the Glue Data Catalog and S3 data — database, table, column, row and cell-level security, plus LF-Tags for tag-based access control at scale.",
          "Cross-account sharing through Lake Formation (uses AWS RAM) or Redshift data sharing.",
          "Redshift row-level security and dynamic data masking; Athena workgroups separate users and enforce settings.",
        ],
      },
      {
        heading: "Encryption and network",
        points: [
          "S3: SSE-S3 (AWS-managed keys), SSE-KMS (customer control, key policies, audit in CloudTrail), DSSE-KMS, or client-side encryption; enforce with bucket policies and default encryption.",
          "Encrypt Redshift, RDS, EBS, Glue job bookmarks and Kinesis with KMS; use TLS in transit.",
          "VPC endpoints keep traffic private: gateway endpoints for S3 and DynamoDB, interface endpoints (PrivateLink) for most other services.",
          "Secrets Manager for database credentials with rotation.",
        ],
      },
      {
        heading: "Auditing, privacy and governance",
        points: [
          "CloudTrail: management events by default; enable data events for S3 object-level and Lambda activity; CloudTrail Lake for SQL queries over events.",
          "Amazon Macie finds PII in S3; mask or tokenise sensitive columns during ETL (Glue PII detection transform).",
          "AWS Config tracks configuration compliance; Redshift audit logging records connections and queries.",
          "Amazon DataZone / SageMaker Catalog for business data catalogues, data products and subscription-based sharing.",
        ],
      },
    ],
    examTips: [
      "Column- or row-level access on a data lake → Lake Formation permissions (or LF-Tags at scale).",
      "Private S3 access from a VPC without NAT → S3 gateway endpoint.",
      "Who read this S3 object → CloudTrail data events.",
      "Find PII in S3 → Macie.",
    ],
  },
];

export const mlaSummaries: DomainSummary[] = [
  {
    domain: "ml-data-prep",
    overview: "Getting data ready for ML and generative AI: ingestion and storage, transformation and feature engineering, data quality and bias, and data for RAG.",
    sections: [
      {
        heading: "Collect and store data",
        points: [
          "Sources: S3 (most common), EFS/FSx for Lustre (high-throughput file access for training), RDS, DynamoDB, Redshift, OpenSearch; streaming via Kinesis, Flink or MSK.",
          "Formats: Parquet/ORC for analytics; CSV/JSON for simplicity; RecordIO-protobuf for some built-in algorithms.",
          "Training input modes: File (copy to the instance), Pipe (stream from S3), FastFile (stream with file semantics, starts quickly).",
          "SageMaker Feature Store: online store (low-latency lookups at inference) and offline store (S3, for training and point-in-time queries).",
          "Vector stores for RAG: OpenSearch Service/Serverless vector search, Aurora PostgreSQL with pgvector, Amazon S3 Vectors; Bedrock Knowledge Bases can manage chunking, embedding and storage.",
        ],
      },
      {
        heading: "Transform and engineer features",
        points: [
          "Tools: SageMaker Data Wrangler (in SageMaker Canvas), Glue, DataBrew, EMR Spark, SageMaker Processing jobs, Lambda for streaming records.",
          "Techniques: imputation for missing values, one-hot encoding for nominal categories, label/ordinal encoding for ordered ones, scaling (standardisation, min-max), log transforms for skew, binning, tokenisation.",
          "Avoid data leakage: fit scalers/encoders on training data only; split time series chronologically.",
          "For RAG: chunk documents (fixed, semantic or hierarchical), create embeddings with an embedding model (e.g. Amazon Titan Text Embeddings), keep metadata for filtering.",
          "Detect and mask PII/PHI (Amazon Comprehend PII detection, Macie, Glue sensitive data detection) before training or indexing.",
        ],
      },
      {
        heading: "Data quality, labelling and bias",
        points: [
          "Validate with Glue Data Quality or DataBrew profiles; handle outliers and duplicates.",
          "SageMaker Ground Truth (and Ground Truth Plus) for human labelling with active learning.",
          "Class imbalance: resampling (oversampling/SMOTE, undersampling), class weights, or more data; use precision/recall rather than accuracy.",
          "SageMaker Clarify pre-training bias metrics, e.g. class imbalance (CI) and difference in proportions of labels (DPL).",
        ],
      },
    ],
    examTips: [
      "Training data too large to copy, want fast start → FastFile or Pipe mode (or FSx for Lustre).",
      "Same features for training and real-time inference → Feature Store offline + online.",
      "Imbalanced fraud data → resampling/class weights, measure recall/F1/PR-AUC.",
      "Vector store with SQL → Aurora PostgreSQL pgvector; managed RAG pipeline → Bedrock Knowledge Bases.",
    ],
  },
  {
    domain: "ml-model-dev",
    overview: "Choosing the modelling approach (AI service, built-in algorithm, custom model or foundation model), training and tuning, and evaluating models and FMs.",
    sections: [
      {
        heading: "Choosing an approach",
        points: [
          "Use an AI service when it fits: Rekognition (images/video), Textract (documents), Comprehend (text), Transcribe, Translate, Polly.",
          "Bedrock foundation models for generative tasks; pick by quality, context window, latency, cost and modality. Prompt engineering → RAG (add knowledge) → fine-tuning (change behaviour/style) in increasing effort.",
          "SageMaker JumpStart for pre-trained open models and solution templates.",
          "Built-in algorithms: XGBoost (tabular), Linear Learner, K-Means, PCA, Random Cut Forest (anomalies), DeepAR (time-series forecasting), BlazingText (text classification/word2vec), Factorization Machines (sparse/recommendations), Image Classification, Object Detection.",
          "Script mode: bring your own PyTorch/TensorFlow/scikit-learn code in AWS framework containers; or bring your own container.",
        ],
      },
      {
        heading: "Training and tuning",
        points: [
          "SageMaker Automatic Model Tuning: Bayesian, random, grid or Hyperband strategies; early stopping; warm start from previous jobs.",
          "Managed Spot Training with checkpointing to S3 cuts training cost up to ~90%.",
          "Distributed training: data parallelism (model fits on one GPU, split the data) vs model parallelism (model too big for one GPU).",
          "Overfitting remedies: regularisation (L1/L2), dropout, early stopping, simpler model, more data, feature selection. Underfitting: more features, more complex model, train longer.",
          "Bedrock customisation: fine-tuning (labelled prompt-completion pairs), continued pre-training (unlabelled domain text), model distillation (teacher → student). Watch for catastrophic forgetting.",
          "SageMaker Debugger detects training issues (vanishing gradients, overfitting); managed MLflow tracks experiments.",
        ],
      },
      {
        heading: "Evaluation",
        points: [
          "Classification: confusion matrix, precision (few false positives), recall (few false negatives), F1, ROC-AUC, PR-AUC. Regression: RMSE, MAE, R².",
          "Generative: ROUGE (summarisation), BLEU (translation), BERTScore (semantic similarity), perplexity; human evaluation and LLM-as-a-judge via Bedrock evaluations.",
          "SageMaker Clarify: post-training bias metrics and explainability with SHAP values.",
          "Compare candidate models with shadow testing before switching production traffic.",
        ],
      },
    ],
    examTips: [
      "Missing a fraud case is costly → optimise recall.",
      "Forecast many related time series → DeepAR. Anomaly detection → Random Cut Forest.",
      "Model needs company knowledge that changes → RAG; needs consistent style/format → fine-tuning.",
      "Reduce training cost → Managed Spot Training with checkpoints.",
    ],
  },
  {
    domain: "ml-deploy",
    overview: "Picking the right inference option, provisioning and scaling infrastructure, deploying FMs and agents, and automating ML with CI/CD.",
    sections: [
      {
        heading: "SageMaker inference options",
        points: [
          "Real-time endpoints: persistent, low latency, auto scaling (target tracking on InvocationsPerInstance).",
          "Serverless inference: intermittent traffic, scales to zero, tolerates cold starts; no GPUs.",
          "Asynchronous inference: large payloads (up to 1 GB) and long processing (up to 1 hour), queued requests, can scale to zero.",
          "Batch transform: offline predictions on whole datasets, no persistent endpoint.",
          "Multi-model endpoints host many models (same framework) behind one endpoint, loading on demand; multi-container endpoints run different containers; inference components share an endpoint's resources.",
          "Inference Recommender benchmarks instance types; Inferentia (Inf2) and SageMaker Neo optimise cost/latency.",
        ],
      },
      {
        heading: "Foundation models and agents",
        points: [
          "Bedrock on-demand (pay per token), batch inference (lower price, asynchronous) and Provisioned Throughput (reserved model units, used for steady high volume and many custom models).",
          "Cross-Region inference profiles spread requests across Regions for higher throughput.",
          "Bedrock Custom Model Import brings your own fine-tuned open-weight models into Bedrock.",
          "Bedrock Knowledge Bases provide managed RAG (ingestion, embeddings, vector store, retrieval, reranking). Bedrock Prompt Management versions prompts.",
          "Agents: Bedrock Agents (managed action groups and tools) and Amazon Bedrock AgentCore (runtime, memory, identity, gateway and observability for deploying agents built with any framework).",
        ],
      },
      {
        heading: "Infrastructure and CI/CD",
        points: [
          "Deploy with the SageMaker Python SDK, Boto3, CLI, CloudFormation or CDK; run endpoints in private VPC subnets.",
          "SageMaker Pipelines: processing, training, evaluation, condition and model-registration steps.",
          "SageMaker Model Registry: model package groups, versions and approval status; an approval event (EventBridge) can trigger deployment through CodePipeline/CodeBuild.",
          "Deployment guardrails: blue/green with all-at-once, canary or linear traffic shifting and automatic rollback on CloudWatch alarms. Shadow variants test new models on copied traffic.",
          "Orchestrate wider workflows with Step Functions or MWAA; automate retraining on schedules or drift events.",
        ],
      },
    ],
    examTips: [
      "Spiky, infrequent traffic, OK with cold start → serverless inference. 500 MB payload, 20 min processing → asynchronous.",
      "Thousands of per-customer models → multi-model endpoint.",
      "Shift 10% traffic first and roll back automatically → blue/green canary with CloudWatch alarm.",
      "Deploy after approval in Model Registry → EventBridge rule → CodePipeline.",
    ],
  },
  {
    domain: "ml-operate-secure",
    overview: "Keeping ML and AI solutions healthy, efficient and secure in production: monitoring and drift, cost optimisation, and security controls including guardrails.",
    sections: [
      {
        heading: "Monitoring",
        points: [
          "SageMaker Model Monitor with data capture: data quality, model quality (needs ground truth), bias drift and feature attribution drift (Clarify) against a baseline.",
          "Data drift = input distribution changes; concept drift = relationship between inputs and target changes.",
          "CloudWatch endpoint metrics: ModelLatency, OverheadLatency, Invocations, 4XX/5XX errors, CPU/GPU utilisation; alarms trigger scaling, rollbacks or retraining.",
          "Generative AI: Bedrock model invocation logging, CloudWatch GenAI observability and AgentCore observability for traces, token usage and latency; X-Ray for distributed tracing.",
          "A/B testing with production variants and traffic weights.",
        ],
      },
      {
        heading: "Cost and performance",
        points: [
          "Right-size with Inference Recommender; scale to zero with serverless/async; use auto scaling.",
          "Spot for training; SageMaker Savings Plans for steady usage; Inferentia/Trainium and Graviton for price-performance.",
          "Track spend with Cost Explorer, Budgets and cost allocation tags; for FMs, monitor tokens, embeddings and vector storage costs.",
        ],
      },
      {
        heading: "Security",
        points: [
          "Least-privilege SageMaker execution roles; SageMaker Role Manager; IAM condition keys to require VPC and encryption settings.",
          "Network: VPC-only Studio domains, VPC endpoints (PrivateLink) for SageMaker and Bedrock APIs, network isolation for training/inference containers, inter-container traffic encryption.",
          "Encrypt data, model artifacts, notebooks and volumes with KMS; store credentials in Secrets Manager.",
          "Audit with CloudTrail and AWS Config; scan container images with Amazon Inspector and code with CodeGuru Security.",
          "Bedrock Guardrails: content filters, denied topics, word filters, sensitive information (PII) filters with masking, contextual grounding checks against hallucinations. Prefer IAM/short-term credentials over long-term Bedrock API keys.",
        ],
      },
    ],
    examTips: [
      "Predictions degrade because input data changed → Model Monitor data quality/drift with data capture.",
      "Block a topic and mask PII in a chatbot → Bedrock Guardrails.",
      "Training container must not reach the internet → network isolation (+ VPC).",
      "Steady endpoint usage, lower cost → SageMaker Savings Plans; training → Managed Spot.",
    ],
  },
];
