variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "lambda_role_arn" {
  type = string
}

variable "lambda_runtime" {
  type = string
}

variable "lambda_timeout" {
  type = number
}

variable "lambda_memory" {
  type = number
}

variable "users_table_name" {
  type = string
}

variable "interview_history_table_name" {
  type = string
}

variable "bedrock_model_id" {
  type = string
}

variable "log_retention_days" {
  type = number
}
