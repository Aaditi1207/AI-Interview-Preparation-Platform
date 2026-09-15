module "dynamodb" {
  source       = "./modules/dynamodb"
  project_name = var.project_name
  environment  = var.environment
  billing_mode = var.dynamodb_billing_mode
}

module "cognito" {
  source        = "./modules/cognito"
  project_name  = var.project_name
  environment   = var.environment
  callback_urls = var.cognito_callback_urls
  logout_urls   = var.cognito_logout_urls
}

module "iam" {
  source                       = "./modules/iam"
  project_name                 = var.project_name
  environment                  = var.environment
  users_table_arn              = module.dynamodb.users_table_arn
  interview_history_table_arn  = module.dynamodb.interview_history_table_arn
}

module "lambda" {
  source                        = "./modules/lambda"
  project_name                  = var.project_name
  environment                   = var.environment
  lambda_role_arn                = module.iam.lambda_role_arn
  lambda_runtime                 = var.lambda_runtime
  lambda_timeout                  = var.lambda_timeout
  lambda_memory                   = var.lambda_memory
  users_table_name                = module.dynamodb.users_table_name
  interview_history_table_name    = module.dynamodb.interview_history_table_name
  bedrock_model_id                = var.bedrock_model_id
  log_retention_days              = var.log_retention_days
}

module "api_gateway" {
  source                 = "./modules/api_gateway"
  project_name           = var.project_name
  environment             = var.environment
  aws_region               = var.aws_region
  cognito_user_pool_id     = module.cognito.user_pool_id
  cognito_client_id        = module.cognito.user_pool_client_id
  lambda_invoke_arns       = module.lambda.function_invoke_arns
  lambda_function_names    = module.lambda.function_names
}

module "s3" {
  source                = "./modules/s3"
  frontend_bucket_name  = var.frontend_bucket_name
}

module "cloudwatch" {
  source                  = "./modules/cloudwatch"
  project_name            = var.project_name
  environment             = var.environment
  aws_region              = var.aws_region
  lambda_function_names   = module.lambda.function_names
}
