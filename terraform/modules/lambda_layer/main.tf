resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = "${path.module}/../../../../layers/layer.zip"
  layer_name = "fast-food-lambda-layer"
  compatible_runtimes = ["nodejs18.x"]

  description = "Fast Food Lambda Layer"
}