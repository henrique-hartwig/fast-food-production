provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Fast Food Orders Microservice"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "fastfood-db-terraform-state"
    key    = "orders/terraform.tfstate"
    region = "us-east-1"
  }
}