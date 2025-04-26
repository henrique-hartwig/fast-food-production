resource "aws_iam_role" "lambda_role" {
  name = "orders-lambda-role-${var.environment}"

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
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_policy" "secrets_access" {
  name        = "orders-secrets-access-${var.environment}"
  description = "Permite acesso ao Secret Manager para o microserviço de Orders"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Effect   = "Allow"
        Resource = var.db_secret_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_secrets_access" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.secrets_access.arn
}

resource "aws_security_group" "lambda_sg" {
  name        = "orders-lambda-sg-${var.environment}"
  description = "Security group para as funções Lambda do microserviço de Orders"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "Orders Lambda Security Group"
    Environment = var.environment
  }
}

# Definição das funções Lambda
locals {
  lambda_functions = {
    create_order = {
      name        = "create-order"
      description = "Cria um novo pedido"
      handler     = "src/application/handlers/createOrder.handler"
    },
    get_order = {
      name        = "get-order"
      description = "Obtém um pedido pelo ID"
      handler     = "src/application/handlers/getOrder.handler"
    },
    list_orders = {
      name        = "list-orders"
      description = "Lista pedidos com paginação"
      handler     = "src/application/handlers/listOrders.handler"
    },
    update_order = {
      name        = "update-order"
      description = "Atualiza um pedido existente"
      handler     = "src/application/handlers/updateOrder.handler"
    },
    delete_order = {
      name        = "delete-order"
      description = "Remove um pedido"
      handler     = "src/application/handlers/deleteOrder.handler"
    }
  }
}

# Criação das funções Lambda
resource "aws_lambda_function" "orders_functions" {
  for_each = local.lambda_functions

  function_name = "orders-${each.value.name}-${var.environment}"
  description   = each.value.description
  role          = aws_iam_role.lambda_role.arn
  handler       = each.value.handler
  
  # O código será implantado pelo Serverless Framework
  filename         = "dummy.zip"
  source_code_hash = filebase64sha256("dummy.zip")
  
  runtime          = "nodejs18.x"
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = {
      NODE_ENV     = var.environment
      DB_SECRET_ARN = var.db_secret_arn
    }
  }

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  tags = {
    Environment = var.environment
    Service     = "orders"
  }

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
  }
} 