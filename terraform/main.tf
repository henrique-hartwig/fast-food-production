locals {
  vpc_id             = data.terraform_remote_state.fastfood_orders.outputs.vpc_id
  public_subnet_ids  = data.terraform_remote_state.fastfood_orders.outputs.public_subnet_ids
  private_subnet_ids = data.terraform_remote_state.fastfood_orders.outputs.private_subnet_ids
  api_gateway_id     = data.terraform_remote_state.fastfood_orders.outputs.api_gateway_id
  api_gateway_arn    = data.terraform_remote_state.fastfood_orders.outputs.api_gateway_execution_arn
  orders_api_url     = data.terraform_remote_state.fastfood_orders.outputs.api_gateway_url
  payments_queue_url = data.terraform_remote_state.fastfood_production.outputs.fast_food_payment_production_queue_url
  payments_queue_arn = data.terraform_remote_state.fastfood_production.outputs.fast_food_payment_production_queue_arn
}

module "database" {
  source = "./modules/database"

  environment       = var.environment
  db_instance_class = var.db_instance_class
  db_name           = var.db_name
  db_username       = var.db_username
  db_password       = var.db_password
  db_port           = var.db_port
  vpc_id            = local.vpc_id
  subnet_ids        = local.public_subnet_ids
}

module "meal" {
  source = "./modules/lambda/meal"

  environment        = var.environment
  database_url       = var.database_url
  vpc_id             = local.vpc_id
  subnet_ids         = local.private_subnet_ids
  lambda_memory_size = var.lambda_memory_size
  lambda_timeout     = var.lambda_timeout
  lambda_layers      = [module.lambda_layer.dependencies_layer_arn, module.lambda_layer.prisma_layer_arn]
  payments_queue_url = local.payments_queue_url
  payments_queue_arn = local.payments_queue_arn
  orders_api_url     = local.orders_api_url

  tags = {
    Service = "Meal"
  }
}

module "lambda_layer" {
  source = "./modules/lambda_layer"
}

module "api_gateway_routes" {
  source          = "./modules/api_gateway"
  meal_lambdas    = module.meal.lambda_functions
  api_gateway_id  = local.api_gateway_id
  api_gateway_arn = local.api_gateway_arn
}