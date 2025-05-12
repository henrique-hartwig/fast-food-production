resource "aws_apigatewayv2_integration" "create_meal" {
  api_id                 = var.api_gateway_id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.meal_lambdas.create.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_meal" {
  api_id    = var.api_gateway_id
  route_key = "POST /meal"
  target    = "integrations/${aws_apigatewayv2_integration.create_meal.id}"
}

resource "aws_lambda_permission" "create_meal" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.meal_lambdas.create.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_arn}/*/*/meal"
}

resource "aws_apigatewayv2_integration" "get_meal" {
  api_id                 = var.api_gateway_id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.meal_lambdas.get.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_meal" {
  api_id    = var.api_gateway_id
  route_key = "GET /meal"
  target    = "integrations/${aws_apigatewayv2_integration.get_meal.id}"
}

resource "aws_lambda_permission" "get_meal" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.meal_lambdas.get.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_arn}/*/*/meal"
}

resource "aws_apigatewayv2_integration" "update_meal" {
  api_id                 = var.api_gateway_id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.meal_lambdas.update.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "update_meal" {
  api_id    = var.api_gateway_id
  route_key = "PUT /meal"
  target    = "integrations/${aws_apigatewayv2_integration.update_meal.id}"
}

resource "aws_lambda_permission" "update_meal" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.meal_lambdas.update.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_arn}/*/*/meal"
}

resource "aws_apigatewayv2_integration" "delete_meal" {
  api_id                 = var.api_gateway_id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.meal_lambdas.delete.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "delete_meal" {
  api_id    = var.api_gateway_id
  route_key = "DELETE /meal"
  target    = "integrations/${aws_apigatewayv2_integration.delete_meal.id}"
}

resource "aws_lambda_permission" "delete_meal" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.meal_lambdas.delete.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_arn}/*/*/meal"
}