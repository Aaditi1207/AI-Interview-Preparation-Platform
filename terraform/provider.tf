terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Fill these in via -backend-config or edit directly
    # bucket = "ai-interview-prep-tfstate"
    # key    = "prod/terraform.tfstate"
    # region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "ai-interview-prep-platform"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
