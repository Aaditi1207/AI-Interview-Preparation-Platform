resource "aws_dynamodb_table" "users" {
  name         = "${var.project_name}-Users-${var.environment}"
  billing_mode = var.billing_mode
  hash_key     = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }
}

resource "aws_dynamodb_table" "interview_history" {
  name         = "${var.project_name}-InterviewHistory-${var.environment}"
  billing_mode = var.billing_mode
  hash_key     = "user_id"
  range_key    = "interview_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "interview_id"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  global_secondary_index {
    name            = "created_at-index"
    hash_key        = "user_id"
    range_key       = "created_at"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }
}
