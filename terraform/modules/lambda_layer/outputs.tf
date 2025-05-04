output "dependencies_layer_arn" {
  value       = aws_lambda_layer_version.lambda_layer_dependencies.arn
  description = "Lambda Layer Dependencies ARN"
}

output "prisma_layer_arn" {
  value       = aws_lambda_layer_version.lambda_layer_prisma.arn
  description = "Lambda Layer Prisma ARN"
}