variable "aws_region" {
  description = "The AWS region to deploy the FastFood Production microservice."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deploy environment (dev, prod)"
  type        = string
  default     = "dev"
}

variable "lambda_memory_size" {
  description = "Memory size for the Lambda functions (MB)"
  type        = number
  default     = 256
}

variable "lambda_timeout" {
  description = "Timeout for the Lambda functions (seconds)"
  type        = number
  default     = 30
}

variable "db_instance_class" {
  description = "RDS instance class for the database"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "fast_food_production"
}

variable "db_username" {
  description = "Username for the database"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Port for the database"
  type        = number
  default     = 5432
}

variable "availability_zones" {
  description = "List of availability zones for the subnets"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "database_url" {
  description = "Database URL"
  type        = string
}