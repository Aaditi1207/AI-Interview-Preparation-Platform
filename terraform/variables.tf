variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev/staging/prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used as a prefix for resource naming"
  type        = string
  default     = "ai-interview-prep"
}

variable "bedrock_model_id" {
  description = "Amazon Bedrock model ID (Nova Lite)"
  type        = string
  default     = "amazon.nova-lite-v1:0"
}

variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "python3.12"
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "lambda_memory" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 256
}

variable "cognito_callback_urls" {
  description = "Allowed callback URLs for Cognito hosted UI / app client"
  type        = list(string)
  default     = ["http://localhost:5173"]
}

variable "cognito_logout_urls" {
  description = "Allowed logout URLs for Cognito app client"
  type        = list(string)
  default     = ["http://localhost:5173"]
}

variable "frontend_bucket_name" {
  description = "S3 bucket name for hosting the frontend build (must be globally unique)"
  type        = string
  default     = "ai-interview-prep-frontend-bucket"
}

variable "dynamodb_billing_mode" {
  description = "DynamoDB billing mode"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}
