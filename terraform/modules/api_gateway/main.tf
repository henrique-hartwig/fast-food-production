resource "aws_apigatewayv2_api" "api" {
  name          = "${var.api_name}-${var.environment}"
  description   = var.api_description
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
  
  tags = merge(var.tags, {
    Environment = var.environment
  })
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
  
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_log_group_fast_food.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      integrationLatency = "$context.integrationLatency"
    })
  }
  
  default_route_settings {
    throttling_burst_limit = 100
    throttling_rate_limit  = 50
    data_trace_enabled     = true
    logging_level          = "INFO"
  }
  
  tags = var.tags
}

resource "aws_cloudwatch_log_group" "api_gateway_log_group_fast_food" {
  name              = "/aws/apigateway/${aws_apigatewayv2_api.api.name}"
  retention_in_days = 30
  
  tags = merge(var.tags, {
    Environment = var.environment
  })
}

################################################################################
# ProductCategory
################################################################################

resource "aws_apigatewayv2_integration" "create_product_category" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = var.product_category_lambdas.create.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_product_category" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /product-category"
  target    = "integrations/${aws_apigatewayv2_integration.create_product_category.id}"
}

resource "aws_apigatewayv2_integration" "list_product_categories" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = var.product_category_lambdas.list.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "list_product_categories" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /product-categories"
  target    = "integrations/${aws_apigatewayv2_integration.list_product_categories.id}"
}

resource "aws_apigatewayv2_integration" "get_product_category" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = var.product_category_lambdas.get.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_product_category" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /product-category/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.get_product_category.id}"
}

resource "aws_apigatewayv2_integration" "update_product_category" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = var.product_category_lambdas.update.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "update_product_category" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "PUT /product-category/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.update_product_category.id}"
}

resource "aws_apigatewayv2_integration" "delete_product_category" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = var.product_category_lambdas.delete.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "delete_product_category" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "DELETE /product-category/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.delete_product_category.id}"
}

resource "aws_lambda_permission" "create_product_category" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.product_category_lambdas.create.name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/product-category"
}

resource "aws_lambda_permission" "list_product_categories" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.product_category_lambdas.list.name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/product-categories"
}

resource "aws_lambda_permission" "get_product_category" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.product_category_lambdas.get.name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/product-category/*"
}

resource "aws_lambda_permission" "update_product_category" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.product_category_lambdas.update.name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/product-category/*"
}

resource "aws_lambda_permission" "delete_product_category" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.product_category_lambdas.delete.name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*/product-category/*"
} 