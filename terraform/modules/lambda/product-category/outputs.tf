output "lambda_functions" {
  description = "Information about the product category lambda functions"
  value = {
    create_product_category = {
      name       = aws_lambda_function.product_category_functions["create_product_category"].function_name
      arn        = aws_lambda_function.product_category_functions["create_product_category"].arn
      invoke_arn = aws_lambda_function.product_category_functions["create_product_category"].invoke_arn
    }
    get_product_category = {
      name       = aws_lambda_function.product_category_functions["get_product_category"].function_name
      arn        = aws_lambda_function.product_category_functions["get_product_category"].arn
      invoke_arn = aws_lambda_function.product_category_functions["get_product_category"].invoke_arn
    }
    list_product_categories = {
      name       = aws_lambda_function.product_category_functions["list_product_categories"].function_name
      arn        = aws_lambda_function.product_category_functions["list_product_categories"].arn
      invoke_arn = aws_lambda_function.product_category_functions["list_product_categories"].invoke_arn
    }
    update_product_category = {
      name       = aws_lambda_function.product_category_functions["update_product_category"].function_name
      arn        = aws_lambda_function.product_category_functions["update_product_category"].arn
      invoke_arn = aws_lambda_function.product_category_functions["update_product_category"].invoke_arn
    }
    delete_product_category = {
      name       = aws_lambda_function.product_category_functions["delete_product_category"].function_name
      arn        = aws_lambda_function.product_category_functions["delete_product_category"].arn
      invoke_arn = aws_lambda_function.product_category_functions["delete_product_category"].invoke_arn
    }
  }
}
