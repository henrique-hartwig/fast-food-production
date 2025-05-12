resource "aws_lambda_layer_version" "lambda_layer_dependencies" {
  filename   = "${path.module}/dependencies/fastfood-production-lambda-layer.zip"
  layer_name = "fastfood-production-lambda-layer"
  compatible_runtimes = ["nodejs18.x"]
  skip_destroy = true
  description = "Fast Food Lambda Layer"
}

resource "aws_lambda_layer_version" "lambda_layer_prisma" {
  filename   = "${path.module}/prisma/fastfood-production-lambda-layer-prisma.zip"
  layer_name = "fastfood-production-lambda-layer-prisma"
  compatible_runtimes = ["nodejs18.x"]
  skip_destroy = true
  description = "Fast Food Lambda Layer Prisma"
}