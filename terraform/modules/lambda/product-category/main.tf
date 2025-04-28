resource "aws_iam_role" "lambda_role" {
  name = "${var.lambda_name}-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

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
      name        = "create-product-category"
      description = "Create a new product category"
      handler     = "application/handlers/productCategory/create.handler"
    },
    get = {
      name        = "get-product-category"
      description = "Get a product category by ID"
      handler     = "application/handlers/productCategory/get.handler"
    },
    list = {
      name        = "list-product-categories"
      description = "List product categories with pagination"
      handler     = "application/handlers/productCategory/list.handler"
    },
    update = {
      name        = "update-product-category"
      description = "Update an existing product category"
      handler     = "application/handlers/productCategory/update.handler"
    },
    delete = {
      name        = "delete-product-category"
      description = "Remove a product category"
      handler     = "application/handlers/productCategory/delete.handler"
    }
  }
}

resource "aws_lambda_function" "product_category_functions" {
  for_each = local.lambda_functions

  function_name = "product-category-${each.value.name}-${var.environment}"
  description   = each.value.description
  role          = "arn:aws:iam::992382498858:role/LabRole"
  handler       = each.value.handler
  
  filename         = "${path.module}/../../../../dist/productCategory/${each.key}.zip"
  source_code_hash = filebase64sha256("${path.module}/../../../../dist/productCategory/${each.key}.zip")
  
  runtime          = "nodejs18.x"
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = {
      NODE_ENV     = var.environment
    }
  }

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  tags = {
    Environment = var.environment
    Service     = "product-category"
  }
} 