import { DomainSummary } from "./types";

// Study notes for Exam AI-300: Operationalizing Machine Learning and Generative AI Solutions
// (Microsoft Certified: Machine Learning Operations Engineer Associate).
// Structure follows the official skills-measured outline. Always check the
// official study guide on Microsoft Learn for the latest changes.

export const ai300Summaries: DomainSummary[] = [
  {
    domain: "mlops-infra",
    overview:
      "Setting up the Azure Machine Learning foundation: workspaces, data and compute, reusable assets, and deploying all of it as code through GitHub with secure networking.",
    sections: [
      {
        heading: "Workspaces and their dependencies",
        points: [
          "A workspace is the top-level resource for ML work. It depends on a Storage account (default datastores), Key Vault (secrets), Application Insights (endpoint monitoring) and a Container Registry (environment images, can be created on first use).",
          "Default datastores include workspaceblobstore (the default) and workspacefilestore. Datastores point at Blob, ADLS Gen2 or Azure Files and can use credential-based (key/SAS) or identity-based access.",
          "Prefer identity-based datastore access: jobs then use the user's identity or the compute's managed identity instead of a stored key.",
          "Use built-in roles for least privilege: AzureML Data Scientist (do almost everything except manage compute and workspace settings) and AzureML Compute Operator (manage compute).",
        ],
      },
      {
        heading: "Compute targets",
        points: [
          "Compute instance: a single-user dev box for notebooks and testing. Use idle shutdown and schedules to save cost.",
          "Compute cluster: autoscaling multi-node training compute. Set minimum nodes to 0 so it scales to zero when idle; low-priority VMs are cheaper but can be pre-empted.",
          "Serverless compute: submit jobs without creating or managing a cluster; Azure ML provisions and releases compute per job.",
          "Kubernetes compute: attach AKS or Azure Arc-enabled clusters for training or inference on your own Kubernetes.",
        ],
      },
      {
        heading: "Assets: data, environments, components, registries",
        points: [
          "Data asset types: uri_file (one file), uri_folder (a folder) and mltable (a tabular schema with load instructions). Assets are versioned and immutable per version.",
          "Environments define the runtime: curated (Microsoft-maintained) or custom, built from a Docker image plus a conda YAML or a Docker build context.",
          "Components are reusable, versioned pipeline steps defined in YAML: inputs, outputs, command, code and environment.",
          "Registries share models, components and environments across workspaces, teams and regions, e.g. promoting a model from a dev workspace to a prod workspace.",
        ],
      },
      {
        heading: "Infrastructure as code and CI/CD",
        points: [
          "Use the Azure ML CLI v2 (az ml ...) with YAML specs, or Bicep (Microsoft.MachineLearningServices/workspaces) for repeatable deployments.",
          "GitHub Actions should authenticate with OpenID Connect (federated credentials on a service principal or managed identity) via azure/login, so no long-lived secrets are stored.",
          "Keep ML code, job YAML and infrastructure templates in Git; use separate dev/test/prod workspaces with branch protection and approvals between environments.",
          "Azure ML records the Git commit and repository for jobs submitted from a cloned repo, giving traceability from model to code.",
        ],
      },
      {
        heading: "Network isolation",
        points: [
          "Disable public network access and use a private endpoint for the workspace so it is only reachable from your virtual network.",
          "A workspace managed virtual network isolates compute. Outbound modes: 'Allow internet outbound' or 'Allow only approved outbound' (with explicit outbound rules for needed services).",
          "Dependent resources (Storage, Key Vault, ACR) should also be locked down with private endpoints.",
        ],
      },
    ],
    examTips: [
      "Scale-to-zero cost question → compute cluster with min nodes 0 (or serverless compute).",
      "Sharing assets across workspaces or regions → registry.",
      "No secrets in GitHub → OIDC federated credentials.",
      "Strictest outbound control → managed VNet with 'Allow only approved outbound'.",
    ],
  },
  {
    domain: "ml-lifecycle",
    overview:
      "The heaviest domain: training and tracking models, registering and governing them, deploying to online and batch endpoints, and monitoring production to trigger retraining.",
    sections: [
      {
        heading: "Training and experiment tracking",
        points: [
          "Azure ML workspaces are MLflow tracking servers. Inside Azure ML jobs the tracking URI is set automatically; log with mlflow.log_param / log_metric / log_artifact or enable mlflow.autolog().",
          "Command jobs run a training script on compute with an environment and inputs; compare runs in the studio or query them with MLflow.",
          "Automated ML supports classification, regression, forecasting, computer vision and NLP. You set the primary metric, exit criteria (timeout, trials) and featurization.",
          "Sweep jobs tune hyperparameters. Sampling: random, grid (discrete choice values only) or Bayesian. Early termination policies: Bandit, Median stopping, Truncation selection. Bayesian sampling does not support early termination.",
          "Distributed training: set instance_count and a distribution (PyTorch, TensorFlow or MPI) with processes per instance.",
        ],
      },
      {
        heading: "Pipelines",
        points: [
          "Pipelines chain components (prep → train → evaluate → register) and can be built with the Python SDK @pipeline decorator or YAML.",
          "Unchanged steps can be reused from previous runs, which saves time and compute.",
          "Schedule pipeline jobs with cron or recurrence triggers for regular retraining.",
        ],
      },
      {
        heading: "Registering, versioning and governance",
        points: [
          "Model types: mlflow_model, custom_model and triton_model. An MLflow model carries an MLmodel file with its signature and dependencies.",
          "MLflow models support no-code deployment: Azure ML generates the scoring script and environment for you.",
          "Each registration creates a new version; use tags and stages to manage lifecycle. Archiving hides a model or version from lists without breaking existing references.",
          "The Responsible AI dashboard (built from RAI pipeline components) covers error analysis, fairness, model interpretability, counterfactuals and causal analysis.",
          "With managed feature store, a feature retrieval specification is packaged with the model so inference retrieves the same features used in training.",
        ],
      },
      {
        heading: "Deployment",
        points: [
          "Managed online endpoints: real-time, low-latency scoring. An endpoint holds one or more deployments; traffic is split between them by percentage.",
          "Safe rollout: deploy green alongside blue, mirror (shadow) a percentage of live traffic to green — mirrored responses are not returned to clients — then shift traffic gradually and roll back by moving traffic back.",
          "Custom models need a scoring script with init() (load the model once) and run() (score each request).",
          "Batch endpoints: asynchronous scoring of large datasets; results are written to a datastore. Tune mini_batch_size, max_concurrency_per_instance, instance count and error_threshold. Batch endpoints can also host pipeline component deployments.",
          "Troubleshoot online deployments locally with --local (requires Docker) and read container logs with az ml online-deployment get-logs.",
          "Auth: online endpoints support keys, Azure ML tokens or Microsoft Entra tokens; batch endpoints use Microsoft Entra ID.",
        ],
      },
      {
        heading: "Monitoring and retraining",
        points: [
          "Enable data collection on the deployment to capture production inputs and outputs for monitoring.",
          "Model monitoring signals: data drift, prediction drift, data quality, feature attribution drift and model performance (needs ground truth).",
          "Monitors run on a schedule, compare production data to a reference (training or validation) dataset and alert when thresholds are breached.",
          "Automate retraining: use alerts or Azure Event Grid events to trigger a retraining pipeline, then re-register and redeploy through the CI/CD flow.",
        ],
      },
    ],
    examTips: [
      "Grid sampling requires discrete choice values; Bayesian sampling can't use early termination.",
      "Test new model on live traffic without affecting users → mirror traffic.",
      "Large, non-urgent scoring jobs → batch endpoint; low-latency requests → managed online endpoint.",
      "Input distribution changed vs training → data drift signal.",
    ],
  },
  {
    domain: "genaiops-infra",
    overview:
      "Building the platform for generative AI with Microsoft Foundry: resources and projects, secure access, choosing and deploying foundation models, and managing prompts as versioned assets.",
    sections: [
      {
        heading: "Foundry resources and projects",
        points: [
          "A Foundry resource (formerly Azure AI Foundry, Azure AI Studio) groups models, connections and quota; projects inside it isolate work for a team or app.",
          "Deploy resources, projects, connections and model deployments with Bicep or the Azure CLI so environments are reproducible.",
          "Use managed identities and Microsoft Entra ID (keyless) authentication instead of API keys, with role assignments scoped to the resource or project.",
          "Secure networking: private endpoints, disable public network access, and connect dependent resources (Storage, AI Search, Key Vault) privately.",
        ],
      },
      {
        heading: "Model selection and deployment",
        points: [
          "Use the model catalog, benchmarks and leaderboards to compare quality, cost and latency for the use case.",
          "Deployment options: serverless API / standard (pay per token, no infrastructure), managed compute (dedicated VMs for open models, billed per hour) and provisioned throughput (reserved PTUs).",
          "Standard deployments come in Global, Data Zone and Regional variants; Data Zone keeps processing within a geography (e.g. EU) for data residency.",
          "Provisioned throughput (PTU) gives predictable latency and capacity for high-volume, steady workloads; standard is better for variable or low traffic.",
          "Batch deployments process large asynchronous jobs at a lower price (results within 24 hours).",
          "Version policy: auto-upgrade to the new default version, upgrade when the current version expires, or pin a version (no auto-upgrade) and test before moving.",
          "Rate limits are set as tokens per minute (TPM) per deployment; HTTP 429 means the limit was hit — retry with backoff or raise quota.",
        ],
      },
      {
        heading: "Prompts and flows",
        points: [
          "Treat prompts as code: store templates (e.g. .prompty files) in Git, review via pull requests and evaluate changes in CI before release.",
          "Create prompt variants and compare them on the same evaluation dataset using quality metrics, latency and cost.",
          "Automate deployment of models, prompts and app code with GitHub Actions or Azure DevOps across dev/test/prod.",
        ],
      },
      {
        heading: "Safety and governance",
        points: [
          "Content filters apply per deployment: hate, sexual, violence and self-harm at configurable severity thresholds.",
          "Prompt Shields detect jailbreak attempts and indirect prompt injection in documents; protected material detection flags known copyrighted text or code.",
          "Use Azure Policy and RBAC to control which models can be deployed and who can deploy them.",
        ],
      },
    ],
    examTips: [
      "Predictable latency at high, steady volume → provisioned throughput.",
      "EU data residency with pay-as-you-go → Data Zone standard deployment.",
      "Avoid surprise model behaviour changes → pin the model version / no auto-upgrade.",
      "No keys in code → managed identity + Entra ID role assignment.",
    ],
  },
  {
    domain: "genai-quality",
    overview:
      "Proving a generative AI app is good and safe before release, and watching it in production: evaluation datasets, quality and safety metrics, tracing, latency and token cost.",
    sections: [
      {
        heading: "Evaluation setup",
        points: [
          "Build a test dataset (usually JSONL) with queries plus, where needed, context, ground truth and the app's responses.",
          "Map dataset columns to evaluator inputs (e.g. query, response, context, ground_truth) when the names differ.",
          "Run evaluations with the Azure AI Evaluation SDK (evaluate() with a set of evaluators) or in the Foundry portal; results are logged to the project.",
          "Automate evaluations in CI/CD so a prompt or model change must meet quality thresholds before deployment.",
        ],
      },
      {
        heading: "Quality metrics",
        points: [
          "Groundedness: is the answer supported by the provided context? Needs context. Key for RAG hallucination checks.",
          "Relevance: does the response address the query? Coherence: is it logical and well-structured? Fluency: is the language natural and correct?",
          "Similarity and NLP metrics (F1, BLEU, ROUGE, METEOR) compare the response to ground truth.",
          "Most quality evaluators are AI-assisted (an LLM judge), so they need a judge model deployment; NLP metrics are computed mathematically.",
          "You can add custom evaluators (code-based or prompt-based) for domain-specific criteria.",
        ],
      },
      {
        heading: "Risk and safety evaluation",
        points: [
          "Safety evaluators score hate/unfairness, sexual, violence, self-harm, protected material and indirect attack (XPIA) content.",
          "Generate adversarial test data or use the AI red teaming agent to probe for harmful outputs before release.",
          "Combine evaluation results with content filters and Prompt Shields for defence in depth.",
        ],
      },
      {
        heading: "Observability in production",
        points: [
          "Connect Application Insights to the project to collect traces (OpenTelemetry-based) of each request: prompts, tool calls, retrieval and model calls.",
          "Monitor latency (including time to first token), throughput, error rates (e.g. 429s), and token usage for cost tracking.",
          "Continuous (online) evaluation samples production traffic and scores it with evaluators so quality regressions are caught after release.",
          "Use traces to debug: find the slow step, the failing tool call or the retrieval that returned the wrong documents.",
        ],
      },
    ],
    examTips: [
      "Hallucination check for RAG → groundedness (requires context).",
      "Compare to an expected answer → similarity / F1 (requires ground truth).",
      "Find the slow step in a multi-step app → tracing in Application Insights.",
      "Catch quality drift after release → continuous evaluation on production traffic.",
    ],
  },
  {
    domain: "genai-optimize",
    overview:
      "Making generative AI apps better, faster and cheaper: tuning retrieval for RAG, deciding when and how to fine-tune, and optimising prompts, models and deployments for latency and cost.",
    sections: [
      {
        heading: "RAG optimisation",
        points: [
          "Chunking: smaller chunks give precise matches but can lose context; larger chunks keep context but dilute relevance. Overlap between chunks reduces split-sentence problems.",
          "Hybrid search combines keyword (BM25) and vector search; Azure AI Search merges the result lists with Reciprocal Rank Fusion (RRF).",
          "The semantic ranker re-ranks top results with a language-understanding model for better relevance.",
          "Tune top-k and similarity/strictness thresholds: too low returns noise, too high misses relevant content.",
          "Choose embedding models for quality vs cost (e.g. text-embedding-3-small vs -large; dimensions can be reduced); re-embed the index when you change models.",
          "Evaluate retrieval separately from generation (retrieval metrics, groundedness) and A/B test configuration changes.",
        ],
      },
      {
        heading: "Fine-tuning",
        points: [
          "Try prompt engineering first, then RAG for knowledge; fine-tune to change style, format or behaviour, or to get a smaller model to perform a narrow task well.",
          "Supervised fine-tuning (SFT) learns from example conversations (JSONL chat format). Direct Preference Optimization (DPO) learns from preferred vs rejected responses. Reinforcement fine-tuning uses graders for reasoning models.",
          "Distillation: use outputs of a large model to fine-tune a smaller, cheaper one.",
          "Synthetic data can expand training sets, but review it for quality and bias.",
          "Watch training and validation loss: validation loss rising while training loss falls means overfitting.",
          "Evaluate the fine-tuned model against the base model on the same test set before deploying it.",
        ],
      },
      {
        heading: "Latency and cost",
        points: [
          "Use the smallest model that meets the quality bar (e.g. a mini model for classification or routing).",
          "Reduce tokens: shorter prompts, fewer few-shot examples, a lower max output tokens, and summarised conversation history.",
          "Prompt caching discounts repeated prompt prefixes — put static content (system prompt, instructions) first.",
          "Streaming improves perceived latency; provisioned throughput gives consistent latency at scale.",
          "Batch processing costs less for workloads that don't need an immediate answer.",
          "Track cost per request with token metrics and set budgets/alerts.",
        ],
      },
    ],
    examTips: [
      "Keyword + semantic matching → hybrid search (RRF), optionally with semantic ranker.",
      "Model lacks company knowledge → RAG, not fine-tuning.",
      "Needs consistent output format/style → fine-tuning (SFT).",
      "Cut cost on repeated long system prompts → prompt caching, static content first.",
    ],
  },
];
