environment = "prod"
aws_region = "us-east-1"

vpc_cidr = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.3.0/24", "10.0.4.0/24"]
availability_zones = ["us-east-1a", "us-east-1b"]

db_instance_class = "db.t3.micro"
db_name = "fast_food_orders"
db_username = "admin"
db_password = "password123"

lambda_memory_size = 256
lambda_timeout = 30

api_name = "fastfood-orders-api"
api_description = "API for the fast food orders microservice" 