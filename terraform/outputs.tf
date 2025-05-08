output "vpc_id" {
  value = aws_vpc.network.id
}

output "public_subnet_ids" {
  value = aws_subnet.public_subnet_fast_food[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private_subnet_fast_food[*].id
}

output "api_gateway_url" {
  value = aws_apigatewayv2_api.api.api_endpoint
}

output "api_gateway_id" {
  value = aws_apigatewayv2_api.api.id
}

output "api_gateway_execution_arn" {
  value = aws_apigatewayv2_api.api.execution_arn
}