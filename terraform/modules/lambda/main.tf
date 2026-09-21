locals {
  functions = {
    generate_questions = {
      handler = "generate_questions.handler.lambda_handler"
    }

    evaluate_answers = {
      handler = "evaluate_answers.handler.lambda_handler"
    }

    save_results = {
      handler = "save_results.handler.lambda_handler"
    }

    get_history = {
      handler = "get_history.handler.lambda_handler"
    }
  }
}
data "archive_file" "this" {
  for_each    = local.functions
  type        = "zip"

  source_dir  = "${path.root}/../backend"

  output_path = "${path.module}/build/${each.key}.zip"
}

resource "aws_lambda_function" "this" {
  for_each = local.functions

  function_name = "${var.project_name}-${each.key}-${var.environment}"
  role          = var.lambda_role_arn
  handler       = each.value.handler
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory

  filename         = data.archive_file.this[each.key].output_path
  source_code_hash = data.archive_file.this[each.key].output_base64sha256

  environment {
    variables = {
      USERS_TABLE             = var.users_table_name
      INTERVIEW_HISTORY_TABLE = var.interview_history_table_name
      BEDROCK_MODEL_ID        = var.bedrock_model_id
      ENVIRONMENT              = var.environment
    }
  }
}

resource "aws_cloudwatch_log_group" "this" {
  for_each          = local.functions
  name              = "/aws/lambda/${aws_lambda_function.this[each.key].function_name}"
  retention_in_days = var.log_retention_days
}
