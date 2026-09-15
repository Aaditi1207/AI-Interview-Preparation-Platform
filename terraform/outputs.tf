output "api_endpoint" {
  value = module.api_gateway.api_endpoint
}

output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}

output "cognito_user_pool_client_id" {
  value = module.cognito.user_pool_client_id
}

output "cognito_domain" {
  value = module.cognito.user_pool_domain
}

output "frontend_bucket_website_endpoint" {
  value = module.s3.website_endpoint
}

output "users_table_name" {
  value = module.dynamodb.users_table_name
}

output "interview_history_table_name" {
  value = module.dynamodb.interview_history_table_name
}
