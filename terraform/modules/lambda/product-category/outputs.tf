output "lambda_functions" {
  value = {
    for k, v in aws_lambda_function.product_category_functions : k => {
      function_name = v.function_name
      arn           = v.arn
      invoke_arn    = v.invoke_arn
    }
  }
  description = "Details of the Lambda functions created"
}

output "lambda_role_arn" {
  value       = aws_iam_role.lambda_role.arn
  description = "ARN of the IAM role used by the Lambda functions"
} 
