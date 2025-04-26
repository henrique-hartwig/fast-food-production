module "network" {
  source = "./modules/network"

  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones  = var.availability_zones
}

module "database" {
  source = "./modules/database"

  environment      = var.environment
  db_instance_class = var.db_instance_class
  db_name          = var.db_name
  db_username      = var.db_username
  db_password      = var.db_password
  vpc_id           = module.network.vpc_id
  subnet_ids       = module.network.private_subnet_ids
}

module "product_category" {
  source = "./modules/lambda/product-category"

  environment        = var.environment
  vpc_id             = module.network.vpc_id
  subnet_ids         = module.network.private_subnet_ids
  db_secret_arn      = module.database.db_secret_arn
  lambda_memory_size = var.lambda_memory_size
  lambda_timeout     = var.lambda_timeout
  lambda_handler     = "src/application/handlers/productCategory/index.handler"

  tags = {
    Service = "ProductCategory"
  }
}

module "api_gateway" {
  source = "./modules/api_gateway"

  environment              = var.environment
  api_name                 = var.api_name
  api_description          = var.api_description
  product_category_lambdas = module.product_category.lambda_functions

  tags = {
    Service = "API"
  }
}
