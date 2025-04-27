variable "environment" {
  description = "Deployment environment (dev, prod)"
  type        = string
  default     = "dev"
}

variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
}

variable "api_description" {
  description = "Description of the API Gateway"
  type        = string
}

variable "product_category_lambdas" {
  description = "Informações sobre as funções lambda de categoria de produto"
  type = map(object({
    name       = string
    arn        = string
    invoke_arn = string
  }))
}

variable "tags" {
  description = "Tags to be applied to the resources"
  type        = map(string)
  default     = {}
}