resource "aws_security_group" "lambda_sg" {
  name        = "${var.lambda_name}-sg-${var.environment}"
  description = "Security group for the ${var.lambda_name} Lambda function"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.lambda_name} Security Group"
  })
}

locals {
  lambda_functions = {
    create = {
      name        = "create-meal"
      description = "Create a new meal"
      handler     = ".build/meal/useCases/create/handler.handler"
    },
    get = {
      name        = "get-meal"
      description = "Get a meal by ID"
      handler     = ".build/meal/useCases/get/handler.handler"
    },
    list = {
      name        = "list-meals"
      description = "List meals with pagination"
      handler     = ".build/meal/useCases/list/handler.handler"
    },
    update = {
      name        = "update-meal"
      description = "Update an existing meal"
      handler     = ".build/meal/useCases/update/handler.handler"
    },
    delete = {
      name        = "delete-meal"
      description = "Remove a meal"
      handler     = ".build/meal/useCases/delete/handler.handler"
    }
  }
}

resource "aws_lambda_function" "meal_functions" {
  for_each = local.lambda_functions

  function_name = "fast-food-production-${each.value.name}-${var.environment}"
  description   = each.value.description
  role          = "arn:aws:iam::992382498858:role/LabRole"
  handler       = each.value.handler
  
  filename         = "${path.module}/../../../../dist/meal/${each.key}.zip"
  source_code_hash = filebase64sha256("${path.module}/../../../../dist/meal/${each.key}.zip")

  layers           = var.lambda_layers

  runtime          = "nodejs18.x"
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = {
      NODE_ENV     = var.environment
      DATABASE_URL = var.database_url
    }
  }

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  tags = {
    Environment = var.environment
    Service     = "meal"
  }
} 