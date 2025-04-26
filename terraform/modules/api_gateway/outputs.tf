output "api_endpoint" {
  description = "Base URL of the API Gateway"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "api_id" {
  description = "ID of the API Gateway"
  value       = aws_apigatewayv2_api.api.id
}

output "api_execution_arn" {
  description = "ARN of the API Gateway"
  value       = aws_apigatewayv2_api.api.execution_arn
}

output "stage_name" {
  description = "Name of the API Gateway stage"
  value       = aws_apigatewayv2_stage.default.name
} 