# resource "aws_iam_role" "lambda_role" {
#   name = "orders-lambda-role-${var.environment}"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Effect = "Allow"
#         Principal = {
#           Service = "lambda.amazonaws.com"
#         }
#       }
#     ]
#   })

#   tags = var.tags
# }

# resource "aws_iam_role_policy_attachment" "lambda_basic" {
#   role       = "arn:aws:iam::992382498858:role/LabRole"
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }

# resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
#   role       = "arn:aws:iam::992382498858:role/LabRole"
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
# }

resource "aws_security_group" "lambda_sg" {
  name        = "orders-lambda-sg-${var.environment}"
  description = "Security group for the Lambda functions of the Orders microservice"
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

locals {
  lambda_functions = {
    create = {
      name        = "create-order"
      description = "Cria um novo pedido"
      handler     = "./src/order/useCases/create/handler.ts"
    },
    get = {
      name        = "get-order"
      description = "Obtém um pedido pelo ID"
      handler     = "./src/order/useCases/get/handler.ts"
    },
    list = {
      name        = "list-orders"
      description = "Lista pedidos com paginação"
      handler     = "./src/order/useCases/list/handler.ts"
    },
    update = {
      name        = "update-order"
      description = "Atualiza um pedido existente"
      handler     = "./src/order/useCases/update/handler.ts"
    },
    update_status = {
      name        = "update-order-status"
      description = "Atualiza o status de um pedido existente"
      handler     = "./src/order/useCases/update_status/handler.ts"
    },
    delete = {
      name        = "delete-order"
      description = "Remove um pedido"
      handler     = "./src/order/useCases/delete/handler.ts"
    }
  }
}

# Criação das funções Lambda
resource "aws_lambda_function" "orders_functions" {
  for_each = local.lambda_functions

  function_name = "fast-food-orders-${each.value.name}-${var.environment}"
  description   = each.value.description
  role          = "arn:aws:iam::992382498858:role/LabRole"
  handler       = each.value.handler
  
  filename         = "${path.module}/../../../../dist/order/${each.key}.zip"
  source_code_hash = filebase64sha256("${path.module}/../../../../dist/order/${each.key}.zip")
  
  layers           = [var.lambda_layer_arn]

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
    Service     = "orders"
  }
} 