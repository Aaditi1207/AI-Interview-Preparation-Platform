output "users_table_name" {
  value = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  value = aws_dynamodb_table.users.arn
}

output "interview_history_table_name" {
  value = aws_dynamodb_table.interview_history.name
}

output "interview_history_table_arn" {
  value = aws_dynamodb_table.interview_history.arn
}
