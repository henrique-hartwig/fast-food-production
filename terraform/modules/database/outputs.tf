output "db_instance_endpoint" {
  value       = aws_db_instance.db_fast_food_production.endpoint
  description = "Database endpoint"
}

output "db_instance_address" {
  value       = aws_db_instance.db_fast_food_production.address
  description = "Database address"
}
